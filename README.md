# eWrite — Thought Sharing & Blogging Platform

> A modern full-stack blogging and thought-sharing platform where users can create, publish, discover, save, like, and discuss ideas with a community of readers and writers.

**eWrite** is a full-stack web application designed to provide a complete writing and content-sharing experience. It combines a responsive React frontend with a Node.js/Express REST API, MongoDB database, Firebase authentication, Cloudinary media storage, and Resend-powered email verification.

The application supports user authentication, blog creation and management, drafts, likes, saved blogs, comments, replies, user profiles, privacy settings, image uploads, email verification, and production deployment.

---

## ✨ Key Features

### 🔐 Authentication & User Management

- Email/password registration
- Email verification before account activation
- Secure password hashing using `bcrypt`
- JWT-based authentication
- Google authentication using Firebase
- Firebase Admin authentication on the backend
- Login and logout functionality
- Protected routes and authenticated API requests
- User profile management
- Username-based profile pages

### ✍️ Blog Management

- Create new blog posts
- Edit existing blogs
- Delete blogs
- Publish blogs
- Save blogs as drafts
- Manage published and draft blogs separately
- View individual blog posts
- Rich blog content rendering
- Support for structured content blocks
- Blog cover/image uploads
- Cloudinary-based image storage
- Creator-specific blog management

### ❤️ Social Features

- Like and unlike blogs
- Save and unsave blogs
- View liked blogs
- View saved blogs
- Follow users
- Unfollow users
- Followers and following relationships
- Comment on blogs
- Reply to comments
- Like comments
- View comment counts
- User-generated discussions around blog posts

### 👤 User Profiles

- Public user profiles
- Username-based profile URLs
- User blog listing
- Draft blogs
- Liked blogs
- Saved blogs
- Followers/following information
- Profile picture support
- Profile customization

### 🔒 Privacy & Visibility

Users can control the visibility of their saved and liked content.

Current settings include:

- Show Saved Blogs
- Show Liked Blogs

These preferences allow users to decide whether other users can see certain sections of their profile.

### 🔎 Blog Discovery

- Search blogs or topics
- Browse latest stories
- Explore published content
- Discover content from different users

### 💬 Comments & Discussions

The platform provides a dedicated comment interface for every blog.

Users can:

- Add comments
- Reply to comments
- Like comments
- View comment counts
- Participate in discussions

The frontend also prevents duplicate comment submissions by disabling the action while a request is being processed.

### 📧 Email Verification

eWrite uses **Resend** for transactional email delivery.

The registration flow is:

```text
User Registration
       ↓
Account Created
       ↓
Verification Email Sent
       ↓
User Opens Verification Link
       ↓
Frontend Verification Page
       ↓
Backend Verification API
       ↓
JWT Token Validation
       ↓
isVerify = true
       ↓
Email Verified
```

Verification links are handled through the frontend and validated by the backend.

### 🔑 Google Authentication

Google authentication is implemented using:

- Firebase Authentication
- Firebase Web SDK
- Firebase Admin SDK
- Backend token verification
- MongoDB user synchronization

This allows users to authenticate using their Google account without creating a separate password.

---

# 🏗️ System Architecture

```text
                         ┌──────────────────────┐
                         │       User           │
                         │      Browser         │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │       Vercel         │
                         │   React Frontend     │
                         └──────────┬───────────┘
                                    │
                              REST API / HTTPS
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │       Render         │
                         │ Node.js + Express    │
                         │      Backend         │
                         └──────┬─────┬─────────┘
                                │     │
                 ┌──────────────┘     └──────────────┐
                 ▼                                   ▼
       ┌──────────────────┐                ┌──────────────────┐
       │  MongoDB Atlas   │                │    Cloudinary    │
       │    Database      │                │  Image Storage   │
       └──────────────────┘                └──────────────────┘
                                │
                                ▼
                       ┌──────────────────┐
                       │     Resend       │
                       │ Email Delivery   │
                       └──────────────────┘

                                +
                       ┌──────────────────┐
                       │ Firebase Auth    │
                       │ Google Login     │
                       └──────────────────┘
```

