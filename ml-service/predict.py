import numpy as np
import joblib
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# ── Load models once at import time ──────────────────────────────────────────
lr         = joblib.load(os.path.join(BASE_DIR, 'model.pkl'))
iso        = joblib.load(os.path.join(BASE_DIR, 'isolation_forest.pkl'))
scaler     = joblib.load(os.path.join(BASE_DIR, 'scaler.pkl'))
score_meta = joblib.load(os.path.join(BASE_DIR, 'score_meta.pkl'))

S_MIN = score_meta['min']
S_MAX = score_meta['max']


def safe_float(val, default=0.0):
    try:
        if val is None or str(val).strip() == '':
            return float(default)
        return float(val)
    except (ValueError, TypeError):
        return float(default)

def predict(data: dict) -> dict:
    """
    Input keys (all numeric):
        energyConsumption, renewableEnergy, transportDistance,
        processEfficiency, productionOutput, rawMaterialUsage,
        claimedEmission
    Returns:
        predictedEmission, anomalyScore (0-1), fraudProbability (%),
        confidenceScore (%), fraudRiskLevel, status
    """
    print("\n[DEBUG] ── Incoming Predict Payload ──")
    print(data)

    # Build feature vector in the same order as training
    X = np.array([[
        safe_float(data.get('energyConsumption', 0)),
        safe_float(data.get('renewableEnergy', 0)),
        safe_float(data.get('transportDistance', 0)),
        safe_float(data.get('processEfficiency', 0)),
        safe_float(data.get('productionOutput', 0)),
        safe_float(data.get('rawMaterialUsage', 0)),
    ]])

    print("\n[DEBUG] ── Parsed Feature Vector (X) ──")
    print(X)

    X_scaled = scaler.transform(X)

    # ── Emission prediction ───────────────────────────────────────────────────
    predicted_emission = float(lr.predict(X_scaled)[0])
    predicted_emission = max(0.0, predicted_emission)

    # ── Anomaly score (normalized 0-1, higher = more anomalous) ──────────────
    raw_score = float(iso.score_samples(X_scaled)[0])
    # score_samples returns negative scores; more negative = more anomalous
    if S_MAX != S_MIN:
        # Map [S_MIN, S_MAX] → [1, 0]  (inverted so 1=anomalous)
        anomaly_score = 1.0 - (raw_score - S_MIN) / (S_MAX - S_MIN)
    else:
        anomaly_score = 0.5
    anomaly_score = float(np.clip(anomaly_score, 0.0, 1.0))

    # ── Isolation Forest hard label ───────────────────────────────────────────
    if_label = iso.predict(X_scaled)[0]   # -1 = anomaly, 1 = normal

    # ── Deviation of claimed vs predicted ────────────────────────────────────
    claimed = safe_float(data.get('claimedEmission', predicted_emission), default=predicted_emission)
    deviation = abs(claimed - predicted_emission) / max(1.0, predicted_emission)

    # ── Fraud probability (weighted blend) ───────────────────────────────────
    fraud_prob = float(np.clip(anomaly_score * 0.6 + deviation * 0.4, 0.0, 1.0))

    print(f"\n[DEBUG] ── Intermediary ML Scores ──")
    print(f"Predicted Emission: {predicted_emission:.4f}, Claimed: {claimed:.4f}")
    print(f"Raw Anomaly Score: {raw_score:.4f}, Normalized: {anomaly_score:.4f}")
    print(f"IF Label: {if_label}, Deviation: {deviation:.4f}, Fraud Prob: {fraud_prob:.4f}")

    # ── Status ────────────────────────────────────────────────────────────────
    if if_label == -1 or anomaly_score > 0.65 or deviation > 0.50:
        status = "SUSPICIOUS"
    else:
        status = "VERIFIED"

    # ── Confidence score ──────────────────────────────────────────────────────
    confidence = float(np.clip(1.0 - fraud_prob, 0.0, 1.0))

    # ── Fraud risk level label ────────────────────────────────────────────────
    if fraud_prob < 0.30:
        risk_level = "Low"
    elif fraud_prob < 0.65:
        risk_level = "Medium"
    else:
        risk_level = "High"

    result = {
        "predictedEmission":  round(predicted_emission, 4),
        "anomalyScore":       round(anomaly_score, 4),
        "fraudProbability":   round(fraud_prob * 100, 2),
        "confidenceScore":    round(confidence * 100, 2),
        "fraudRiskLevel":     risk_level,
        "status":             status,
    }

    print("\n[DEBUG] ── Final Predict Result ──")
    print(result)
    return result
