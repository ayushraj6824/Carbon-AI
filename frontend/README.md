# Carbon AI - Frontend UI

The frontend is a modern, responsive single-page application built with React and Vite. It utilizes a sleek "dark glassmorphism" design system tailored for enterprise SaaS platforms.

## 🚀 Tech Stack
- **Framework:** React 18
- **Build Tool:** Vite
- **Styling:** Tailwind CSS (with custom glassmorphism utilities)
- **Routing:** React Router v6
- **Data Visualization:** Recharts
- **HTTP Client:** Axios

## ⚙️ Setup & Run

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Development Server
```bash
npm run dev
```
The application will be accessible at `http://localhost:5173`.

### 3. Build for Production
```bash
npm run build
npm run preview
```

## 📁 Project Structure
- `src/App.jsx`: Root component and routing setup.
- `src/pages/`: Page-level components (`Dashboard`, `ValidationResult`, `ClaimHistory`, `Marketplace`).
- `src/components/`: Reusable UI components (`Sidebar`, `ProtectedRoute`).
- `src/context/`: React context for global state (`AuthContext`).
- `src/services/`: API integration and Axios interceptors (`api.js`).