---

# 🛠️ Tech Stack

## Frontend

| Technology | Purpose |
|---|---|
| React.js | User interface |
| JavaScript | Application logic |
| Vite | Frontend build tool |
| Tailwind CSS | Styling and responsive UI |
| Axios | HTTP/API requests |
| React Router | Client-side routing |
| Firebase | Google authentication |
| Structured content blocks | Rich blog content |
| Vercel | Frontend deployment |

## Backend

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| Express.js | REST API framework |
| MongoDB | Database |
| Mongoose | MongoDB ODM |
| JWT | Authentication & verification tokens |
| bcrypt | Password hashing |
| Firebase Admin | Google authentication verification |
| Multer | File upload handling |
| Cloudinary | Image/media storage |
| Resend | Email delivery |
| dotenv | Environment configuration |

---

# 🗄️ Database

The application uses **MongoDB Atlas** as its cloud database.

Main collections include:

```text
test
├── users
├── blogs
├── comments
└── likes
```

### User Data

Users contain information such as:

- Name
- Email
- Username
- Password hash
- Verification status
- Google authentication status
- Profile information
- Profile image
- Followers
- Following
- Saved blogs
- Liked blogs
- Privacy preferences
- Account timestamps

### Blog Data

Blogs support:

- Title
- Description/content
- Creator
- Images
- Structured content blocks
- Published/draft state
- Likes
- Saved relationships
- Comments
- Creation/update timestamps

### Comment Data

Comments support:

- Comment creator
- Blog reference
- Comment content
- Replies
- Likes
- Timestamps

---

# 📁 Project Structure

```text
eWrite/
│
├── backend/
│   ├── config/
│   ├── controller/
│   │   ├── blogController.js
│   │   ├── commentController.js
│   │   └── userController.js
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   ├── utils/
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   └── ...
│
├── .gitignore
└── README.md
```

---

# 🔄 Application Flow

## User Registration

```text
                    Registration
                         │
                         ▼
                  Validate Input
                         │
                         ▼
                 Check Existing User
                         │
                         ▼
                  Hash Password
                         │
                         ▼
                  Create User
                         │
                         ▼
              Generate Verification JWT
                         │
                         ▼
               Send Verification Email
                         │
                         ▼
                User Opens Email
                         │
                         ▼
              /verify-email/:token
                         │
                         ▼
               Backend Validates JWT
                         │
                         ▼
                 isVerify = true
```

## User Login

```text
User
 │
 ▼
Email + Password
 │
 ▼
Backend
 │
 ├── Find User
 ├── Verify Password
 ├── Check Verification
 │
 ▼
Generate JWT
 │
 ▼
Authenticated Session
```

## Google Login

```text
User
 │
 ▼
Continue with Google
 │
 ▼
Firebase Authentication
 │
 ▼
Google Account Verification
 │
 ▼
Firebase ID Token
 │
 ▼
Backend
 │
 ▼
Firebase Admin Verification
 │
 ▼
Create / Find User
 │
 ▼
Authenticated User
```

---

# 🖼️ Media Upload Architecture

Images are not intended to be permanently stored directly on the application server.

Instead:

```text
User
 │
 ▼
Frontend
 │
 ▼
Backend / Upload Handler
 │
 ▼
Cloudinary
 │
 ▼
Hosted Image URL
 │
 ▼
MongoDB stores reference
```

This keeps media storage separate from the backend application.

---

# 🔐 Security

Security considerations implemented in the project include:

- Password hashing using bcrypt
- JWT authentication
- Firebase token verification
- Firebase Admin SDK
- Environment variables for sensitive configuration
- `.env` files excluded from Git
- `.env.example` files for configuration documentation
- Firebase Admin credentials excluded from version control
- Protected backend routes
- User ownership checks for user-specific operations
- Cloudinary credentials stored through environment variables
- Resend API key stored through environment variables
- MongoDB credentials stored through environment variables

### Environment Variables

Sensitive values should **never be committed to GitHub**.

Example backend configuration:

```env
PORT=3000

DB_URL=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

RESEND_API_KEY=your_resend_api_key
EMAIL_FROM=your_sender_email

CLIENT_URL=your_frontend_url
```

