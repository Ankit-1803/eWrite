# MERN BlogApp (eWrite)

A modern full-stack blogging platform built with MongoDB, Express.js, React 19, Node.js, Tailwind CSS, and EditorJS.

---

## Architecture Overview

```
BlogApp/
├── backend/                  # Express REST API & Database Models
│   ├── config/               # Database and Cloudinary configuration
│   ├── controller/           # Route controllers (User, Blog, Comment)
│   ├── middleware/           # Authentication middleware (JWT verification)
│   ├── models/               # Mongoose schemas (User, Blog, Comment, Like)
│   ├── routes/               # API endpoint definitions
│   ├── utils/                # Helpers (Multer, Cloudinary upload, Nodemailer, JWT)
│   ├── .env.example          # Template for backend environment variables
│   └── server.js             # Express application entry point
├── frontend/                 # React 19 + Vite Single Page Application
│   ├── public/               # Static assets & SVG icons
│   ├── src/
│   │   ├── components/       # Reusable UI components (Navbar, DisplayBlogs, Comment)
│   │   ├── pages/            # Page views (Home, BlogPage, AddBlog, Profile, Auth)
│   │   ├── utils/            # Redux store, slices, Firebase client, actions
│   │   ├── App.jsx           # Root application router
│   │   └── main.jsx          # React DOM entry point
│   ├── .env.example          # Template for frontend environment variables
│   └── vite.config.js        # Vite build tool configuration
└── README.md                 # Project documentation & deployment guide
```

---

## Environment Variables

The project uses separate `.env` files for the backend and frontend to isolate server-only secrets from browser-accessible configuration.

### Backend Environment Variables (`backend/.env`)

Create a `.env` file in the `backend/` directory by copying `backend/.env.example`:

```bash
cp backend/.env.example backend/.env
```

| Variable Name | Description | Example / Default | Required in Production? |
| :--- | :--- | :--- | :--- |
| `PORT` | Port for the Express server | `3000` | Yes (Render sets this automatically) |
| `CLIENT_URL` | Frontend origin URL for CORS and verification links | `http://localhost:5173` (dev) / `https://your-app.vercel.app` (prod) | **Yes** |
| `DB_URL` | MongoDB connection URI | `mongodb://127.0.0.1:27017/blogDatabase` (dev) / `mongodb+srv://...` (prod) | **Yes** |
| `JWT_SECRET` | Secret key used to sign and verify JWT authentication tokens | Strong random 32+ character string | **Yes** |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name for image storage | Your Cloudinary cloud name | **Yes** |
| `CLOUDINARY_API_KEY` | Cloudinary API key | Your Cloudinary API key | **Yes** |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret key | Your Cloudinary API secret | **Yes** |
| `EMAIL_HOST` | SMTP server hostname for sending emails | `smtp.gmail.com` | Optional (defaults to Gmail) |
| `EMAIL_PORT` | SMTP server port | `465` | Optional (defaults to 465) |
| `EMAIL_USER` | Email address used for sending verification emails | `your_email@gmail.com` | **Yes** |
| `EMAIL_PASS` | Gmail App Password (or SMTP password) | Your 16-character App Password | **Yes** |
| `EMAIL_FROM` | Sender address shown in the "From" header | `your_email@gmail.com` | Optional (defaults to `EMAIL_USER`) |
| `FIREBASE_SERVICE_ACCOUNT` | Full JSON string of your Firebase Admin Service Account key | `{"type":"service_account","project_id":"..."}` | **Yes (on Render)** |

> [!CAUTION]
> **NEVER COMMIT BACKEND SECRETS TO GIT**  
> `DB_URL` (with database credentials), `JWT_SECRET`, `CLOUDINARY_API_SECRET`, `EMAIL_PASS`, and `FIREBASE_SERVICE_ACCOUNT` must **never** be committed to GitHub or exposed to the frontend.

---

### Frontend Environment Variables (`frontend/.env`)

Create a `.env` file in the `frontend/` directory by copying `frontend/.env.example`:

```bash
cp frontend/.env.example frontend/.env
```

Vite requires client-accessible environment variables to be prefixed with `VITE_`.

