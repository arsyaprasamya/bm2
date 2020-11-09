/**
 *
 * @type {Deposit Schema | Mongoose}
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CashBankSchema = new Schema({
    paidfrom: {
        type : String,
        required : [false, 'paidfrom is required']
    },
    voucherno : 
        {
            type : String,
            required : [false, 'voucherno is required']
        },
    memo : 
        {
            type : String,
            required : [false, 'memo is required']
        },
    payee : 
        {
            type : String,
            required : [false, 'payee is required']
        },
    chequeno : 
        {
            type : String,
            required : [false, 'chequeno is required']
        },
    date : 
        {
            type : Date,
            required : [false, 'date is required']
        },  
    amount : 
        {
            type : Number,
            required : [false, 'amount is required']
        },
    pymnttype: {
        type : String,
        enum : ['AR', 'AP'],
        required : [false, 'pymnttype is required']
    },
    createdBy: {
        type : String,
        required : [false, 'firstnamecs is required']
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
    }
}, {collection: 'cashbank'});

const CashBank = mongoose.model("CashBank", CashBankSchema)
module.exports = {CashBank, CashBankSchema};