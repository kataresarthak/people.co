# PEOPLE.CO - Employee Management System

PEOPLE.CO is a premium, high-fidelity full-stack Employee Management System designed for modern organizations. It features a stunning dark-theme navigation bar, elegant data visualization, complete secure authentication, and a directory slider detail card modeled after modern design standards.

---

## 🚀 Key Features

*   **Secure Authentication:** Secure login/logout system using JSON Web Tokens (JWT) and Bcrypt encryption.
*   **Live Analytics Dashboard:** Interactive counters showcasing active/inactive staff count and horizontal proportional bar charts indicating structural team sizes.
*   **Employee Directory:** Unified table directory supporting instant database search, pagination, and multi-parameter filters.
*   **Detail Panel Slide-out:** Tray sliding smoothly from the right edge of the screen displaying comprehensive personal, contact, and work profile information.
*   **High-End Modals:** Seamless modal overlays populated automatically for member addition, deletion confirmation, and prefilled profile modifications.

---

## 🛠️ Technology Stack

### Frontend
*   **React JS (v19)** - For dynamic, highly responsive rendering components.
*   **Bootstrap (v5)** - Modern layout styling toolkit.
*   **React Router DOM** - Secure routing management.
*   **Axios** - Automatic interceptors handling authorization tokens and auto-logout on expiry.
*   **React Icons** - Clean modern vector iconography.

### Backend
*   **Node JS & Express JS** - High performance API endpoints.
*   **MongoDB & Mongoose** - Highly optimized data schemas, indexing, and aggregations.
*   **JWT & Bcrypt** - Token authentication and password salting/validation.

---

## 📂 Project Structure

```
People.co/
├── config/             # Database connection setup
├── controllers/        # Express handlers (User, Employee, Dashboard)
├── middleware/         # Custom authentication verification
├── model/              # Mongoose database schemas
├── routes/             # REST API endpoint definitions
├── client/             # Vite + React single-page frontend application
│   ├── src/
│   │   ├── components/ # Reusable UI (Sidebar, Toasts)
│   │   ├── context/    # Global Auth State Provider
│   │   ├── pages/      # Login, Dashboard, Employees
│   │   ├── services/   # Axios API calling wrappers
│   │   └── index.css   # Curated premium theme styling
│   └── vite.config.js  # Build config with backend proxy setup
├── .env                # Secret environment variables (Excluded from git)
├── index.js            # Node main entry server file
└── package.json        # Main server script dependencies
```

---

## ⚙️ Local Installation & Setup

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) and a running instance of [MongoDB](https://www.mongodb.com/) installed locally.

### Step 1: Clone the Repository
```bash
git clone https://github.com/kataresarthak/people.co.git
cd people.co
```

### Step 2: Configure Environment Variables
Create a `.env` file in the root directory and add the following:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/employee_management
JWT_SECRET=your_jwt_secret_key_here
```

### Step 3: Install Dependencies
Install packages for both root backend and React client:
```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
cd ..
```

### Step 4: Run Seeding & Start Development
Open a terminal and start the applications:
```bash
# Start Backend API Server (Runs on http://localhost:5000)
npm run dev

# Start Frontend Dev Server in another terminal (Runs on http://localhost:3000)
cd client
npm run dev
```

*   **Default Seed Login Credentials:**
    *   **Email:** `admin@peopleco.com`
    *   **Password:** `admin123`

---

## ☁️ Deployment Guide

### Deploying the Backend
You can host the Express API server on **Render**, **Railway**, or **Heroku**:
1. Connect your GitHub repository to the platform.
2. Set the build command to `npm install` and start command to `node index.js`.
3. Configure Environment Variables in the platform settings: `PORT`, `MONGODB_URI`, and `JWT_SECRET`.

### Deploying the Frontend on Vercel
Vercel is fully optimized to host Vite + React single page applications:
1. Navigate to [Vercel](https://vercel.com/) and click **Add New Project**.
2. Select your repository `people.co`.
3. Set the root directory of the project to `client`.
4. Configure **Build Settings**:
    *   **Framework Preset:** Vite
    *   **Build Command:** `npm run build`
    *   **Output Directory:** `dist`
5. Click **Deploy**. Vercel will host your client dashboard successfully!
