const mongoose = require("mongoose");

const assetManagementSchema = mongoose.Schema(
  {
    assetCode: {
      type: String,
      required: [true, "Asset Code is Required"],
    },
    assetType: {
      type: mongoose.Schema.ObjectId,
      ref: "Fixedasset",
      required: [true, "Asset Type is Required"],
    },
    assetName: {
      type: String,
      required: [true, "Asset Name is Required"],
    },
    description: String,
    status: String,
    location: String,
    qty: {
      type: Number,
      required: [true, "Quantity is Required"],
    },
    uom: {
      type: mongoose.Schema.ObjectId,
      ref: "Uom",
      required: [true, "UOM is Required"],
    },
    purchasePrice: {
      type: Number,
      required: [true, "Purchase Price is Required"],
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
    updateBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    updateDate: Date,
  },
  { collection: "assetManagement" }
);

const AssetManagement = mongoose.model(
  "AssetManagement",
  assetManagementSchema
);
module.exports = AssetManagement;
