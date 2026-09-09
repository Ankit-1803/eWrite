# 📝 Blog Platform

A full-stack blogging platform where users can create, edit, publish, save, like, and manage their blogs through a clean and user-friendly interface.

The project is built with a modern **React frontend**, **Node.js/Express backend**, and **MongoDB database**, with authentication and deployment support.

---

## 🚀 Live Demo

🔗 **Live Website:** [Add your deployed frontend URL here]

🔗 **Backend API:** [Add your deployed backend URL here]

---

## 📌 About The Project

This project is a full-stack blog application designed to provide users with a complete blogging experience.

Users can create their own blogs, save unfinished work as drafts, publish blogs, edit or delete their content, like blogs, save blogs for later, and manage their content from their personal profile.

The application follows a client-server architecture where the frontend communicates with a RESTful backend API, while MongoDB is used for persistent data storage.

---

## ✨ Features

### 👤 User Authentication

* User registration and login
* Secure authentication
* Protected user-specific operations
* User session management
* User-specific blog management

### 📝 Blog Management

* Create new blogs
* Edit existing blogs
* Delete blogs
* Publish blogs
* Save blogs as drafts
* View published blogs
* Manage personal blogs from the profile page

### 📚 Blog Interaction

* Like blogs
* Save blogs for later
* View liked blogs
* View saved blogs
* Read published blog posts

### 📂 Draft Management

Users can keep unfinished blogs as drafts and continue editing them later.

Draft functionality allows users to:

* Create a draft
* Edit a draft
* View all drafts
* Publish a draft when ready
* Delete unwanted drafts

### 👤 Profile

Each user has a personal profile section where they can manage their blogging activity.

The profile includes:

* Profile home
* User's blogs
* Saved blogs
* Draft blogs
* Liked blogs

### ✍️ Rich Blog Content

The blog editor supports structured content such as:

* Headings
* Paragraphs
* Ordered lists
* Unordered lists
* Multiple content blocks
* Formatted blog content

Blog content is stored in a structured format, allowing the frontend to render different content blocks appropriately.

### 🔐 Authorization

Users can only perform protected operations on resources they are authorized to manage.

For example:

> A user can delete their own blog from their profile rather than deleting another user's content.

---

## 🛠️ Tech Stack

### Frontend

* **React.js**
* **JavaScript**
* **HTML5**
* **CSS**
* **React Router**
* REST API integration

### Backend

* **Node.js**
* **Express.js**
* RESTful API architecture
* Authentication & authorization
* Middleware-based request handling

### Database

* **MongoDB**
* **MongoDB Atlas**
* **Mongoose**

### Deployment & Services

* Frontend deployment: **[Your hosting service]**
* Backend deployment: **Render**
* Database: **MongoDB Atlas**
* Email service: **[Your email service]**

---

## 🏗️ Project Architecture

The application follows a three-layer architecture:

```text
                    ┌───────────────────┐
                    │      User         │
                    └─────────┬─────────┘
                              │
                              ▼
                    ┌───────────────────┐
                    │ React Frontend    │
                    │                   │
                    │ UI / Components   │
                    │ Routing           │
                    │ State Management  │
                    └─────────┬─────────┘
                              │
                         REST API
                              │
                              ▼
                    ┌───────────────────┐
                    │ Node + Express    │
                    │                   │
                    │ Routes            │
                    │ Controllers       │
                    │ Middleware        │
                    │ Authentication    │
                    └─────────┬─────────┘
                              │
                              ▼
                    ┌───────────────────┐
                    │ MongoDB Atlas     │
                    │                   │
                    │ Users             │
                    │ Blogs             │
                    │ Likes / Saves     │
                    └───────────────────┘
```

---

## 📁 Project Structure

A simplified structure of the project looks like:

```text
Blog-Application/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── assets/
│   │   └── App.jsx
│   │
│   ├── package.json
│   └── ...
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   ├── utils/
│   ├── server.js
│   ├── package.json
│   └── ...
│
├── .gitignore
└── README.md
```

> The exact folder structure may vary depending on the current implementation.

---

## 🔄 How It Works

### 1. User Authentication

The user creates an account or logs into an existing account.

The backend verifies the user's credentials and establishes an authenticated session.

### 2. Creating a Blog

After authentication, the user can create a new blog.

The blog can either be:

* Published immediately
* Saved as a draft

### 3. Publishing

When a draft is ready, the user can publish it.

Once published, it becomes available to other users through the public blog interface.

### 4. Blog Interaction

Other users can interact with published blogs by:

* Liking them
* Saving them
* Reading them

### 5. Profile Management

Users can manage their own blogging activity through their profile.

---

## 🔌 API Overview

The backend exposes RESTful API endpoints for different resources.

