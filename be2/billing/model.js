const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BillingSchema = new Schema({
    billing_number: {
        type: String,
        required: [true, "billing number is required"],
    },
    unit: {
        type : Schema.Types.ObjectId,
        required: [true, "unit id is required"],
    },
    billing: {
        type: Object,
        required: [true, "billing is required"],
    },
    unit2:{
        type : String,
        required: [false, "unit"]
    },
    billed_to:{
        type: String,
        required: [true, "customer id is required"],
    },
    
    pinaltyDateWater:{
        type: Number,
        required: [false, "pinaltyDate"]
    },
    pinaltyDateElectricity:{
        type: Number,
        required: [false, "pinaltyDate"]
    },
    pinaltyDateIpl:{
        type: Number,
        required: [false, "pinaltyDate"]
    },


    created_date: {
        type: Date,
        required: [true, "created date is required"]
    },
    billing_date: {
        type: Date,
        required: [false]
    },
    due_date:{
        type: Date,
        required: [false]
    },
    isApproved:{
        type: Boolean,
        required: [true, "approved is required"],
        default: false
    }
}, {collection: 'billing'});

const Billing =  mongoose.model("Billing", BillingSchema);
module.exports = {Billing, BillingSchema};