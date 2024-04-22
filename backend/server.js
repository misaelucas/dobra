const express = require("express");
const cors = require("cors");

require("dotenv").config();
const { MongoClient } = require("mongodb");
const { ObjectId } = require('mongodb');
const bcrypt = require("bcrypt");
const moment = require("moment-timezone");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());


let dbClient; // Global variable to hold the client

async function connectDB() {
  const uri = process.env.DB_URI;
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    dbClient = client; // Store the client for later use
    return client.db(process.env.DB_NAME); // Return the database instance to be used by the routes
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1); // Exit if the database connection fails
  }
}

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const usersCollection = dbClient.db(process.env.DB_NAME).collection("users");
  console.log("Login attempt for username:", username);

  try {
    const user = await usersCollection.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const passwordsMatch = await bcrypt.compare(password, user.passwordHash);
    if (passwordsMatch) {
      const token = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      res.json({ token, role: user.role });
    } else {
      res.status(401).json({ error: "Invalid username or password" });
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal server error", details: error.message });
  }

});

app.post("/submit-form", async (req, res) => {
  const formData = req.body;

  // Get the current time in Sao Paulo timezone
  const now = moment.tz("America/Sao_Paulo");

  // Subtract three hours to adjust for UTC-3 timezone
  const adjustedDate = now.subtract(3, "hours").toDate();

  // Update the formData with the adjusted date
  formData.date = adjustedDate;

  try {
    const collection = dbClient.db(process.env.DB_NAME).collection("entradas");
    await collection.insertOne(formData);
    res.status(201).json({ message: "Form submitted successfully" });
  } catch (error) {
    console.error("Error inserting form data into database:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


app.get("/admin/forms", async (req, res) => {
  const { year, month, day } = req.query;
  const timezoneOffset = -3;
  const startOfDay = moment
    .tz({ year, month: month - 1, day }, "America/Sao_Paulo")
    .startOf("day")
    .add(timezoneOffset, "hours");
  const endOfDay = moment(startOfDay).add(1, "day");

  try {
    const collection = dbClient.db("BOBERKURWA").collection("entradas");
    const query = {
      date: { $gte: startOfDay.toDate(), $lt: endOfDay.toDate() },
    };
    const forms = await collection.find(query).toArray();
    const formattedForms = forms.map((form) => ({
      ...form,
      date: moment(form.date).format("YYYY-MM-DD HH:mm:ss"),
    }));
    res.status(200).json(formattedForms);
  } catch (error) {
    console.error("Failed to fetch forms:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/admin/expenses", async (req, res) => {
  const expenseData = req.body;
  try {
    const expensesCollection = dbClient.db("BOBERKURWA").collection("expenses");
    await expensesCollection.insertOne(expenseData);
    res.status(201).json({ message: "Despesa adicionada com sucesso" });
  } catch (error) {
    console.error("Erro ao inserir despesa no banco de dandos:", error);
    res.status(500).json({ error: "DEU PROBLEMA.. ERRO 500" });
  }
});

app.get("/admin/expenses", async (req, res) => {
  const { year, month, day } = req.query;
  const formattedDate = `${year}-${month.padStart(2, "0")}-${day.padStart(
    2,
    "0"
  )}`;
  try {
    const expensesCollection = dbClient.db("BOBERKURWA").collection("expenses");
    const query = { date: formattedDate };
    const expenses = await expensesCollection.find(query).toArray();
    res.status(200).json(expenses);
  } catch (error) {
    console.error("Failed to fetch expenses:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


app.delete("/admin/forms/:id", async (req, res) => {
  const { id } = req.params;
  const collection = dbClient.db(process.env.DB_NAME).collection("entradas");

  try {
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Form not found" });
    }
    res.status(200).json({ message: "Form deleted successfully" });
  } catch (error) {
    console.error("Error deleting form:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


async function startServer() {
  await connectDB(); // Connect to DB before starting the server
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

startServer();
