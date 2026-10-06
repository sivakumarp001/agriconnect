import mongoose from 'mongoose';

const fertilizerSchema = new mongoose.Schema(
  {
    agrisnetId: { type: String, required: true, unique: true, index: true },
    nameTa: { type: String, required: true, trim: true },
    nameEn: { type: String, trim: true },
    isPopular: { type: Boolean, default: false },
    sortOrder: { type: Number, default: 999 }
  },
  { timestamps: true }
);

const priceCacheSchema = new mongoose.Schema(
  {
    agrisnetId: { type: String, required: true, unique: true, index: true },
    prices: [
      {
        company: { type: String, required: true },
        companyTamil: { type: String },
        price: { type: Number, required: true }
      }
    ],
    unit: { type: String, default: '50 kg' },
    fetchedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export const Fertilizer = mongoose.models.Fertilizer || mongoose.model('Fertilizer', fertilizerSchema);
export const PriceCache = mongoose.models.PriceCache || mongoose.model('PriceCache', priceCacheSchema);

export default Fertilizer;
