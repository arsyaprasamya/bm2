/**
 *
 * @type {Ownership Contract Schema | Mongoose}
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Unit = require('../../unit/model').Unit;

const OwnershipSchema = new Schema({
    cstmr : {
        type: Schema.Types.ObjectId,
        required: [false, "cstmrid is required"],
        ref: "Customer"
    },
    contract_number: {
        type: String,
        required: [false, "cstmrid is required"],
    },
    contract_date: {
        type: Date,
        required: [false, "cstmrid is required"],
    },
    expiry_date: {
        type: Date,
        required: [false, "cstmrid is required"],
    },
    asset: [
        {
            type: Object
        }
    ],
    contact_name : {
        type: String,
        required: [false, "contact_name is required"]
    },
    contact_address : {
        type: String,
        required: [false, "contact_address is required"]
    },
    contact_phone : {
        type: String,
        required: [false, "contact_phone is required"]
    },
    contact_email : {
        type: String,
        required: [false, "contact_phone is required"]
    },
    contact_city : {
        type: String,
        required: [false, "contact_city is required"]
    },
    contact_zip : {
        type: String,
        required: [false, "contact_zip is required"]
    },
    unit: {
        type: Schema.Types.ObjectId,
        required: [false, "unit is required"],
        ref: Unit
    },
    paymentType: { //daily, montly, yearly, lumpsump
        type: String,
        required: [false, "paymentType is required"]
    },
    paymentTerm: { //number
        type: Number,
        required: [false, "paymentType is required"]
    },
    start_electricity_stand: {
        type: Number,
        required: [false, "start_electricity_stand is required"]
    },
    start_water_stand: {
        type: Number,
        required: [false, "start_water_stand is required"]
    },
    virtualAccount: {
        type: String,
        required: [false, "virtualAccount is required"]
    },
    isPKP: {
        type: Boolean,
        required: [false, "isPKP is required"],
        default: false,
    },
    tax_id:{
        type: String,
        required: [false, 'tax id is required'],
    },
    ktp : {
        type: String,
        required: [false, 'tax id is required'],
    },
    npwp : {
        type: String,
        required: [false, 'tax id is required'], 
    },
}, {collection: 'ownershipContract'});

const Ownership =  mongoose.model("Ownership", OwnershipSchema);
module.exports = {Ownership, OwnershipSchema};