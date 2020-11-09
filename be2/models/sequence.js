const mongoose = require("mongoose");

const SequenceSchema = new mongoose.Schema(
  {
    menu: {
      type: String,
      required: [true, "Sequence Name is required"],
    },
    sequence: {
      type: Number,
      default: 1,
    },
    year: Number
  },
  { collection: "sequence" }
);

const Sequence = mongoose.model("Sequence", SequenceSchema);
module.exports = Sequence;
