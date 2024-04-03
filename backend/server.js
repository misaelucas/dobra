const express = require("express");
require("dotenv").config();
const { MongoClient } = require("mongodb");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const moment = require("moment-timezone");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

// Connect to MongoDB
async function startServer() {
  const uri = process.env.DB_URI;
  const client = new MongoClient(uri);

  app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    const database = client.db(process.env.DB_NAME); // Use environment variable for DB name
    const usersCollection = database.collection("users");

    try {
      const user = await usersCollection.findOne({ username });
      if (!user) {
        return res.status(401).json({ error: "Invalid username or password" });
      }

      const passwordsMatch = await bcrypt.compare(password, user.passwordHash);
      if (passwordsMatch) {
        const token = jwt.sign(
          { userId: user._id, role: user.role /* if you have roles */ },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );
        res.json({ token });
      } else {
        res.status(401).json({ error: "Invalid username or password" });
      }
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/admin/forms", async (req, res) => {
    try {
      const { year, month, day } = req.query;

      // Construct a date object representing the start of the specified day
      const startOfDay = moment
        .tz({ year, month: month - 1, day }, "America/Sao_Paulo")
        .startOf("day");

      // Construct a date object representing the end of the specified day
      const endOfDay = moment(startOfDay).endOf("day");

      const database = client.db("BOBERKURWA");
      const collection = database.collection("entradas");

      // Query the collection for documents within the specified day
      const query = {
        date: {
          $gte: startOfDay.toDate(),
          $lte: endOfDay.toDate(),
        },
      };

      const forms = await collection.find(query).toArray();

      // Convert the date back to a string including the time for display
      const formattedForms = forms.map((form) => {
        return {
          ...form,
          date: moment(form.date).format("YYYY-MM-DD HH:mm:ss"), // Adjust the format as you prefer
        };
      });

      res.status(200).json(formattedForms);
    } catch (error) {
      console.error("Failed to fetch forms:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  try {
    await client.connect();
    console.log("Connected to MongoDB");

    // Define route to handle form submissions
    app.post("/submit-form", async (req, res) => {
      const formData = req.body;

      // Get the current time in Sao Paulo timezone
      const now = moment.tz("America/Sao_Paulo");

      // Subtract three hours to adjust for UTC-3 timezone
      const adjustedDate = now.subtract(3, "hours").toDate();

      // Update the formData with the adjusted date
      formData.date = adjustedDate;

      try {
        const database = client.db("BOBERKURWA");
        const collection = database.collection("entradas");
        await collection.insertOne(formData);
        res.status(201).json({ message: "Form submitted successfully" });
      } catch (error) {
        console.error("Error inserting form data into database:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    });

    // Start listening on the specified port
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

// Call the function to start the server
startServer();
