import dotenv from 'dotenv';
dotenv.config();

const SYSTEM_PROMPT = `
You are "AgriBot", the intelligent, friendly, and expert agricultural AI assistant embedded within AgriConnect (Integrated Digital Agriculture Platform).
Your mission is to empower farmers, agricultural produce buyers, and equipment rental owners with practical advice, website guidance, and technical farming know-how.

Key Platform Knowledge:
1. Marketplace & Selling:
   - Farmers can list agricultural produce (cereals, fruits, vegetables, pulses, commercial crops) with images, quantity, pricing, and contact phone numbers.
   - Buyers can search products, add items to Cart, place orders (Cash on Delivery / Direct), and track their purchase statuses.
2. Equipment Rental:
   - Rental owners list tractors, tillers, harvesters, sprayers, and rotavators with hourly/daily rental rates and attachments.
   - Farmers can browse by district (Tamil Nadu locations) and book equipment with rental start/end dates.
3. Community & Collaboration:
   - Farmers can post queries, share photos of crops, and comment to share farming techniques and advice.
4. Agri Doctors Directory:
   - A regional directory of certified agricultural doctors with phone numbers and WhatsApp links for instant advisory.
5. Fertilizer Price Tracker:
   - Live Agrisnet maximum retail prices for fertilizers (Urea, DAP, Potash, MOP, Complex) across Tamil Nadu in English and Tamil.
6. Government Schemes & Subsidies:
   - Curated Central & Tamil Nadu welfare schemes:
     * PM-KISAN (₹6,000/yr direct income support)
     * Micro Irrigation Scheme (PMKSY) - 100% subsidy for small/marginal farmers, 75% for others on drip/sprinkler
     * SMAM Machinery Subsidy - 40% to 50% subsidy on tractors and power tillers
     * PMFBY - Crop insurance at 1.5% to 2% premium
     * PM-KUSUM - Up to 70% subsidy for solar water pump sets
     * CM Uzhavar Pathukappu Thittam - social welfare & accident relief
     * TANGEDCO Free Farm Electricity
     * Kisan Credit Card (KCC) - low interest 4% crop loans.

Farming Guidance Expertise:
- Crop diseases & pest control (organic neem oil, bio-fungicides, chemical controls).
- Soil health, composting, NPK ratio balancing.
- Seasonal sowing advice (Kharif, Rabi, Samba, Kuruvai seasons).

Language Style:
- Respond fluently in the language the user asks (English or Tamil தமிழ்).
- Keep responses warm, respectful, practical, structured, and easy to read with bullet points and emojis.
- Keep responses concise (under 250 words unless detailed steps are requested).
`.trim();

