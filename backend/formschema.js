const mongoose = require("mongoose");

// Define the schema for your form
const formSchema = new mongoose.Schema({
  pacienteNome: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  payments: {
    type: [String],
    required: true,
  },
  observacao: {
    type: String,
    required: true,
  },
  exame: {
    type: String,
    required: true,
  },
  moneyAmount: {
    type: String,
    required: true,
  },
});

// Create a model for your form using the schema
const Form = mongoose.model("Form", formSchema);

module.exports = Form;