Frontend configuration:

```env
VITE_BACKEND_URL=your_backend_api_url

VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
```

> Never put actual production secrets in `.env.example`.

---

# 🌐 Deployment

The application is deployed using separate services for frontend and backend.

### Frontend

**Platform:** Vercel

```text
React + Vite
       ↓
     Vercel
       ↓
Production Website
```

### Backend

**Platform:** Render

```text
Node.js + Express
       ↓
     Render
       ↓
Production REST API
```

### Database

**Platform:** MongoDB Atlas

```text
Express Backend
       ↓
 MongoDB Atlas
       ↓
Application Data
```

### Media

**Platform:** Cloudinary

```text
Application
     ↓
Cloudinary
     ↓
Images
```

### Email

**Platform:** Resend

```text
Backend
   ↓
Resend API
   ↓
Verification Email
```

### Authentication

**Platform:** Firebase

```text
User
  ↓
Firebase Authentication
  ↓
Google Authentication
  ↓
Firebase ID Token
  ↓
Backend Verification
```

---

# ⚙️ Local Development

## 1. Clone the Repository

```bash
git clone https://github.com/Ankit-1803/eWrite.git
cd eWrite
```

## 2. Install Backend Dependencies

```bash
cd backend
npm install
```

## 3. Configure Backend Environment

Create:

```text
backend/.env
```

Add the required MongoDB, JWT, Cloudinary, Firebase, Resend, and frontend URL configuration.

Example:

```env
PORT=3000

DB_URL=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

RESEND_API_KEY=your_resend_api_key
EMAIL_FROM=your_sender_email

CLIENT_URL=your_frontend_url
```

> Never commit your actual `.env` file or production secrets to GitHub.

## 4. Start Backend

```bash
npm start
```

The backend will start using the configured environment variables.

## 5. Install Frontend Dependencies

Open another terminal:

```bash
cd frontend
npm install
```

## 6. Configure Frontend Environment

Create:

```text
frontend/.env
```

Configure the backend API URL and Firebase client configuration.

Example:

```env
VITE_BACKEND_URL=your_backend_api_url

VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## 7. Start Frontend

```bash
npm run dev
```

The Vite development server will provide the local application URL.

---

# 🧪 Production Build

To verify the frontend production build:

```bash
cd frontend
npm run build
```

The generated production files are placed in:

```text
frontend/dist/
```

---

# 🔌 API Architecture

The backend follows a modular REST API structure.

```text
/api/v1
    │
    ├── users
    │   ├── registration
    │   ├── login
    │   ├── Google authentication
    │   ├── email verification
    │   ├── profile operations
    │   └── follow operations
    │
    ├── blogs
    │   ├── create
    │   ├── update
    │   ├── delete
    │   ├── fetch
    │   ├── like
    │   ├── save
    │   └── draft management
    │
    └── comments
        ├── create
        ├── update
        ├── delete
        ├── reply
        └── like
```

The exact endpoint implementation is maintained inside the backend `routes/` directory.

---

# 🎨 Frontend UX

The application focuses on providing a clean, responsive, and user-friendly writing and reading experience.

Important UI areas include:

- Navigation bar
- Search interface
- Authentication pages
- Blog feed
- Blog reading page
- Blog editor
- User profile
- Saved blogs
- Liked blogs
- Draft blogs
- Comments panel
- Settings page
- Privacy controls
- Responsive action buttons

Async actions use loading and disabled states to prevent accidental duplicate requests.

Examples:

```text
Add Comment
     ↓
Adding Comment...
     ↓
Request Complete
```

```text
Save Changes
     ↓
Saving...
     ↓
Request Complete
```

---

# 🧩 Important Functional Modules

```text
Authentication
     │
     ├── Email Registration
     ├── Email Verification
     ├── Email Login
     └── Google Login

Blog Management
     │
     ├── Create
     ├── Read
     ├── Update
     ├── Delete
     └── Drafts

Social Interaction
     │
     ├── Likes
     ├── Saved Blogs
     ├── Comments
     ├── Replies
     ├── Comment Likes
     └── Following

