const mongoose = require("mongoose");

const assetDepreciationSchema = mongoose.Schema(
  {
    assetManagement: {
      type: mongoose.Schema.ObjectId,
      ref: "AssetManagement",
      required: [true, "Asset Management is Required"],
    },
    aquicitionDate: {
      type: Date,
      required: [true, "Aquicition Date is Required"],
    },
    depMethod: {
      type: String,
      required: [true, "Fiscal Depreciation Method is required"],
    },
    life: {
      type: Number,
      required: [true, "Fiscal Est Life is required"],
    },
    depRate: {
      type: Number,
      required: [true, "Fiscal Depreciation Rate is required"],
    },
    assetAccount: {
      type: mongoose.Schema.ObjectId,
      ref: "Acct",
      required: [false, "Asset Account is Required"],
    },
    expenditures: {
      type: mongoose.Schema.ObjectId,
      ref: "Acct",
      required: [false, "Asset Account is Required"],
    },
    accumulatedDepAcct: {
      type: mongoose.Schema.ObjectId,
      ref: "Acct",
      required: [true, "Asset Account is Required"],
    },
    depreciationExpAcct: {
      type: mongoose.Schema.ObjectId,
      ref: "Acct",
      required: [true, "Depreciation Expense Account is Required"],
    },
    intangibleAsset: Boolean,
    fiscalFixedAsset: Boolean,
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
    updateBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    updateDate: Date,
  },
  { collection: "assetDepreciation" }
);

const AssetDepreciation = mongoose.model(
  "AssetDepreciation",
  assetDepreciationSchema
);
module.exports = AssetDepreciation;
