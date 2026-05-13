import sys
import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score, mean_squared_error
import joblib
import os

# Force UTF-8 output on Windows
if sys.stdout.encoding != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

# Feature columns (must match predict.py)
FEATURES = [
    'Total_Energy_Consumption_kWh',
    'Renewable_Energy_Consumption_kWh',
    'Supply_Chain_Transport_km',
    'Process_Efficiency_Percent',
    'Production_Output_Units',
    'Raw_Material_Usage_kg',
]
TARGET = 'Carbon_Emission_tCO2e_TARGET'

# ── Paths ─────────────────────────────────────────────────────────────────────
BASE_DIR  = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, '..', 'dataset',
                         'carbon_emission_dataset_with_Industry.csv')

print("[INFO] Loading dataset ...")
df = pd.read_csv(DATA_PATH)
df = df.dropna(subset=FEATURES + [TARGET])
print(f"[INFO] Rows loaded: {len(df):,}")

X = df[FEATURES].values
y = df[TARGET].values

# ── Scale ─────────────────────────────────────────────────────────────────────
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# ── Linear Regression ─────────────────────────────────────────────────────────
X_train, X_test, y_train, y_test = train_test_split(
    X_scaled, y, test_size=0.2, random_state=42)

lr = LinearRegression()
lr.fit(X_train, y_train)
y_pred = lr.predict(X_test)

print(f"\n[RESULT] Linear Regression:")
print(f"   R2  : {r2_score(y_test, y_pred):.4f}")
print(f"   RMSE: {np.sqrt(mean_squared_error(y_test, y_pred)):.4f}")

# ── Isolation Forest ──────────────────────────────────────────────────────────
iso = IsolationForest(
    n_estimators=200,
    contamination=0.10,
    max_samples='auto',
    random_state=42,
)
iso.fit(X_scaled)

scores = iso.score_samples(X_scaled)
print(f"\n[RESULT] Isolation Forest score range: [{scores.min():.4f}, {scores.max():.4f}]")

# ── Save models ───────────────────────────────────────────────────────────────
joblib.dump(lr,     os.path.join(BASE_DIR, 'model.pkl'))
joblib.dump(iso,    os.path.join(BASE_DIR, 'isolation_forest.pkl'))
joblib.dump(scaler, os.path.join(BASE_DIR, 'scaler.pkl'))

# Save score range for normalization
score_meta = {'min': float(scores.min()), 'max': float(scores.max())}
joblib.dump(score_meta, os.path.join(BASE_DIR, 'score_meta.pkl'))

print("\n[DONE] Models saved: model.pkl | isolation_forest.pkl | scaler.pkl | score_meta.pkl")
