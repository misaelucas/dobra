const express = require("express");
require("dotenv").config();
const { MongoClient } = require("mongodb");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const moment = require("moment-timezone");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

// Connect to MongoDB
async function startServer() {
  const uri = process.env.DB_URI;
  const client = new MongoClient(uri);

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
