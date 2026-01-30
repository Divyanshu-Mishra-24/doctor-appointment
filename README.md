# 🩺 Doctor Appointment Booking System

A full-stack web application that allows patients to book appointments with doctors, view profiles, and manage bookings securely and efficiently.

> ⚠️ **Note:** This project is currently under development. Features and UI/UX may change frequently as improvements are being implemented.

---

## 📌 Features

- 🧑‍⚕️ Doctor Registration & Login
- 👤 Patient Registration & Login
- 🔒 JWT-based Authentication & Authorization
- 📅 Doctor Availability & Booking System
- 📋 Appointment History for Patients & Doctors
- 🔔 Real-time Notifications
- 🛡️ Role-Based Access (Admin, Doctor, User)
- 🎨 Clean & Responsive UI using React

---

## 🧪 Tech Stack

| Frontend     | Backend       | Database   | Authentication |
|--------------|---------------|------------|----------------|
| React.js     | Node.js       | MongoDB    | JWT |
| Redux Toolkit| Express.js    | Mongoose   | bcrypt         |
| Ant Design   | REST API      |            |                |

---
## 📁 Project Structure

```text

Doctor_Appointment/
├── client-new/                 # Frontend (React)
│   ├── public/
│   └── src/
│       ├── components/         # Reusable UI components
│       ├── pages/              # Pages like Home, Login, Register, etc.
│       ├── redux/              # Redux setup and slices
│       ├── App.js              # Main App component
│       └── index.js            # React root
│
├── config/                     # DB configuration
│   └── db.js
│
├── controllers/                # Route logic controllers
│   ├── adminCtrl.js
│   ├── doctorCtrl.js
│   └── userCtrl.js
│
├── middlewares/                # Auth and role-based access control
│   ├── adminMiddleware.js
│   └── authMiddleware.js
│
├── models/                     # Mongoose models
│   ├── appointmentModel.js
│   ├── doctorModel.js
│   ├── InfoModel.js
│   └── userModel.js
│
├── routes/                     # Express routers
│   ├── adminRoutes.js
│   ├── authRoutes.js
│   ├── doctorRoutes.js
│   └── userRoutes.js
│
├── Uploads/                     # Image uploads
│   ├── Profile picture
│
├── server.js                   # Entry point for the backend
├── .gitignore
├── package.json
└── README.md

```
---

## 🚀 Setup Instructions

1. **Clone the repo**
   ```bash
   git clone https://github.com/Divyanshu-Mishra-24/doctor-appointment.git
   cd doctor-appointment
---

## 🌐 Environment Variables

Create a `.env` file in the root of your project and add the following environment variables:

```env
PORT=8000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

> ⚠️ **Important:** Never commit your `.env` file to version control (it's ignored via `.gitignore`).

---

## 🛠️ Installation Guide

Follow these steps to clone and run the project locally:

```bash
# Step 1: Clone the repository
git clone https://github.com/your-username/doctor-appointment.git

# Step 2: Navigate to the project directory
cd doctor-appointment

# Step 3: Install server dependencies
npm install

# Step 4: Move to the frontend directory
cd client-new

# Step 5: Install frontend dependencies
npm install

# Step 6: Return to the root directory
cd ..

# Step 7: Create a .env file and configure environment variables as shown above

# Step 8: Run the backend and frontend concurrently
npm run dev
```

> 💡 Make sure MongoDB is running and environment variables are set correctly before starting the server.

---
---

## 📦 Available Scripts

In the root directory:

```bash
npm run dev       # Runs backend and frontend concurrently
npm run server    # Runs backend only
npm run client    # Runs frontend only (inside /client-new)
npm start         # Runs the React frontend
npm run build     # Builds the React app for production