Profile
     │
     ├── User Profile
     ├── Published Blogs
     ├── Drafts
     ├── Saved Blogs
     └── Liked Blogs

Settings
     │
     └── Privacy & Visibility
```

---

# 🛡️ Error & Edge-Case Handling

The application handles several common production scenarios, including:

- Invalid login credentials
- Duplicate user registration
- Unverified email accounts
- Invalid or expired verification tokens
- Failed API requests
- Authentication failures
- Invalid user operations
- Unauthorized actions
- Failed image uploads
- Failed email delivery
- Duplicate action prevention
- Frontend route refreshes in production

---

# 📱 Responsive Design

The frontend is designed to provide a consistent experience across:

- Desktop
- Laptop
- Tablet
- Mobile-sized screens

The UI uses responsive layouts and Tailwind CSS utility classes.

---

# 🧠 Engineering Highlights

## Separation of Concerns

Frontend and backend are maintained independently.

```text
frontend/
backend/
```

This makes the application easier to maintain, test, and deploy.

## Environment-Based Configuration

Sensitive and environment-specific values are stored using environment variables rather than being hardcoded into the production application.

## Cloud-Based Infrastructure

The application uses specialized cloud services:

```text
Vercel       → Frontend
Render       → Backend
MongoDB      → Database
Cloudinary   → Media Storage
Resend       → Email Delivery
Firebase     → Authentication
```

## RESTful Backend Architecture

Controllers, routes, models, middleware, configuration, and utilities are separated into dedicated directories.

```text
backend/
├── config/
├── controller/
├── middleware/
├── models/
├── routes/
└── utils/
```

This structure improves maintainability and keeps responsibilities separated.

## Authentication Security

The application combines multiple authentication and security mechanisms:

```text
bcrypt
  +
JWT
  +
Firebase Authentication
  +
Firebase Admin
```

This allows eWrite to support both traditional email/password authentication and Google authentication.

---

# 🚀 Future Improvements

Potential future improvements include:

- Custom domain for the production application
- Verified Resend sending domain
- Advanced blog search
- Tags and categories
- Pagination or infinite scrolling
- Richer content editor features
- Notification system
- Email notifications
- Password reset via email
- Account recovery
- Profile customization
- Improved moderation tools
- Admin dashboard
- Analytics
- Content reporting
- SEO optimization
- Progressive Web App support
- Automated testing
- CI/CD improvements
- Rate limiting
- API documentation with Swagger/OpenAPI

---

# 📊 Project Highlights

| Area | Implementation |
|---|---|
| Frontend | React + Vite |
| Styling | Tailwind CSS |
| Backend | Node.js + Express |
| Database | MongoDB Atlas |
| ODM | Mongoose |
| Authentication | JWT + Firebase |
| Google Login | Firebase Authentication |
| Password Security | bcrypt |
| Image Storage | Cloudinary |
| Email | Resend |
| API Communication | Axios |
| Routing | React Router |
| Deployment | Vercel + Render |
| Database Hosting | MongoDB Atlas |

---

# 🤝 Contributing

Contributions are welcome.

A typical contribution workflow:

```bash
git checkout -b feature/your-feature
```

Make your changes, test them locally, and then create a pull request.

Please ensure:

- Existing functionality is not broken
- Environment secrets are not committed
- The frontend production build succeeds
- Code remains organized and readable

---

# 🔐 Security Notice

Never commit sensitive files or credentials such as:

```text
.env
.env.local
Firebase Admin credentials
API keys
JWT secrets
Database credentials
Cloudinary secrets
Resend API keys
```

Use environment variables for all sensitive configuration.

If a credential is accidentally exposed, rotate it immediately.

---

# 👨‍💻 Developer

**Ankit Raj**

B.Tech Computer Science Engineering Student

Project: **eWrite**

---

# 📜 License

This project is available under the license specified in the repository.

---

# ⭐ eWrite

> **Share ideas. Read stories. Grow together.**

eWrite is built to make publishing thoughts simple while creating a community-driven environment for discovering and discussing ideas.
