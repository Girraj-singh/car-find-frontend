# 🚗 C4D – Car Finder for Society (React + MUI)

**Full-stack Society Car Management App**
Frontend: React 18 + MUI v5 | Backend: Django + DRF | Database: MySQL | Auth: JWT + Email OTP

---

## 📁 Project Structure
```
c4d-react-frontend/     ← React 18 + MUI v5 frontend
c4d-backend/            ← Django 4 REST API (use existing backend)
```

---

## ⚡ Quick Start

### Step 1: Backend Setup (same as before)
```bash
cd c4d-backend
python -m venv venv && venv\Scripts\activate
pip install -r requirements.txt
# Edit .env with DB + SMTP settings
python manage.py makemigrations accounts cars core
python manage.py migrate
python manage.py seed_data
python manage.py runserver
```

### Step 2: React Frontend Setup
```bash
cd c4d-react-frontend
npm install
npm run dev
```

**Frontend runs at:** `http://localhost:5173`
**Backend runs at:** `http://localhost:8000`

---

## 🔐 Demo Login Credentials

| Role      | Email                     | Password        |
|-----------|---------------------------|-----------------|
| Admin     | admin@c4d.com             | admin@123       |
| Resident  | rahul.sharma@c4d.com      | resident@123    |

> Click the **"Admin Demo"** or **"User Demo"** buttons on the login page for instant access.

---

## 🛠 Tech Stack

| Layer       | Technology                        |
|-------------|-----------------------------------|
| Framework   | React 18 + Vite 5                 |
| UI Library  | MUI (Material UI) v5              |
| State       | Zustand                           |
| Router      | React Router v6                   |
| HTTP        | Axios (with JWT auto-refresh)     |
| Toasts      | Notistack                         |
| Backend     | Django 4.2 + DRF                  |
| Database    | MySQL 8                           |

---

## 📱 Pages & Features

| Page | Route | Description |
|------|-------|-------------|
| Landing | `/` | Hero page with feature cards |
| Register | `/register` | Email entry → OTP → Profile setup |
| OTP Verify | `/register/otp` | 6-box OTP with countdown timer |
| Complete Profile | `/register/profile` | Name, Block, Flat, Password, Cars, Phones |
| Login | `/login` | Email + password + demo buttons |
| Dashboard | `/dashboard` | Stats, vehicles, quick actions |
| Search | `/search` | Search car by last 4 plate digits |
| QR Scan | `/scan` | QR scanner + manual input |
| Profile | `/profile` | Manage cars, phones, account info |
| Admin Dashboard | `/admin` | Stats overview + quick links |
| Admin Users | `/admin/users` | All users with search/filter/suspend/delete |
| Admin Cars | `/admin/cars` | All vehicles table with delete |
| Admin Logs | `/admin/logs` | Search audit logs |

---

## 🎨 Theming

The app supports **Dark** and **Light** themes powered by MUI's ThemeProvider.

- **Dark:** `#0d1117` background, `#2dd4bf` (teal) primary
- **Light:** `#f0f4f8` background, `#0d9488` (teal-600) primary

Theme preference is persisted in `localStorage`.

---

## 🔒 Security Features
- JWT Access Token (15 min) + auto-refresh interceptor in Axios
- JWT Refresh Token (7 days, blacklisted on logout)
- Email OTP (6-digit, 10-min expiry)
- Admin role guards via React Router
- CORS restricted to frontend origin
