

const mongoose = require('mongoose');
const Schema = mongoose.Schema

const LeaseBillingSchema = new Schema({
    billingNo: {
        type: String,
        required: [true, "billing number is required"],
    },
    lease : {
      type: Schema.Types.ObjectId,
      required : [false, "Bank is required"],
      ref: "Tenant"
    },
    price:{
        type : Number,
        required : [true, "need price"]
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
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [false, 'Created By is Required']
      },
}, {collection: 'leasebilling'});

const LeaseBilling =  mongoose.model("LeaseBilling", LeaseBillingSchema);
module.exports = {LeaseBilling, LeaseBillingSchema};




