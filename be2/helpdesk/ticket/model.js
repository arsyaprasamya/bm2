const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema(
  {
    ticketId: {
      //id tiket
      type: String,
      required: [true, "ID is required"],
    },
    subject: {
      //subject
      type: String,
      required: [true, "Subject is required"],
    },
    contract: {
      type: mongoose.Schema.ObjectId,
      ref: "Tenant",
      required: [true, "Contract is required"],
    },
    subDefect: {
      //subdefect (category, defect, subdefect)
      type: mongoose.Schema.ObjectId,
      ref: "SubDefect",
      required: [true, "subDefect is required"],
    },
    description: String,
    dateScheduled: Date,
    dateList: [Date],
    rescheduleDate: Date,
    priority: String,
    attachment: [String],
    reason: String,
    status: String,
    engineerId: {
      type: mongoose.Schema.ObjectId,
      ref: "Engineer",
    },
    rating: {
      type: Number,
      enum: [1, 2, 3, 4, 5],
    },
    feedback: String,
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
  { collection: "ticket" }
);

const Ticket = mongoose.model("ticket", ticketSchema);
module.exports = Ticket;