Example endpoint structure:

```text
/api/auth
/api/users
/api/blogs
```

Typical operations include:

```text
POST    /api/auth/register
POST    /api/auth/login

GET     /api/blogs
GET     /api/blogs/:id

POST    /api/blogs
PUT     /api/blogs/:id
DELETE  /api/blogs/:id

POST    /api/blogs/:id/like
POST    /api/blogs/:id/save
```

> Endpoint names may differ depending on the final backend implementation.

---

## 🔒 Security

The project follows several security practices:

* Sensitive credentials are stored using environment variables.
* Secret configuration files are excluded using `.gitignore`.
* Protected routes require authentication.
* Authorization checks prevent users from modifying other users' resources.
* Database credentials are not committed to the repository.

### Environment Variables

Example:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
CLIENT_URL=your_frontend_url
EMAIL_USER=your_email
EMAIL_PASSWORD=your_email_password
```

⚠️ **Never commit real credentials, API keys, database URLs, JWT secrets, or email passwords to GitHub.**

---

## ⚙️ Installation & Setup

### Prerequisites

Make sure you have installed:

* Node.js
* npm
* Git
* MongoDB Atlas account

---

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
```

```bash
cd YOUR_REPOSITORY
```

---

### 2. Setup Backend

```bash
cd backend
npm install
```

Create a `.env` file:

```env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
```

Start the backend:

```bash
npm run dev
```

or:

```bash
npm start
```

---

### 3. Setup Frontend

Open another terminal:

```bash
cd frontend
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will usually be available at:

```text
http://localhost:5173
```

---

## 🌐 Deployment

The project can be deployed using separate services for the frontend, backend, and database.

Example deployment architecture:

```text
                   Internet
                       │
                       ▼
              ┌─────────────────┐
              │ React Frontend  │
              │   Deployment    │
              └────────┬────────┘
                       │
                       │ API Requests
                       ▼
              ┌─────────────────┐
              │ Node / Express  │
              │     Render      │
              └────────┬────────┘
                       │
                       │ MongoDB Driver
                       ▼
              ┌─────────────────┐
              │  MongoDB Atlas  │
              └─────────────────┘
```

Environment variables should be configured separately in the deployment platforms.

---

## 🧪 Testing

Before deployment, test the main application flows:

* User registration
* User login
* Creating a blog
* Editing a blog
* Deleting a blog
* Saving a draft
* Publishing a draft
* Liking a blog
* Saving a blog
* Viewing saved blogs
* Viewing liked blogs
* Viewing profile content
* Unauthorized access attempts

---

## 🐛 Error Handling

The backend handles invalid requests and server-side errors through structured error handling.

Common cases include:

* Invalid authentication
* Missing required fields
* Invalid blog ID
* Unauthorized operations
* Resource not found
* Database errors
* Server errors

---

## 📈 Future Improvements

Possible improvements for future versions include:

* 💬 Blog comments
* 🔍 Advanced blog search
* 🏷️ Categories and tags
* 👥 Follow users
* 🔔 Notifications
* 🖼️ Image uploads
* ❤️ Improved reaction system
* 📊 User analytics
* 🌙 Dark mode
* 📱 Improved mobile responsiveness
* ✨ Richer text editor
* 📧 Email notifications
* 🔗 Social sharing
* 📑 Pagination and infinite scrolling

---

## 🎯 Learning Outcomes

This project helped strengthen practical knowledge of:

* Full-stack web development
* React application development
* REST API design
* Node.js and Express
* MongoDB and Mongoose
* Authentication and authorization
* CRUD operations
* API integration
* Database modeling
* Protected routes
* Environment variables
* Git and GitHub
* Deployment
* Debugging and error handling

---

## 📸 Screenshots

Add screenshots of your application here.

Example:

```text
### Home Page

[Add screenshot here]

### Blog Editor

[Add screenshot here]

### User Profile

[Add screenshot here]

### Saved Blogs

[Add screenshot here]
```

---

## 🤝 Contributing

Contributions are welcome.

If you would like to contribute:

1. Fork the repository
2. Create a new branch

```bash
git checkout -b feature/your-feature
```

3. Make your changes
4. Commit your changes

```bash
git commit -m "Add your feature"
```

5. Push the branch

```bash
git push origin feature/your-feature
```

6. Open a Pull Request

---

## 📄 License

This project is currently available for educational and personal use.

If you plan to distribute or modify this project, add an appropriate open-source license such as MIT.

---

## 👨‍💻 Author

**Ankit Raj**

Engineering Student

GitHub: [Your GitHub Profile]

---

## ⭐ Support

If you found this project useful or interesting, consider giving the repository a ⭐ on GitHub.

---

### 💡 Built with curiosity, code, and a lot of debugging.
