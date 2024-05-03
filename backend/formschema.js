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
  },
  procedimento: {
    type: String,
    required: true,
  },
  moneyAmount: {
    type: String,
    required: true,
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Form = mongoose.model("Form", formSchema);
module.exports = Form;
