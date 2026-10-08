import mongoose from 'mongoose';

const schemeSchema = new mongoose.Schema(
  {
    schemeCode: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true, trim: true },
    titleTa: { type: String, trim: true },
    description: { type: String, required: true },
    descriptionTa: { type: String },
    department: {
      type: String,
      required: true,
      enum: ['Central', 'State - Tamil Nadu', 'Central & State'],
      default: 'Central'
    },
    category: {
      type: String,
      required: true,
      enum: [
        'Income Support',
        'Irrigation',
        'Machinery',
        'Insurance',
        'Solar & Energy',
        'Credit & Finance',
        'Inputs & Seeds',
        'Social Welfare'
      ],
      default: 'Income Support'
    },
    subsidyRate: { type: String, required: true },
    maxBenefit: { type: String },
    targetBeneficiary: { type: String },
    targetBeneficiaryTa: { type: String },
    eligibleLandholding: {
      type: [String],
      default: ['marginal', 'small', 'large']
    },
    eligibilityCriteria: {
      type: [String],
      default: []
    },
    eligibilityCriteriaTa: {
      type: [String],
      default: []
    },
    requiredDocuments: {
      type: [String],
      default: []
    },
    requiredDocumentsTa: {
      type: [String],
      default: []
    },
    officialPortalUrl: { type: String, required: true },
    helpline: { type: String },
    deadlineInfo: { type: String },
    isActive: { type: Boolean, default: true, index: true },
    tags: { type: [String], default: [] }
  },
  { timestamps: true }
);

// Add search text index for fast keyword matching
schemeSchema.index({
  title: 'text',
  titleTa: 'text',
  description: 'text',
  tags: 'text'
});

export const Scheme = mongoose.models.Scheme || mongoose.model('Scheme', schemeSchema);
export default Scheme;
