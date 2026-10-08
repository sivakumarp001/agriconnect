import { Router } from 'express';
import { Fertilizer, PriceCache } from '../models/Fertilizer.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

const DEFAULT_AGRISNET_BASE = 'http://115.243.209.84/people_app/fertilizer_price/fertDetails';
const REQUEST_TIMEOUT_MS = 8000;

/**
 * Helper to fetch fertilizer details from AGRISNET server via HTTP POST
 */
const fetchAgrisnetPrice = async (agrisnetId) => {
  const baseUrl = (process.env.AGRISNET_BASE || DEFAULT_AGRISNET_BASE).replace(/\/$/, '');
  const targetUrl = `${baseUrl}/${agrisnetId}`;

  // Use global fetch with AbortController for 8 second timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'AgriConnect/1.0 (Agriculture Platform)'
      },
      body: '',
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`AGRISNET returned status ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
};

/**
 * 1. GET /api/fertilizers
 * Returns all fertilizers: popular items first, then by sortOrder and nameTa
 */
router.get('/', async (req, res, next) => {
  try {
    const fertilizers = await Fertilizer.find()
      .sort({ isPopular: -1, sortOrder: 1, nameTa: 1 })
      .lean();

    return res.json(fertilizers);
  } catch (error) {
    next(error);
  }
});

/**
 * 2. GET /api/fertilizers/:agrisnetId/prices
 * Returns company-wise prices for a specific fertilizer, utilizing MongoDB 24-hr cache,
 * live AGRISNET fallback, and offline old-cache safety.
 */
router.get('/:agrisnetId/prices', async (req, res) => {
  const { agrisnetId } = req.params;

  try {
    // 1. Validate agrisnetId exists in our database
    const fertilizer = await Fertilizer.findOne({ agrisnetId }).lean();
    if (!fertilizer) {
      return res.status(404).json({ message: 'Fertilizer not found' });
    }

    const unit = agrisnetId === '1' ? '45 kg' : '50 kg';
    const cacheHours = Number(process.env.CACHE_HOURS) || 24;
    const cacheMaxAgeMs = cacheHours * 60 * 60 * 1000;

    // Check existing cache
    const existingCache = await PriceCache.findOne({ agrisnetId }).lean();

    if (existingCache && existingCache.fetchedAt) {
      const cacheAgeMs = Date.now() - new Date(existingCache.fetchedAt).getTime();
      if (cacheAgeMs < cacheMaxAgeMs && Array.isArray(existingCache.prices) && existingCache.prices.length > 0) {
        return res.json({
          agrisnetId,
          fertilizerName: fertilizer.nameEn || fertilizer.nameTa,
          fertilizerNameTa: fertilizer.nameTa,
          fertilizerNameEn: fertilizer.nameEn || '',
          unit: existingCache.unit || unit,
          prices: existingCache.prices,
          fetchedAt: existingCache.fetchedAt,
          source: 'cache'
        });
      }
    }

    // 2. Fetch live data from AGRISNET
    let liveData;
    try {
      liveData = await fetchAgrisnetPrice(agrisnetId);
    } catch (fetchError) {
      console.warn(`AGRISNET live fetch failed for ID ${agrisnetId}:`, fetchError.message);
      // Fallback to old cache if available
      if (existingCache && Array.isArray(existingCache.prices) && existingCache.prices.length > 0) {
        return res.json({
          agrisnetId,
          fertilizerName: fertilizer.nameEn || fertilizer.nameTa,
          fertilizerNameTa: fertilizer.nameTa,
          fertilizerNameEn: fertilizer.nameEn || '',
          unit: existingCache.unit || unit,
          prices: existingCache.prices,
          fetchedAt: existingCache.fetchedAt,
          source: 'old-cache'
        });
      }

      return res.status(502).json({
        message: 'Price not available now'
      });
    }

    // 3. Parse and normalize live data
    // Tolerate raw array or { data: [...] }
    const rawItems = Array.isArray(liveData)
      ? liveData
      : (Array.isArray(liveData?.data) ? liveData.data : []);

    const sanitizedPrices = rawItems
      .map((item) => {
        const companyEn = (item.company || item.company_tamil || '').trim();
        const companyTa = (item.company_tamil || item.company || '').trim();
        const price = Number(item.price);
        return {
          company: companyEn,
          companyTamil: companyTa,
          price
        };
      })
      .filter((item) => item.company && !isNaN(item.price) && item.price > 0)
      .sort((a, b) => a.price - b.price);

    // If live data had 0 valid prices, fallback to old cache or return 502
    if (sanitizedPrices.length === 0) {
      if (existingCache && Array.isArray(existingCache.prices) && existingCache.prices.length > 0) {
        return res.json({
          agrisnetId,
          fertilizerName: fertilizer.nameEn || fertilizer.nameTa,
          fertilizerNameTa: fertilizer.nameTa,
          fertilizerNameEn: fertilizer.nameEn || '',
          unit: existingCache.unit || unit,
          prices: existingCache.prices,
          fetchedAt: existingCache.fetchedAt,
          source: 'old-cache'
        });
      }
      return res.status(502).json({
        message: 'Price not available now'
      });
    }

    // 4. Upsert PriceCache
    const updatedCache = await PriceCache.findOneAndUpdate(
      { agrisnetId },
      {
        $set: {
          agrisnetId,
          prices: sanitizedPrices,
          unit,
          fetchedAt: new Date()
        }
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return res.json({
      agrisnetId,
      fertilizerName: fertilizer.nameEn || fertilizer.nameTa,
      fertilizerNameTa: fertilizer.nameTa,
      fertilizerNameEn: fertilizer.nameEn || '',
      unit,
      prices: sanitizedPrices,
      fetchedAt: updatedCache.fetchedAt,
      source: 'live'
    });
  } catch (error) {
    console.error('Error handling fertilizer prices:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * 3. PUT /api/fertilizers/:agrisnetId/prices (Optional Admin Override)
 * Allows administrator to manually set/override prices when AGRISNET is offline
 */
router.put('/:agrisnetId/prices', protect, authorize('admin'), async (req, res) => {
  const { agrisnetId } = req.params;
  const { prices, unit } = req.body;

  try {
    const fertilizer = await Fertilizer.findOne({ agrisnetId });
    if (!fertilizer) {
      return res.status(404).json({ message: 'Fertilizer not found' });
    }

    if (!Array.isArray(prices) || prices.length === 0) {
      return res.status(400).json({ message: 'Valid prices array is required' });
    }

    const defaultUnit = agrisnetId === '1' ? '45 kg' : '50 kg';
    const cleanPrices = prices
      .map((p) => ({
        company: String(p.company || '').trim(),
        price: Number(p.price)
      }))
      .filter((p) => p.company && !isNaN(p.price) && p.price > 0)
      .sort((a, b) => a.price - b.price);

    const updated = await PriceCache.findOneAndUpdate(
      { agrisnetId },
      {
        $set: {
          agrisnetId,
          prices: cleanPrices,
          unit: unit || defaultUnit,
          fetchedAt: new Date()
        }
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return res.json({
      agrisnetId,
      fertilizerName: fertilizer.nameTa,
      fertilizerNameEn: fertilizer.nameEn || '',
      unit: updated.unit,
      prices: updated.prices,
      fetchedAt: updated.fetchedAt,
      source: 'manual'
    });
  } catch (error) {
    console.error('Error overriding fertilizer prices:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
