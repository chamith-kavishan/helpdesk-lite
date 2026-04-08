# HelpDesk Lite

HelpDesk Lite is a lightweight helpdesk/ticketing system built with **NestJS + MySQL + MongoDB (backend)** and **React + Vite (frontend)**.  
It supports authentication, role-based access, ticket management, live comments via Socket.IO, and secure API practices (JWT, Zod validation).

---

## 🚀 Features

- 🔑 JWT authentication (login/register, roles: user/admin)
- 🎫 Ticket management (CRUD, assign, paginate, search)
- 💬 Live comments with Socket.IO (MongoDB persistence)
- 🛡️ Security: CSRF-safe JWT, Helmet, Zod validation
- 🗄️ Dual DB design: MySQL (users, tickets) + MongoDB (comments, events)

---

## 📂 Project Structure

helpdesk-lite/
├── backend/ # NestJS backend
│ ├── src/
│ ├── db/
│ ├── .env
│ ├── package.json
│ └── README.md
├── frontend/ # React + Vite frontend
│ ├── src/
│ ├── .env
│ ├── package.json
│ └── README.md
├── demo/ # Demo video
└── README.md

---

## ⚙️ Backend Setup

**Prerequisites:** Node.js 20+, MySQL 8.x, MongoDB 6.x

```bash
cd backend
npm install
mysql -u root -p helpdesk < db/mysql-schema.sql
npm run seed:admin
npm run start:dev

Backend runs on 👉 http://localhost:4000


💻 Frontend Setup

cd frontend
npm install
npm run dev

Frontend runs on 👉 http://localhost:5173


🔐 Example Credentials

admin@example.com / Admin@123!


📡 API Reference

Auth

POST /auth/register

POST /auth/login

Tickets

POST /tickets

GET /tickets?q=&status=&page=&limit=

GET /tickets/:id

PATCH /tickets/:id

PUT /tickets/:id/assign

Comments

POST /tickets/:id/comments

GET /tickets/:id/comments

Realtime (Socket.IO)

Connect → ws://localhost:4000

Join ticket → ticket:join

Leave ticket → ticket:leave

On new comment → comment:new


🗄️ Databases

MySQL: defined in backend/db/mysql-schema.sql (users, tickets)

MongoDB: collections → comments, events (see backend/db/mongo-indexes.md)


🔒 Security

✅ JWT auth with Passport strategy

✅ Zod validation pipes for DTOs

✅ RoleGuard (admin/user separation)

✅ Helmet middleware


🎥 Demo

See /demo folder for screenshots and demo.
```
