const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const InvoiceSchema = new Schema({
    invoiceno: {
        type : String,
        required : [false, 'receiveno is required']
    },
    custname :
        {
            type : String,
            required : [false, 'receiveno is required']
        },
    unit : {
            type : String,
            required : [false, 'unit']
    },
    unittype : {
        type : String,
        required : [false, 'unittype required']
    },
    address : {
        type : String,
        required : [false, 'address']
    },
    contract : 
        {
            type : Schema.Types.ObjectId
        },
    desc : {
            type : String,
            required : [false, 'desc is required']
    },
    invoicedte: {
        type : Date,
        required : [false, 'invoicedte is required']
    },
    invoicedteout: {
        type : Date,
        required : [false, 'invoicedteout is required']
    },
    total: {
        type : Number,
        required : [false, 'total is required']
    },
    admin :{
        type : Number,
        required : [false, 'total is required']
    },
    amount : {
        type : Number,
        required : [false, 'amount']
    },
    deposittype : {
        type : String,
        required : [false, 'type']
    },
    typerate : {
        type : String,
        required : [false, 'type']
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
    isclosed : {
        type : Boolean,
        required: [false],
        default : false
    }
}, {collection: 'invoice'});

const Invoice = mongoose.model("Invoice", InvoiceSchema)
module.exports = {Invoice, InvoiceSchema};