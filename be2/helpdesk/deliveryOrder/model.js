const mongoose = require("mongoose");

const doSchema = new mongoose.Schema(
  {
    doId: {
      type: String,
      required: [true, "DO Id is Required"],
    },
    ticket: {
      type: mongoose.Schema.ObjectId,
      ref: "ticket",
      required: [true, "Ticket Id is Required"],
    },
    attachment: [String],
    description: String,
    status: {
      type: String,
      required: [true, "DO status is required"],
    },
    status: {
      type: String, //scheduled
      required: [true, "DO status is required"],
    },
    engineerId: {
      type: mongoose.Schema.ObjectId,
      required: [false, "Engineer Id is required"],
      ref: "engineer",
    },
    fixedDate: Date,
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    createdDate: {
      type: Date,
      default: Date.now(),
    },
    updatedBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    updatedDate: Date,
  },
  { collection: "deliveryOrder" }
);

const Do = mongoose.model("deliveryOrder", doSchema);
module.exports = Do;
