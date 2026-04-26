Great choice — this is actually a **very strong beginner → intermediate level project** if built step-by-step. I’ll give you a **clean, beginner-friendly setup** so you don’t get overwhelmed.

We’ll build this in **3 simple phases**:

1. Backend (Express + Logger) 
2. Queue + Worker
3. Dashboard (basic)

---

# 🚀 STEP 1: Project Setup

## 📁 Create Project

```bash
mkdir security-monitoring-system
cd security-monitoring-system
```

---

# 🚀 STEP 2: Backend Setup (Express + Logger)

## 📦 Install Dependencies

```bash
npm init -y

npm install express mongoose dotenv winston amqplib cors
```

### What these do:

* `express` → API
* `mongoose` → MongoDB
* `winston` → logging
* `amqplib` → RabbitMQ
* `dotenv` → env variables
* `cors` → frontend connection

---

## 📁 Folder Structure (Start Simple)

```bash
backend/
├── config/
├── models/
├── routes/
├── services/
├── queue/
├── workers/
├── app.js
```

Create it:

```bash
mkdir backend && cd backend
mkdir config models routes services queue workers
touch app.js
```

---

# 🚀 STEP 3: Basic Express Server

## 📄 `backend/app.js`

```js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");

const app = express();
app.use(express.json());

// Routes
app.use("/api", authRoutes);

// DB connect
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// Server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
```

---

# 🚀 STEP 4: MongoDB Model

## 📄 `models/Log.js`

```js
const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
  event: String,
  user: String,
  ip: String,
  endpoint: String,
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Log", logSchema);
```

---

# 🚀 STEP 5: Logger Service (Winston)

## 📄 `services/loggerService.js`

```js
const winston = require("winston");
const sendToQueue = require("../queue/rabbitmq");

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.Console()
  ]
});

const logEvent = async (logData) => {
  logger.info(logData);

  // Send to queue
  await sendToQueue(logData);
};

module.exports = logEvent;
```

---

# 🚀 STEP 6: RabbitMQ Setup

## 📄 `queue/rabbitmq.js`

```js
const amqp = require("amqplib");

let channel;

const connectQueue = async () => {
  const connection = await amqp.connect("amqp://localhost");
  channel = await connection.createChannel();
  await channel.assertQueue("logs");
};

const sendToQueue = async (data) => {
  if (!channel) await connectQueue();

  channel.sendToQueue("logs", Buffer.from(JSON.stringify(data)));
};

module.exports = sendToQueue;
```

---

# 🚀 STEP 7: Auth Route (Test Logging)

## 📄 `routes/authRoutes.js`

```js
const express = require("express");
const router = express.Router();
const logEvent = require("../services/loggerService");

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (password !== "admin123") {
    await logEvent({
      event: "LOGIN_FAILED",
      user: username,
      ip: req.ip,
      endpoint: "/login"
    });

    return res.status(401).json({ message: "Login failed" });
  }

  await logEvent({
    event: "LOGIN_SUCCESS",
    user: username,
    ip: req.ip,
    endpoint: "/login"
  });

  res.json({ message: "Login success" });
});

module.exports = router;
```

---

# 🚀 STEP 8: Log Worker (VERY IMPORTANT)

## 📄 `workers/logWorker.js`

```js
const amqp = require("amqplib");
const mongoose = require("mongoose");
const Log = require("../models/Log");

const startWorker = async () => {
  await mongoose.connect("mongodb://127.0.0.1:27017/logsDB");

  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();

  await channel.assertQueue("logs");

  console.log("Worker started...");

  channel.consume("logs", async (msg) => {
    const data = JSON.parse(msg.content.toString());

    await Log.create(data);

    console.log("Log saved:", data);

    channel.ack(msg);
  });
};

startWorker();
```

---

# 🚀 STEP 9: .env File

## 📄 `.env`

```env
MONGO_URI=mongodb://127.0.0.1:27017/logsDB
```

---

# 🚀 STEP 10: Run Everything

## 1️⃣ Start MongoDB

```bash
mongod
```

## 2️⃣ Start RabbitMQ (Docker recommended)

```bash
docker run -d -p 5672:5672 rabbitmq
```

## 3️⃣ Run Backend

```bash
node backend/app.js
```

## 4️⃣ Run Worker

```bash
node backend/workers/logWorker.js
```

---

# 🚀 TEST API

Use Postman:

### ❌ Failed Login

```json
POST http://localhost:5000/api/login

{
  "username": "admin",
  "password": "wrong"
}
```

### ✅ Success Login

```json
{
  "username": "admin",
  "password": "admin123"
}
```

---

# 🎯 What You Built (Important for Interviews)

You now have:

* Async logging system
* Queue-based architecture
* Worker processing
* Real DB storage

---

# 🚀 NEXT STEP (Tell me 👍)

I can now help you build:

### 1️⃣ 🔥 React Dashboard (logs table + filters)

### 2️⃣ 🔐 Brute-force attack detection (VERY IMPRESSIVE)

### 3️⃣ 📊 Real-time logs using WebSocket

### 4️⃣ 🐳 Docker full setup

Just tell me:
👉 “dashboard banao” or
👉 “advanced features add karo”
