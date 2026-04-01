# ScanCart — Smart Self-Checkout Application

A full-stack mobile-first web application that lets supermarket customers scan product barcodes, add items to cart, pay digitally (UPI/Card/Wallet), and receive a digital bill — avoiding long checkout queues.

## Tech Stack

- **Frontend**: Vite + Vanilla JS (mobile-first SPA)
- **Backend**: Node.js + Express
- **Database**: MySQL
- **Auth**: JWT + bcrypt

## Project Structure

```
├── backend/
│   ├── server.js          # Express entry point
│   ├── db.js              # MySQL connection & schema
│   ├── seed.js            # Sample data seeder
│   ├── .env               # Database credentials (create this)
│   ├── middleware/auth.js  # JWT middleware
│   └── routes/
│       ├── auth.js        # Signup & Login
│       ├── stores.js      # Store listing
│       ├── products.js    # Barcode lookup
│       ├── orders.js      # Order management
│       └── offers.js      # Promotional offers
│
└── frontend/
    ├── index.html         # SPA shell
    ├── vite.config.js     # Dev server config
    └── src/
        ├── main.js        # SPA router
        ├── styles/main.css
        ├── utils/api.js
        └── pages/         # All page modules
```

## Setup & Run

### 1. Database Setup
Make sure MySQL is running, then configure credentials:

Create `backend/.env`:
```env
PORT=3000
JWT_SECRET=your_secret_key_here
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=smart_checkout
```

### 2. Backend
```bash
cd backend
npm install
node seed.js     # Creates tables & seeds sample data
node server.js   # Starts API on port 3000
```

### 3. Frontend
```bash
cd frontend
npm install
npm run dev      # Starts dev server on port 5173
```

### 4. Production Build (Frontend)
```bash
cd frontend
npm run build    # Output in dist/
```

## Features

- 🔐 User signup & login with JWT authentication
- 🏪 Store selection by city
- 📱 Barcode scanning via phone camera
- 🛒 Cart with quantity management
- 💰 GST calculation (CGST 9% + SGST 9% = 18%)
- 🎁 Promotional offers & coupon codes
- 💳 UPI / Card / Wallet payment (simulated)
- 🧾 Digital bill with transaction ID
- 📋 Order history with detailed view
