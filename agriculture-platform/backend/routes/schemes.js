import { Router } from 'express';
import { Scheme } from '../models/Scheme.js';
import { protect, authorize } from '../middleware/auth.js';
import { seedSchemes } from '../scripts/seedSchemes.js';

const router = Router();

/**
 * Helper to ensure base schemes are seeded on first access
 */
let isSeededChecked = false;
const ensureSeeded = async () => {
  if (isSeededChecked) return;
  try {
    const count = await Scheme.countDocuments();
    if (count === 0) {
      console.log('Schemes collection is empty. Auto-seeding initial government schemes...');
      await seedSchemes();
    }
    isSeededChecked = true;
  } catch (err) {
    console.warn('Schemes auto-seed check skipped:', err.message);
  }
};

/**
 * 1. GET /api/schemes/categories
 * Returns available categories and departments for filtering
 */
router.get('/categories', async (req, res, next) => {
  try {
    await ensureSeeded();
    const categories = await Scheme.distinct('category', { isActive: true });
    const departments = await Scheme.distinct('department', { isActive: true });
    res.json({ categories, departments });
  } catch (error) {
    next(error);
  }
});

/**
 * 2. GET /api/schemes
 * Filterable list of all active government schemes
 */
router.get('/', async (req, res, next) => {
  try {
    await ensureSeeded();
    const { category, department, landSize, search, includeInactive } = req.query;

    const filter = {};
    if (!includeInactive) {
      filter.isActive = true;
    }

    if (category && category !== 'All') {
      filter.category = category;
    }

    if (department && department !== 'All') {
      filter.department = department;
    }

    if (landSize && landSize !== 'all') {
      filter.eligibleLandholding = { $in: [landSize] };
    }

    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      filter.$or = [
        { title: regex },
        { titleTa: regex },
        { description: regex },
        { descriptionTa: regex },
        { tags: regex },
        { schemeCode: regex }
      ];
    }

    const schemes = await Scheme.find(filter).sort({ department: 1, createdAt: -1 });
    res.json(schemes);
  } catch (error) {
    next(error);
  }
});

/**
 * 3. GET /api/schemes/:id
 * Retrieve single scheme by MongoDB _id or schemeCode
 */
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    let scheme;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      scheme = await Scheme.findById(id);
    } else {
      scheme = await Scheme.findOne({ schemeCode: id.toUpperCase() });
    }

    if (!scheme) {
      return res.status(404).json({ message: 'Government scheme not found' });
    }

    res.json(scheme);
  } catch (error) {
    next(error);
  }
});

/**
 * 4. POST /api/schemes
 * Admin only: Create a new government scheme
 */
router.post('/', protect, authorize('admin'), async (req, res, next) => {
  try {
    const scheme = await Scheme.create(req.body);
    res.status(201).json(scheme);
  } catch (error) {
    next(error);
  }
});

/**
 * 5. PUT /api/schemes/:id
 * Admin only: Update an existing scheme
 */
router.put('/:id', protect, authorize('admin'), async (req, res, next) => {
  try {
    const scheme = await Scheme.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!scheme) {
      return res.status(404).json({ message: 'Scheme not found' });
    }
    res.json(scheme);
  } catch (error) {
    next(error);
  }
});

/**
 * 6. DELETE /api/schemes/:id
 * Admin only: Delete a scheme
 */
router.delete('/:id', protect, authorize('admin'), async (req, res, next) => {
  try {
    const scheme = await Scheme.findByIdAndDelete(req.params.id);
    if (!scheme) {
      return res.status(404).json({ message: 'Scheme not found' });
    }
    res.json({ message: 'Scheme successfully removed' });
  } catch (error) {
    next(error);
  }
});

export default router;
