# Carbon AI - Machine Learning Service

This microservice acts as the AI engine for the Carbon AI platform. It utilizes `Flask` to expose machine learning predictions via REST APIs.

## 🧠 Model Architecture

The service leverages two models sequentially:
1. **Linear Regression (`model.pkl`)**: Predicts the baseline carbon footprint based on operational metrics (energy, efficiency, production, transport).
2. **Isolation Forest (`isolation_forest.pkl`)**: Performs anomaly detection to catch fraudulent or mathematically inconsistent claims.

## 🚀 Setup & Run

### 1. Install Dependencies
Ensure you have Python 3.10+ installed.
```bash
pip install -r requirements.txt
```

### 2. Train the Model (Optional)
If `model.pkl` or `isolation_forest.pkl` are missing, or if you update the dataset:
```bash
python train_model.py
```
This script reads from `../dataset/carbon_emission_dataset_with_Industry.csv` and outputs the trained model artifacts.

### 3. Start the Flask Server
```bash
python app.py
```
The service will start on `http://localhost:5001`.

## 📡 API Endpoints

- `GET /health` : Returns service health status.
- `POST /predict` : Accepts JSON payload of operational metrics and returns prediction, anomaly score, and verification status.

## 🛠 Project Structure
- `app.py`: Flask application and route definitions.
- `predict.py`: Core logic for loading models, scaling features, and generating predictions.
- `train_model.py`: Pipeline for data preprocessing and model training.
- `test_e2e.py`: End-to-end Python test script for predictions.
