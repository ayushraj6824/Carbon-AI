const mongoose = require('mongoose');

const claimSchema = new mongoose.Schema(
  {
    userId:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    // Form inputs
    sector:                  { type: String, required: true },
    industrySector:          { type: String, default: '' },
    energyConsumption:       { type: Number, required: true },
    renewableEnergy:         { type: Number, required: true },
    nonRenewableEnergy:      { type: Number, required: true },
    productionOutput:        { type: Number, required: true },
    rawMaterialUsage:        { type: Number, required: true },
    transportDistance:       { type: Number, required: true },
    transportMode:           { type: String, default: 'Truck' },
    processEfficiency:       { type: Number, required: true },
    carbonReductionStrategy: { type: String, default: '' },
    claimedEmission:         { type: Number, required: true },

    // ML results
    predictedEmission: { type: Number, default: null },
    anomalyScore:      { type: Number, default: null },
    confidenceScore:   { type: Number, default: null },
    fraudProbability:  { type: Number, default: null },
    fraudRiskLevel:    { type: String, default: null },
    status: {
      type: String,
      enum: ['VERIFIED', 'SUSPICIOUS', 'PENDING'],
      default: 'PENDING',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Claim', claimSchema);
