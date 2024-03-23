const express = require('express');
require('dotenv').config();
const { MongoClient } = require('mongodb');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(cors());

app.use(express.json());

// Connect to MongoDB
const uri = process.env.DB_URI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect();

// Define route to handle form submissions
app.post('/submit-form', async (req, res) => {
  const formData = req.body;

  try {
    const database = client.db('BOBERKURWA');
    const collection = database.collection('entradas');
    await collection.insertOne(formData);
    res.status(201).json({ message: 'Form submitted successfully' });
  } catch (error) {
    console.error('Error inserting form data into database:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
