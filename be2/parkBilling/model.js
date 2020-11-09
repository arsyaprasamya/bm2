
const mongoose = require('mongoose');
const Schema  = mongoose.Schema


const ParkBillingSchema = new Schema({
    billingNo: {
        type: String,
        required: [true, "billing number is required"],
    },
    parking : {
      type: mongoose.Schema.ObjectId,
      ref: "Addplot",
      required : [false, "Bank is required"]
    },
    parkingFee:{
        type: Number,
        required: [false, "parking fee"]
    },
    isNEW: {
        type: Boolean,
        required: [false, "isPKP is required"],
        default: false,
    },
    notes: {
        type: String,
        required: [false, "billing number is required"],
    },
    createdDate: {
        type: Date,
        required: [false, "created date is required"]
    },
    billingDate: {
        type: Date,
        required: [false]
    },
    dueDate:{
        type: Date,
        required: [false]
    },
    isApproved:{
        type: Boolean,
        required: [false, "approved is required"],
        default: false
    },
    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [false, 'Created By is Required']
      },
}, {collection: 'parkbilling'});

const ParkBilling =  mongoose.model("ParkBilling", ParkBillingSchema);
module.exports = {ParkBilling, ParkBillingSchema};




