# 🏥 Aarogya 24x7 - Smart Pathology Lab Management System

Aarogya 24x7 is a full-stack MERN (MongoDB, Express.js, React.js, Node.js) web application that simplifies pathology laboratory management. It provides separate portals for Clients, Administrators, Doctors, and Laboratories, allowing efficient management of diagnostic tests, appointments, reports, packages, and users.

---

## 🚀 Features

### 👤 Client
- Client Registration & Login
- JWT Authentication
- View Dashboard
- Book Diagnostic Tests
- View Test Packages
- Browse Partner Labs
- Edit Profile
- View Appointment History

### 👨‍⚕️ Doctor
- Doctor Login
- Doctor Dashboard
- View Patients
- Manage Prescriptions

### 🏥 Laboratory
- Lab Login
- Lab Dashboard
- View Booked Tests
- Upload Reports

### 👨‍💼 Administrator
- Admin Login
- Admin Dashboard
- Manage Laboratories
- Manage Doctors
- Manage Clients
- Manage Tests
- Manage Packages
- View Appointments

---

## 🛠 Tech Stack

### Frontend
- React.js
- React Router DOM
- Axios
- CSS

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcrypt.js

---

## 📂 Project Structure

```
Aarogya-24x7
│
├── backend
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── server.js
│   └── package.json
│
├── frontend
│   ├── public
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── styles
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
│
└── README.md
```

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/Rucha05-create/Pathology-Lab-.git
```

Go to project folder

```bash
cd Pathology-Lab-
```

---

## Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Run backend

```bash
npm run dev
```

---

## Frontend Setup

Open another terminal

```bash
cd frontend
npm install
npm start
```

Application will run on

```
http://localhost:3000
```

Backend runs on

```
http://localhost:5000
```

---

## 🔐 Authentication

The system uses:

- JSON Web Token (JWT)
- bcrypt Password Hashing
- Role-Based Access Control

Supported Roles:

- Client
- Administrator
- Doctor
- Laboratory

---

## 📦 Current Modules

### Module 1
- Authentication
- User Management

### Module 2
- Test Booking
- Packages
- Vendor/Lab Listing

### Module 3
- Multi-role Login
- Protected Routes
- Admin Dashboard
- Doctor Dashboard
- Laboratory Dashboard
- Client Dashboard
- Manage Labs
- Manage Doctors
- Manage Clients
- Manage Tests
- Manage Packages

---

## 📸 Screens

- Home Page
- Login Selection
- Client Dashboard
- Admin Dashboard
- Doctor Dashboard
- Laboratory Dashboard
- Manage Labs
- Manage Packages
- Book Test

---

## 📌 Future Enhancements

- Online Payment Gateway
- Email Notifications
- SMS Alerts
- Report PDF Download
- Appointment Calendar
- Search & Filters
- Analytics Dashboard
- Inventory Management
- AI-powered Health Recommendations

---

## 👩‍💻 Developed By

**Rucha Bhushan Patil**

B.Tech Computer Science Engineering

---

## 📜 License

This project is developed for educational purposes.
