require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// Настройка CORS
app.use(
  cors({
    origin: "http://localhost:3000", // Укажи адрес фронтенда
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"], // Разрешённые методы
    credentials: true, // Если нужно отправлять cookie
  })
);

// Middleware
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model("User", UserSchema);

// Регистрация
app.post("/registration", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = new User({ username, password }); // В реальном приложении хэши паролей
    await user.save();
    res.status(201).send({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Логин
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username, password });
    if (!user) {
      return res.status(401).send({ error: "Invalid credentials" });
    }
    res.status(200).send({ token: "mock-token", message: "Login successful" }); // Здесь можно сгенерировать JWT
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Models
const TransactionSchema = new mongoose.Schema({
  _userId: String,
  date: String,
  category: String,
  type: String,
  quantity: Number,
  description: String,
});
const Transaction = mongoose.model("Transaction", TransactionSchema);

// Routes
app.post("/transactions", async (req, res) => {
  try {
    const transaction = new Transaction(req.body);
    await transaction.save();
    res.status(201).send(transaction);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.get("/transactions", async (req, res) => {
  try {
    const transactions = await Transaction.find();
    res.send(transactions);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Start Server
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
