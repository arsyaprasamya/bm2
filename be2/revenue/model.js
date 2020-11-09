const mongoose = require("mongoose");

const RevenueSchema = new mongoose.Schema(
  {
    revenueCode:{
      type: String,
      required: [true, "Unit is required"]
    },
    contract: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tenant',
      required: [true, "Unit is required"],
    },

    rate: {
      type: Number,
      required: [true, "Rate is required"],
    },
    revenueRental: {
      type: mongoose.Schema.ObjectId,
      ref: 'revenueRental',
      required: [true, "Revenue Rental is required"]
    },
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
  { collection: "revenue" }
);

const Revenue = mongoose.model("revenue", RevenueSchema);
module.exports = Revenue;