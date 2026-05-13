const express = require('express');
const axios   = require('axios');
const Claim   = require('../models/Claim');
const protect = require('../middleware/authMiddleware');

const router     = express.Router();
const ML_URL     = () => process.env.ML_SERVICE_URL || 'http://localhost:5001';

// ── POST /api/claims/validate ─────────────────────────────────────────────
router.post('/validate', protect, async (req, res) => {
  try {
    const {
      sector, industrySector,
      energyConsumption, renewableEnergy, nonRenewableEnergy,
      productionOutput, rawMaterialUsage,
      transportDistance, transportMode,
      processEfficiency, carbonReductionStrategy,
      claimedEmission,
    } = req.body;

    const safeParse = (val) => {
      const parsed = parseFloat(val);
      return isNaN(parsed) ? 0 : parsed;
    };

    const mlPayload = {
      energyConsumption:  safeParse(energyConsumption),
      renewableEnergy:    safeParse(renewableEnergy),
      transportDistance:  safeParse(transportDistance),
      processEfficiency:  safeParse(processEfficiency),
      productionOutput:   safeParse(productionOutput),
      rawMaterialUsage:   safeParse(rawMaterialUsage),
      claimedEmission:    safeParse(claimedEmission),
    };

    // Call Python ML service
    const mlRes = await axios.post(`${ML_URL()}/predict`, mlPayload);

    const {
      predictedEmission, anomalyScore,
      fraudProbability, confidenceScore,
      fraudRiskLevel, status,
    } = mlRes.data;

    // Persist claim
    const claim = await Claim.create({
      userId: req.user._id,
      sector, industrySector,
      energyConsumption:       safeParse(energyConsumption),
      renewableEnergy:         safeParse(renewableEnergy),
      nonRenewableEnergy:      safeParse(nonRenewableEnergy),
      productionOutput:        safeParse(productionOutput),
      rawMaterialUsage:        safeParse(rawMaterialUsage),
      transportDistance:       safeParse(transportDistance),
      transportMode,
      processEfficiency:       safeParse(processEfficiency),
      carbonReductionStrategy,
      claimedEmission:         safeParse(claimedEmission),
      predictedEmission, anomalyScore,
      fraudProbability, confidenceScore,
      fraudRiskLevel, status,
    });

    res.json({ claim, predictedEmission, anomalyScore, fraudProbability, confidenceScore, fraudRiskLevel, status });
  } catch (err) {
    console.error('Validate Error:', err.message);
    if (err.code === 'ECONNREFUSED') {
      return res.status(503).json({ message: 'ML service unavailable. Ensure ML service is running on port 5001.' });
    }
    if (err.response) {
      console.error('[DEBUG] ML Response Error Data:', err.response.data);
      return res.status(502).json({ message: 'ML service error', details: err.response.data });
    }
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ── GET /api/claims/history ──────────────────────────────────────────────
router.get('/history', protect, async (req, res) => {
  try {
    const claims = await Claim.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();
    res.json(claims);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ── GET /api/claims/stats ────────────────────────────────────────────────
router.get('/stats', protect, async (req, res) => {
  try {
    const claims  = await Claim.find({ userId: req.user._id }).lean();
    const total   = claims.length;
    const verified    = claims.filter(c => c.status === 'VERIFIED').length;
    const suspicious  = claims.filter(c => c.status === 'SUSPICIOUS').length;
    const sectorMap   = {};
    claims.forEach(c => {
      sectorMap[c.sector] = (sectorMap[c.sector] || 0) + (c.claimedEmission || 0);
    });
    res.json({ total, verified, suspicious, sectorMap });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ── DELETE /api/claims/:id ───────────────────────────────────────────────
router.delete('/:id', protect, async (req, res) => {
  try {
    const claim = await Claim.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!claim) {
      return res.status(404).json({ message: 'Claim not found or unauthorized' });
    }
    res.json({ message: 'Claim deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
