/**
 *
 * @type {Mainacct Schema | Mongoose}
 */

const mongoose = require("mongoose");

const FiscalFixedAssetSchema = new mongoose.Schema(
  {
    fiscalName: {
      type: String,
      required: [true, "Fiscal Fixed Asset Type Name is required"],
    },
    fiscalDepMethod: {
      type: String,
      required: [true, "Fiscal Depreciation Method is required"],
    },
    fiscalLife: {
      type: Number,
      required: [true, "Fiscal Est Life is required"],
    },
    fiscalDepRate: {
      type: Number,
      required: [false, "Fiscal Depreciation Rate is required"],
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
    updateBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    updateDate: Date,
  },
  { collection: "fiscalasset" }
);

const Fiscalasset = mongoose.model("Fiscalasset", FiscalFixedAssetSchema);
module.exports = Fiscalasset;