// Fallback intelligent response generator if API key is rate-limited or offline
const getLocalSmartResponse = (query, isTa) => {
  const q = (query || '').toLowerCase();

  // Government schemes & subsidies
  if (q.includes('scheme') || q.includes('subsidy') || q.includes('pm kisan') || q.includes('drip') || q.includes('மானியம்') || q.includes('திட்டம்')) {
    if (isTa) {
      return `🏛️ **அரசு விவசாய நலத்திட்டங்கள் & மானியங்கள்:**\n\n1. **சொட்டு நீர் பாசன மானியம் (PMKSY):** சிறு & குறு விவசாயிகளுக்கு **100% முழு மானியம்**, இதர விவசாயிகளுக்கு **75% மானியம்**.\n2. **PM-KISAN:** ஆண்டுக்கு **₹6,000** நேரடி வங்கி பண உதவி (3 தவணைகளில் ₹2,000).\n3. **விவசாய இயந்திரங்கள் (SMAM):** டிராக்டர், பவர் டில்லர் வாங்க **40% முதல் 50% வரை மானியம்**.\n4. **பயிர் காப்பீடு (PMFBY):** குறைந்த பிரீமியத்தில் (1.5% - 2%) இயற்கை பேரிடர் பயிர் இழப்பிற்கு இழப்பீடு.\n\n👉 மேல் மெனுவில் உள்ள **'Govt Schemes'** பக்கத்திற்கு சென்று ஆவணங்களை சரிபார்த்து உடனே விண்ணப்பிக்கலாம்!`;
    }
    return `🏛️ **Key Government Agricultural Schemes & Subsidies:**\n\n1. **Micro-Irrigation (PMKSY):** **100% Subsidy** for Small & Marginal farmers (< 5 acres) and **75%** for others for Drip & Sprinkler setups.\n2. **PM-KISAN:** **₹6,000 / year** direct benefit transfer in 3 installments of ₹2,000.\n3. **Farm Machinery Subsidy (SMAM):** **40% to 50% subsidy** on purchasing Tractors, Power Tillers, and Rotavators.\n4. **Crop Insurance (PMFBY):** Nominal 1.5%–2% premium against flood and drought crop damages.\n\n👉 Visit the **'Govt Schemes'** page in AgriConnect to check your eligibility and document checklist!`;
  }

  // Equipment & Machinery rental
  if (q.includes('tractor') || q.includes('equipment') || q.includes('rent') || q.includes('machine') || q.includes('டிராக்டர்') || q.includes('இயந்திரம்')) {
    if (isTa) {
      return `🚜 **வேளாண் இயந்திரங்கள் வாடகைக்கு எடுக்க:**\n\n1. உங்கள் டாஷ்போர்டில் **'Rent Equipment'** அல்லது மேல் மெனுவில் **'Equipment'** கிளிக் செய்யவும்.\n2. உங்கள் மாவட்டம் (எ.கா. கோயம்புத்தூர், மதுரை, தஞ்சாவூர்) தேர்வு செய்து அருகிலுள்ள டிராக்டர்கள் மற்றும் பவர் டில்லர்களை காணலாம்.\n3. வாடகை காலம் மற்றும் நிலப்பரப்பை (Acres) உள்ளிட்டு **'View & Book'** கிளிக் செய்யவும்.\n4. இயந்திர உரிமையாளர் உங்கள் கோரிக்கையை உறுதி செய்வார்.`;
    }
    return `🚜 **How to Rent Farm Equipment on AgriConnect:**\n\n1. Navigate to **'Equipment'** or select **'Rent Equipment'** from your Farmer Dashboard sidebar.\n2. Filter machinery by your district (e.g., Coimbatore, Thanjavur, Salem) to find nearby equipment.\n3. Browse Tractors, Harvesters, and Tillers with hourly rates.\n4. Click **'View & Book'**, specify your rental dates & farm acreage, and submit your request.`;
  }

  // Selling produce / Marketplace
  if (q.includes('sell') || q.includes('market') || q.includes('product') || q.includes('order') || q.includes('விற்பனை') || q.includes('பொருள்')) {
    if (isTa) {
      return `🌾 **உங்கள் பயிர்களை விற்க:**\n\n1. விவசாயி டாஷ்போர்டில் **'My Products'** பகுதிக்குச் செல்லவும்.\n2. **'Add New Product'** கிளிக் செய்து பயிர் பெயர், வகை, விலை (₹/கிலோ), இருப்பு மற்றும் புகைப்படத்தை பதிவேற்றவும்.\n3. உங்கள் பொருள் வாங்குபவர்கள் சந்தையில் (Marketplace) உடனடியாக தோன்றும்.\n4. வாங்குபவர்கள் ஆர்டர் செய்ததும் **'Orders'** தாவலில் ஏற்றுக்கொள்ளலாம்.`;
    }
    return `🌾 **How to Sell Crops on AgriConnect:**\n\n1. Go to your **Farmer Dashboard** and click **'My Products'**.\n2. Click **'Add Product'** and enter the crop name, category, price per kg/quintal, available quantity, and upload a photo.\n3. Once submitted, buyers can discover your harvest in the **Marketplace**.\n4. When a buyer places an order, review and confirm it under your **'Orders'** section!`;
  }

  // Fertilizer prices
  if (q.includes('fertilizer') || q.includes('urea') || q.includes('dap') || q.includes('potash') || q.includes('உரம்') || q.includes('யூரியா')) {
    if (isTa) {
      return `🌱 **உரங்கள் மற்றும் விலை விவரங்கள்:**\n\n- அக்ரிகனெக்ட்டில் நேரடி **Agrisnet** விலைகளை அறியலாம்:\n  * **யூரியா (Urea 45kg):** அரசு மானிய விலை ₹266.50\n  * **டி.ஏ.பி (DAP 50kg):** ₹1,350\n  * **பொட்டாஷ் (MOP 50kg):** ₹1,650 - ₹1,700\n\n👉 மேல் மெனுவில் உள்ள **'Fertilizer Prices'** பகுதிக்குச் சென்று அனைத்து நிறுவன உரங்களின் அதிகபட்ச சில்லறை விலையை சரிபார்க்கவும்.`;
    }
    return `🌱 **Fertilizer Prices on AgriConnect:**\n\n- Track official Agrisnet retail price caps directly on AgriConnect:\n  * **Urea (45 kg):** Subsidized price ~₹266.50\n  * **DAP (50 kg):** ~₹1,350\n  * **MOP / Potash (50 kg):** ~₹1,650 – ₹1,700\n\n👉 Click **'Fertilizer Prices'** in the top navigation bar to search live prices across various manufacturers in English & Tamil.`;
  }

  // Doctors
  if (q.includes('doctor') || q.includes('agri doctor') || q.includes('disease') || q.includes('pest') || q.includes('மருத்துவர்') || q.includes('பூச்சி')) {
    if (isTa) {
      return `👨‍⚕️ **வேளாண் மருத்துவர் மற்றும் பயிர் பாதுகாப்பு:**\n\n1. உங்கள் டாஷ்போர்டில் **'Agri Doctors'** தாவலை கிளிக் செய்யவும்.\n2. உங்கள் மாவட்டத்தை தேர்வு செய்து, அருகிலுள்ள சான்றளிக்கப்பட்ட வேளாண் ஆலோசகர்களை காணலாம்.\n3. **📞 Call** அல்லது **💬 WhatsApp** பட்டன் மூலம் நேரடியாக பேசி பயிர் நோய் மற்றும் பூச்சி மேலாண்மை ஆலோசனைகளை பெறலாம்!\`;
    }
    return `👨‍⚕️ **Consulting Agricultural Doctors on AgriConnect:**\n\n1. In your Farmer Dashboard, click on **'Agri Doctors'**.\n2. Filter by your district in Tamil Nadu to find certified agronomists and plant doctors.\n3. Use the one-click **'Call'** or **'WhatsApp'** buttons to share crop disease photos and get expert remedy prescriptions.`;
  }

  // Default welcome / general
  if (isTa) {
    return `வணக்கம்! நான் உங்கள் **AgriBot** வேளாண் AI உதவியாளர்.🌾\n\nநான் உங்களுக்கு பின்வரும் உதவிகளை செய்ய முடியும்:\n- 🏛️ அரசு மானியங்கள் மற்றும் நலத்திட்டங்கள் (சொட்டு நீர் பாசனம், PM-KISAN)\n- 🚜 டிராக்டர் மற்றும் வேளாண் கருவிகள் வாடகை\n- 🌾 விளைபொருட்களை சந்தையில் விற்பனை செய்தல்\n- 🌱 உரங்களின் நேரடி விலை நிலவரம்\n- 👨‍⚕️ வேளாண் மருத்துவர் தொடர்பு\n\nஉங்களுக்கு என்ன தகவல் வேண்டும் என்பதை தட்டச்சு செய்யவும்!`;
  }
  return `Hello! I am **AgriBot**, your AgriConnect AI farming assistant. 🌾\n\nHere is how I can help you:\n- 🏛️ **Government Subsidies:** 100% drip irrigation, PM-KISAN, machinery subsidies\n- 🚜 **Machinery Rental:** Find & book tractors, tillers, and harvesters\n- 🌾 **Marketplace:** Listing crops, order processing, and buying farm produce\n- 🌱 **Fertilizer Tracker:** Real-time Agrisnet retail prices\n- 👨‍⚕️ **Agri Doctors:** Consult regional crop experts via Call/WhatsApp\n\nWhat would you like to know today?`;
};

/**
 * Call Google Gemini API
 */
const callGeminiAPI = async (message, history = [], apiKey) => {
  const models = ['gemini-1.5-flash', 'gemini-2.0-flash', 'gemini-1.5-pro'];

  // Construct message sequence
  const contents = [];

  // Include up to 6 past conversation turns for context
  if (Array.isArray(history) && history.length > 0) {
    const recentHistory = history.slice(-6);
    for (const h of recentHistory) {
      if (!h.text) continue;
      contents.push({
        role: h.role === 'model' || h.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: String(h.text) }]
      });
    }
  }

  // Add the current user message
  contents.push({
    role: 'user',
    parts: [{ text: String(message) }]
  });

  // Try models with fallback
  for (const model of models) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: SYSTEM_PROMPT }]
          },
          contents: contents,
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 900
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        const candidateText =
          data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (candidateText && candidateText.trim()) {
          return candidateText.trim();
        }
      } else {
        const errBody = await response.text();
        console.warn(`Gemini model ${model} returned HTTP ${response.status}:`, errBody);
      }
    } catch (err) {
      console.warn(`Gemini API call failed for model ${model}:`, err.message);
    }
  }

  throw new Error('All Gemini model calls failed or timed out');
};

/**
 * Controller: Handle chat request
 * POST /api/chat
 */
export const handleChat = async (req, res) => {
  const { message, history = [], language = 'en' } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({ error: 'Message cannot be empty' });
  }

  const isTa =
    language === 'ta' ||
    /[\u0B80-\u0BFF]/.test(message); // Detect Tamil characters

  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey && apiKey !== 'your_gemini_api_key_here') {
    try {
      const reply = await callGeminiAPI(message, history, apiKey);
      return res.json({
        reply,
        source: 'gemini',
        language: isTa ? 'ta' : 'en'
      });
    } catch (err) {
      console.warn('Gemini request failed, providing local smart answer:', err.message);
    }
  }

  // Fallback to domain-specific knowledge base
  const localReply = getLocalSmartResponse(message, isTa);
  return res.json({
    reply: localReply,
    source: 'local_knowledge_base',
    language: isTa ? 'ta' : 'en'
  });
};
