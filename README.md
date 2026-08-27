# Dhamo Repacks - Fullstack Game Distribution Platform

A modern, high-performance, dark-themed game repack platform built using the MERN stack (MongoDB, Express, React, Node.js) and Firebase Authentication, designed with a premium retro-hacker aesthetic using **Tailwind CSS v4** and **Redux** state management.

---

## 🚀 Key Features

* **Hacker Aesthetic (Branded)**: Responsive grid layouts featuring cyber green highlights, monospace data feeds, custom terminal elements, and size-reduction badges.
* **Firebase Google Authentication**: Single-click authorization via Google popups (JWT-free backend token verification).
* **Developer Mock Bypass**: Built-in developer mock authentication panel visible exclusively to the administrator email `dhamodhar200@gmail.com` to easily switch user roles during local testing.
* **Game Repacks Catalog**: Paginated grid featuring game listings with real-time views counters, genre tags, and searchable titles/developers/publishers.
* **Repack Specification Sheets**: Detailed game descriptions, selective feature lists, minimum/recommended requirements, and custom download mirror grids.
* **Interactive Comments**: Locked discussions that open up once authenticated, supporting user-linked feedback threads.
* **Admin dashboard panel**: Secure repack creation form containing dynamic fields for selective features and mirror links.

---

## 🛠️ Tech Stack & Architecture

### Backend (`/server`)
* **Node.js & Express**: ES Modules structure.
* **MongoDB & Mongoose**: Database management.
* **Firebase Admin SDK**: Cryptographic verification of client-side ID tokens.

### Frontend (`/client`)
* **React 18 & Vite**: Standard build configurations.
* **Tailwind CSS v4**: Theme directives and native utility classes.
* **React Redux**: Pure Redux pattern (`actionTypes`, `actions`, `reducer`, `store`) without Toolkit wrappers.
* **React Router Dom v6**: Declarative client routes (`/`, `/repack/:id`, `/login`, `/admin`).
* **Lucide React**: Icon sets.

---

## 🗄️ Backend API Endpoints

### 🔑 Authentication Routes (`/api/auth`)
* `POST /api/auth/google` - Accepts Firebase Client ID Token, verifies signatures, registers or logs in MongoDB profile, and returns session schema.
* `GET /api/auth/me` - Resolves details of the verified, currently authenticated session.

### 🎮 Repack Routes (`/api/repacks`)
* `GET /api/repacks` - Retrieve paginated lists of repacks.
  * *Query Parameters:*
    * `page` (default `1`)
    * `pageSize` (default `10`)
    * `keyword` (matches titles, developers, publishers)
    * `genre` (matches tags)
* `GET /api/repacks/:id` - Retrieve repack specification sheets and increments views counts.
* `POST /api/repacks` - Create new repack. *(Admin authorization required)*
* `PUT /api/repacks/:id` - Update existing repack parameters. *(Admin authorization required)*
* `DELETE /api/repacks/:id` - Delete selected repack. *(Admin authorization required)*

### 💬 Comment Routes (`/api/comments`)
* `GET /api/comments/repack/:repackId` - Fetch all community comments linked to a repack.
* `POST /api/comments` - Post a new comment linked to the authenticated user. *(Authenticated user required)*

---

## ⚙️ How to Setup and Run

### Prerequisites
* **Node.js** (v18+ recommended)
* **MongoDB** (running locally on port `27017` or custom Mongo connection URI)

---

### 1. Setup Backend
1. Open terminal inside `/server` directory:
   ```bash
   cd server
   ```
2. Install packages:
   ```bash
   npm install
   ```
3. (Optional) Create a `.env` file to customize settings:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/dhamo_repacks
   FIREBASE_PROJECT_ID=your-firebase-project-id
   ```
4. **Seed Database**: Populates initial games, users, and discussions:
   ```bash
   npm run seed
   ```
5. **Start server**:
   ```bash
   npm run start
   ```

---

### 2. Setup Frontend
1. Open terminal inside `/client` directory:
   ```bash
   cd ../client
   ```
2. Install packages:
   ```bash
   npm install
   ```
3. (Optional) Create a `.env` file to link custom Firebase:
   ```env
   VITE_FIREBASE_API_KEY=your-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   VITE_FIREBASE_APP_ID=your-app-id
   ```
4. **Start Dev Server**:
   ```bash
   npm run dev
   ```

---

## 🧪 Local Testing & Verification

1. Open your browser and navigate to **`http://localhost:5173/`**.
2. Click **Authenticate** in the top right.
3. Sign in via Google using **`dhamodhar200@gmail.com`**.
4. Once logged in under this email, you will see two developer mock switcher buttons in the header:
   * **Mock Admin**: Instantly switches your active login profile to the administrator (`FitGirl` mock account), opening the `/admin` page link to create or delete game repacks.
   * **Mock User**: Instantly switches your active login profile to a standard user (`gamer99`), allowing you to test comment features and general access layouts.
