/**
 *
 * @type {Deposit Schema | Mongoose}
 */

const mongoose = require('mongoose');
const { Tenant } = require('../contract/tenant/model');
const Schema = mongoose.Schema;
const Customer = require("../customer/model").Customer;
const Unit = require("../unit/model").Unit;
const Ownership = require('../contract/owner/model').Ownership;

const DepositSchema = new Schema({
    depositno: {
        type : String,
        required : [false, 'receiveno is required']
    },
    depositnoout: {
        type : String,
        required : [false, 'receiveno is required']
    },
    invoice : {
        type: Schema.Types.ObjectId,
        required : [false, "Bank is required"],
        ref: "Invoice"
      },
    type :{
        type: String,
        required : [false, 'type']
    },
    descin : {
            type : String,
            required : [false, 'desc is required']
    },
    descout : {
        type : String,
        required : [false, 'descout is required']
    },
    depositInDate: {
        type : Date,
        required : [false, 'invoicedte is required']
    },
    depositOutDate: {
        type : Date,
        required : [false, 'invoicedteout is required']
    },
    pymnttype: {
        type : String,
        enum : ['Cash', 'Cek/Giro', 'Transfer', 'Debit Card', 'Kredit Card'],
        required : [false, 'pymnttype is required']
    },
    isactive : {
        type : Boolean,
        required : [false, 'pymnttype is required'],
        default : false
    },
    total: {
        type : Number,
        required : [false, 'total is required']
    },
    dpstin: {
        type : Number,
        required : [false, 'dpstin is required']
    },
    dpstout: {
        type : Number,
        required : [false, 'dpstout is required']
    },
    crtdate : {
        type : Date,
        required: [false, 'crtdate is required'],
        default : Date.now  
    },
    upddate : {
        type : Date,
        required: [false],
        default : Date.now
    },
}, {collection: 'deposit'});

const Deposit = mongoose.model("Deposit", DepositSchema)
module.exports = {Deposit, DepositSchema};