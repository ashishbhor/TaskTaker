# TaskTaker – Modern Productivity App

TaskTaker is a full-stack web application that allows users to securely manage their daily tasks with authentication, profile management, and a responsive dashboard.

---

## 🚀 Tech Stack

### Frontend
- React.js (Vite)
- TypeScript
- Tailwind CSS
- Fetch API
- Deployed on Vercel

### Backend
- Node.js
- Express.js
- MongoDB Atlas
- JWT Authentication
- bcrypt for password hashing
- Deployed on Render

---

##  Features

- User signup & login (JWT based)
- Protected dashboard
- Create, read, update, delete tasks
- User profile (view & update)
- Search, filter & pagination
- Responsive UI (mobile + desktop)
- Error handling & loading states

---

##  Environment Variables

### Backend (`backend/.env`)
```env
PORT=5000
MONGO_URI=mongodb://tasktakervb_user:Vikas%402004@ac-mppsjy6-shard-00-00.wtqn7gh.mongodb.net:27017,ac-mppsjy6-shard-00-01.wtqn7gh.mongodb.net:27017,ac-mppsjy6-shard-00-02.wtqn7gh.mongodb.net:27017/tasktaker?ssl=true&authSource=admin&retryWrites=true&w=majority
JWT_SECRET=supersecretkey123
```

### Frontend
```VITE_API_URL=https://tasktaker-y1v.onrender.com/api/v1```

▶️ How to Run Locally

Backend
cd backend
npm install
npm run dev
Runs on: http://localhost:5000

Frontend
cd frontend
npm install
npm run dev
Runs on: http://localhost:3000

🌍 Live Deployment

Frontend: https://task-taker-one.vercel.app
Backend API: https://tasktaker-y1v.onrender.com


🧪 Demo Credentials (Optional)
Email: demo@gmail.com
Password: 123456
(Or create a new account via signup)

📬 API Testing

Thunder Client / Postman supported
Base URL:https://tasktaker-y1v.onrender.com/api/v1

Endpoints:

POST /auth/signup
POST /auth/login
GET /me
PUT /me
GET /tasks
POST /tasks
PUT /tasks/:id
DELETE /tasks/:id

📌 Notes
Passwords are securely hashed
JWT is validated on protected routes
CORS configured for frontend domains
Code structured for easy scaling

---
##  Postman / Thunder Client

### Thunder Client (Recommended)
- VS Code → Thunder Client
- Export collection (JSON)
- Add to repo as:
/postman/tasktaker-api.json

“How would scale this for production?”
To scale this application for production, I would use Docker for containerization and a CI/CD pipeline for automated deployments.
I would introduce Redis caching for frequently accessed data, add database indexing on userId and task fields, and enable rate-limiting for APIs.
Environment variables would be managed securely using cloud secrets.
CORS rules would be restricted per environment, and logging would be centralized using tools like Winston or Datadog.
Finally, I’d add monitoring, health checks, and horizontal scaling for the backend services.