| Variable Name | Description | Example / Default | Required in Production? |
| :--- | :--- | :--- | :--- |
| `VITE_BACKEND_URL` | Full URL to backend API endpoint (`/api/v1`) | `http://localhost:3000/api/v1` (dev) / `https://your-backend.onrender.com/api/v1` (prod) | **Yes** |
| `VITE_FIREBASE_API_KEY` | Firebase Web Client API key | `AIzaSy...` | **Yes** |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase Web Auth domain | `your_project.firebaseapp.com` | **Yes** |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project identifier | `your_project_id` | **Yes** |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase Cloud Storage bucket name | `your_project.firebasestorage.app` | **Yes** |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase Cloud Messaging sender ID | `1234567890` | **Yes** |
| `VITE_FIREBASE_APP_ID` | Firebase Web application ID | `1:1234567890:web:...` | **Yes** |

> [!NOTE]
> Firebase Web client parameters are public client identifiers used by the browser to connect to Firebase services. However, storing them in `.env` keeps the codebase modular and configurable across development, staging, and production.

---

## Local Development Setup

### 1. Prerequisites
- **Node.js**: v18 or newer
- **MongoDB**: Local MongoDB instance running or a MongoDB Atlas URI

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env and enter your MongoDB, Cloudinary, and Email credentials
npm run dev
```
The backend starts on `http://localhost:3000`.

### 3. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
# Edit .env and enter your VITE_BACKEND_URL and Firebase Web credentials
npm run dev
```
The frontend starts on `http://localhost:5173`.

---

## Production Deployment Guide

### Deploying Backend to Render

1. Create a new **Web Service** on [Render](https://render.com).
2. Connect your GitHub repository.
3. Configure the service:
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
4. In the **Environment Variables** tab, add:
   - `DB_URL`: Your production MongoDB Atlas connection string (`mongodb+srv://...`)
   - `CLIENT_URL`: Your production Vercel frontend URL (e.g., `https://your-blog.vercel.app`)
   - `JWT_SECRET`: A secure 32+ character random secret
   - `CLOUDINARY_CLOUD_NAME`: Your Cloudinary cloud name
   - `CLOUDINARY_API_KEY`: Your Cloudinary API key
   - `CLOUDINARY_API_SECRET`: Your Cloudinary API secret
   - `EMAIL_HOST`: `smtp.gmail.com`
   - `EMAIL_PORT`: `465`
   - `EMAIL_USER`: Your Gmail address
   - `EMAIL_PASS`: Your Gmail App Password
   - `FIREBASE_SERVICE_ACCOUNT`: The raw JSON string from your Firebase Service Account key file

---

### Deploying Frontend to Vercel

1. Import your GitHub repository on [Vercel](https://vercel.com).
2. Configure project settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. In the **Environment Variables** section, add:
   - `VITE_BACKEND_URL`: Your Render backend API URL (e.g., `https://your-backend.onrender.com/api/v1`)
   - `VITE_FIREBASE_API_KEY`: Your Firebase Web API key
   - `VITE_FIREBASE_AUTH_DOMAIN`: `your_project.firebaseapp.com`
   - `VITE_FIREBASE_PROJECT_ID`: Your Firebase project ID
   - `VITE_FIREBASE_STORAGE_BUCKET`: `your_project.firebasestorage.app`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`: Your sender ID
   - `VITE_FIREBASE_APP_ID`: Your Web app ID
4. Click **Deploy**.

---

## Security Verification Checklist

- [x] Zero hardcoded secrets, passwords, or private keys in tracked files
- [x] All `.env` and `*-firebase-adminsdk-*.json` files excluded in `.gitignore`
- [x] `.env.example` templates contain only non-sensitive placeholder values
- [x] CORS and verification email URLs dynamically read from `CLIENT_URL`
- [x] Firebase Admin SDK dynamically initialized via `FIREBASE_SERVICE_ACCOUNT` env variable
- [x] Frontend ESLint passes with 0 errors and 0 warnings
- [x] Frontend Vite production build completes successfully
- [x] Backend syntax checks pass with 0 errors
