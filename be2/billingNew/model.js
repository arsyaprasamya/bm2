const mongoose = require("mongoose");

const BillingSchema = new mongoose.Schema(
  {
    billingNumber: {
      type: String,
      required: [false, "billing number is required"],
    },
    contract: {
      type: mongoose.Schema.ObjectId,
      required: [false, "contract id is required"],
    },
    billing: {
      type: Object,
      required: [false, "billing is required"],
    },
    billingDate: {
      type: Date,
      required: [false, "billing date is required"],
    },
    dueDate: {
      type: Date,
      required: [false, "billing due date is required"],
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    transactionNumber: {
      type: String,
    },


    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Created By is required"],
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
  { collection: "billingNew" }
);

const Biling = mongoose.model("BillingNew", BillingSchema);
module.exports = Biling;
