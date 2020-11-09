/**
 *
 * @type {revenue Schema | Mongoose}
 */

const mongoose = require("mongoose");

const RevenueSchema = new mongoose.Schema(
  {
    revenueName: {
      type: String,
      required: [true, "Rate Name is required"],
    },
    serviceFee: {
      type: Number,
      required: [true, "Rate is required"],
    },
    administration: {
      type: Number,
      required: [true, "Periode is required"],
    },
    remarks: String,
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Created By is Required"],
    },
    createdDate: {
      type: Date,
      default: Date.now(),
    },
    updatedBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User"
    },
    updatedDate: Date
  },
  { collection: "revenueRental" }
);

const RevenueRental = mongoose.model("revenueRental", RevenueSchema);
module.exports = RevenueRental;
