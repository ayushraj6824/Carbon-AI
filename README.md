# 🌱 Carbon AI - Enterprise Carbon Credit Validation System

> An AI-powered full-stack web application designed to validate and analyze corporate carbon credit claims using **Isolation Forest anomaly detection** and **Linear Regression emission prediction**. 

Built as a comprehensive MCA Major Project, this platform bridges the gap between raw corporate operational data and verifiable sustainability claims, ensuring integrity in the carbon marketplace.

---



<!--
| Dashboard | Validation Result |
|-----------|-------------------|
| ![Dashboard](screenshots/dashboard.png) | ![Result](screenshots/result.png) |

| Claim History | Marketplace |
|---------------|-------------|
| ![History](screenshots/history.png) | ![Marketplace](screenshots/marketplace.png) |
-->

---

## 📋 Table of Contents

- [Features](#-features)
- [Architecture Overview](#-architecture-overview)
- [Tech Stack](#-tech-stack)
- [Folder Structure](#-folder-structure)
- [Setup & Installation](#-setup--installation)
- [Running the Application](#-running-the-application)
- [API Workflow](#-api-workflow)
- [Machine Learning Workflow](#-machine-learning-workflow)
- [MongoDB Usage](#-mongodb-usage)
- [Future Scope](#-future-scope)
- [Contributing](#-contributing)
- [Author & License](#-author--license)

---

## ✨ Features

- **Dynamic Data Submission:** Secure, JWT-authenticated dashboard for companies to submit complex operational metrics (energy usage, transport, efficiency).
- **Real-Time AI Validation:** Seamless integration with a Python/Flask ML microservice that predicts expected emissions and flags anomalies instantly.
- **Interactive Visualizations:** Beautiful, responsive Recharts comparing claimed vs. predicted emissions and breaking down historical data.
- **Enterprise Dark Glassmorphism UI:** A sleek, minimal, and highly professional design system tailored for modern SaaS products.
- **Full Claim Lifecycle Management:** View, audit, and securely delete past claims through an intuitive Claim History panel.

---

## 🏗 Architecture Overview

The system utilizes a microservices-inspired architecture consisting of three primary nodes:

1. **Frontend UI (React + Vite):** Handles user interaction, data collection, and visualization.
2. **Backend API (Node + Express):** Acts as a secure gateway, managing MongoDB persistence, JWT authentication, and request proxying to the ML service.
3. **ML Service (Python + Flask):** A stateless prediction engine hosting pre-trained `scikit-learn` models (Linear Regression & Isolation Forest).

---

## 🛠 Tech Stack

### Frontend
- **React 18** (Vite build tool)
- **Tailwind CSS** (Custom Glassmorphism utilities)
- **Recharts** (Data visualization)

### Backend
- **Node.js & Express.js**
- **MongoDB & Mongoose**
- **JWT & bcrypt** (Security)

### Machine Learning
- **Python 3.10+**
- **Flask** (API exposure)
- **Scikit-learn** (Isolation Forest, Linear Regression)
- **Pandas & NumPy** (Data processing)

---

## 📁 Folder Structure

```text
Carbon-Credit/
├── dataset/                  # Source CSV used for model training
├── ml-service/               # Python/Flask microservice
│   ├── app.py                # API endpoints
│   ├── predict.py            # Prediction & scaling logic
│   ├── train_model.py        # Model training pipeline
│   ├── test_e2e.py           # End-to-end Python test script
│   └── README.md             # Localized docs
├── backend/                  # Node/Express API
│   ├── src/                  # Controllers, Models, Routes
│   ├── .env.example          # Environment template
│   └── README.md             # Localized docs
├── frontend/                 # React/Vite Application
│   ├── src/                  # UI Components, Pages, Context
│   └── README.md             # Localized docs
├── screenshots/              # Demo images
├── .gitignore                # Global ignore rules
├── LICENSE                   # MIT License
└── README.md                 # Root documentation (You are here)
```

---

## ⚙️ Setup & Installation

### Prerequisites
- **Node.js** (v18+)
- **Python** (v3.10+)
- **MongoDB Community Server** (running locally on default port `27017`)
- **MongoDB Compass** (Optional, but highly recommended for viewing database records easily)

### 1. Environment Variable Setup
Navigate to the `backend/` directory and create your environment file:
```bash
cd backend
cp .env.example .env
```
Ensure your MongoDB is running, as the backend will attempt to connect to `mongodb://localhost:27017/carbon_ai`.

### 2. Dependency Installation
You will need to install dependencies for all three services:

```bash
# Frontend
cd frontend && npm install

# Backend
cd ../backend && npm install

# ML Service
cd ../ml-service
pip install -r requirements.txt
```

---

## 🚀 Running the Application

To run the entire platform locally, you must start all three services simultaneously. **Open three separate terminal windows.**

**Terminal 1: ML Service**
```bash
cd ml-service
python app.py
# Runs on http://localhost:5001
```

**Terminal 2: Backend API**
```bash
cd backend
npm run dev
# Runs on http://localhost:5000
```

**Terminal 3: Frontend UI**
```bash
cd frontend
npm run dev
# Runs on http://localhost:5173
```

Navigate to `http://localhost:5173` in your browser to access the platform.

### Troubleshooting Setup
- **ECONNREFUSED Error in UI:** This means the Node backend cannot reach the Python ML service. Ensure `app.py` is running on port 5001.
- **MongoDB Connection Error:** Ensure your local MongoDB service is actively running on port `27017`.

---

## 🔌 API Workflow

1. **Authentication:** The React frontend authenticates the user via `POST /api/auth/login`. A JWT is securely stored in `localStorage`.
2. **Submission:** User fills out the carbon claim form. The frontend sends a `POST /api/claims/validate` request to the Node backend, attaching the JWT.
3. **Proxy & ML Processing:** The Node backend validates the JWT, structures the data, and forwards it to the Python ML service at `http://localhost:5001/predict`.
4. **Persistence:** The ML service returns the prediction, anomaly score, and fraud risk. The Node backend merges this with the user ID, saves the full record to MongoDB, and returns the data to the frontend for visualization.

---

## 🧠 Machine Learning Workflow

The ML Service relies on two distinct models trained on 18,250 rows of synthetic industrial data (`dataset/carbon_emission_dataset_with_Industry.csv`):

1. **Feature Engineering:** Operational metrics (Energy Consumption, Production Output, Transport Distance, etc.) are standardized using a `StandardScaler`.
2. **Linear Regression (`model.pkl`):** Calculates the *Expected Emission* based purely on the physical metrics provided.
3. **Isolation Forest (`isolation_forest.pkl`):** Acts as the anomaly detector. If the user's *Claimed Emission* deviates too wildly from the *Expected Emission* or physical norms, it generates a high `anomalyScore`.
4. **Logic Gate:** Based on the `anomalyScore`, the system assigns a final status of either `VERIFIED` or `SUSPICIOUS`.

*(Note: The models are pre-trained. If you modify the logic, simply run `python train_model.py` in the `ml-service` directory to regenerate the `.pkl` files).*

---

## 🗄️ MongoDB Usage

The project utilizes a simple, document-based NoSQL structure ideal for rapid iteration.
- **Database Name:** `carbon_ai`
- **Collections:**
  - `users`: Stores registered accounts and hashed passwords.
  - `claims`: Stores all historical claims, their operational data, and ML prediction results.

*Tip: Use MongoDB Compass and connect to `mongodb://localhost:27017` to manually inspect, edit, or clear your local data during testing.*

---

## 🔭 Future Scope

- **Blockchain Integration:** Tokenize `VERIFIED` carbon credits onto an EVM-compatible testnet.
- **Live Marketplace:** Transition the current static UI marketplace into a live peer-to-peer trading hub.
- **Enhanced ML Models:** Upgrade from Linear Regression to Deep Neural Networks for more nuanced emission forecasting.
- **Audit Logs:** Implement immutable audit trails for regulatory compliance testing.

---

## 🤝 Contributing

We welcome contributions from collaborators! To contribute:

1. **Fork** the repository.
2. **Create a branch** for your feature (`git checkout -b feature/AmazingFeature`).
3. **Commit** your changes cleanly (`git commit -m 'Add some AmazingFeature'`).
4. **Push** to the branch (`git push origin feature/AmazingFeature`).
5. **Open a Pull Request** describing your changes.

*Please ensure your code follows the existing modular structure and maintains the dark glassmorphism design language.*

---

## 👨‍💻 Author & License

Developed for the MCA Major Project by **Ayush**.

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
