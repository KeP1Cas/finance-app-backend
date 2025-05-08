require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = ["https://kep1cas.github.io", "http://localhost:3000"];

// Настройка CORS
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
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

app.put("/transactions", async (req, res) => {
  try {
    const { _id, date, category, description, quantity, type } = req.body;

    // Проверка наличия ID
    if (!_id) {
      return res.status(400).send({ error: "Transaction ID is required" });
    }

    // Обновление документа
    const updatedTransaction = await Transaction.findByIdAndUpdate(
      _id,
      { date, category, description, quantity, type },
      { new: true } // Вернуть обновленный документ
    );

    if (!updatedTransaction) {
      return res.status(404).send({ error: "Transaction not found" });
    }

    res.status(200).send(updatedTransaction);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.delete("/transactions", async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).send({ error: "Transaction ID is required" });
    }

    const deletedTransaction = await Transaction.findByIdAndDelete(id);

    if (!deletedTransaction) {
      return res.status(404).send({ error: "Transaction not found" });
    }

    res.status(200).send({ message: "Transaction deleted successfully" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Start Server
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
