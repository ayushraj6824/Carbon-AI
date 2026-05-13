# Carbon AI - Backend API

The Node.js backend handles user authentication, data persistence, and acts as a secure gateway to the ML prediction service.

## 🚀 Tech Stack
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (via Mongoose)
- **Authentication:** JSON Web Tokens (JWT) & bcryptjs

## ⚙️ Setup & Run

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Copy the `.env.example` file to `.env` and configure your settings:
```bash
cp .env.example .env
```
Ensure your `MONGODB_URI` points to a running local instance (default: `mongodb://localhost:27017/carbon_ai`).

### 3. Start the Server
```bash
# Development (with nodemon)
npm run dev

# Production
npm start
```
The server will run on `http://localhost:5000`.

## 📁 Project Structure
- `src/server.js`: Entry point.
- `src/routes/`: Express route definitions (`auth.js`, `claims.js`).
- `src/models/`: Mongoose schemas (`User.js`, `Claim.js`).
- `src/middleware/`: JWT verification middleware.
