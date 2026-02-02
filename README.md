# FinTrack - API Service

This is the secure backend service for the FinTrack application. It provides a RESTful API for user authentication, transaction management, and financial aggregation, built to handle cross-platform requests securely.

### Looking for frontend?
**Frontend repo:** https://github.com/kavya01S/money-manager-frontend.git

## 🚀 Live API Base URL
https://money-manager-backend-qdhe.onrender.com  

## 🛠️ Tech Stack
* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** MongoDB (Mongoose ODM)
* **Authentication:** JWT (JSON Web Tokens)
* **Security:** Bcrypt (Hashing), Dynamic CORS Policy

## 🔐 Key Architecture Decisions

### 1. Dynamic Origin Security (CORS)
* **Problem:** Static CORS whitelists often fail when accessing the API from different client environments (Mobile Web vs. Desktop vs. Localhost).
* **Solution:** Implemented **Dynamic Origin Resolution**. The server inspects the incoming request origin and validates it dynamically. This allows the API to securely accept credentials (cookies/headers) from authorized Vercel deployments and mobile browsers without hardcoding fragile URLs.

### 2. Data Isolation & Ownership
* Implemented a strict **Ownership Middleware**.
* Every CRUD request (`GET`, `POST`, `DELETE`) is intercepted to verify the JWT token. The controller explicitly checks the `user_id` against the transaction owner to ensure users can strictly only access their own financial data.

### 3. Scalable Database Schema
* Designed a Mongoose schema optimized for **Read-Heavy Analytics**.
* Indexes are applied to `user_id` and `date` fields to ensure sub-100ms query performance for the dashboard charts, even as transaction history grows into the thousands.

## ⚙️ Local Setup

1.  Clone the repository:
    ```bash
    git clone https://github.com/kavya01S/money-manager-backend.git
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the root:
    ```env
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_secret_key
    NODE_ENV=development
    ```
4.  Run the server:
    ```bash
    npm run dev
    ```

---
*Developed by Kavya S
