/**
 *
 * @type {Trasaksi Gas Schema | Mongoose}
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Gas = require("./../master/model").Gas;

const TransaksiGasSchema = new Schema({
    gas : {
        type: Schema.Types.ObjectId,
        required : [true, "gas is required"],
        ref: Gas
    },
    strtpos : {
        type : Number,
        required: [true, "strtpos is required"],
    },
    endpos : {
        type: Number,
        required: [true, "endpos is required"]
    },
    billmnt : {
        type: Date,
        required: [false, "billmnt is required"]
    },
    billamnt:{
        type: Number,
        required: [false, "billamnt is required"]
    },
    isPaid: {
        type: Boolean,
        required: [true, "paid status is required"],
        default: false
    },
    checker : {
        type: Boolean,
        default : false
    },
    cratedDate : {
        type: Date,
        default: Date.now()
    }

}, {collection: 'trgas'});

const TransaksiGas = mongoose.model("TransaksiGas", TransaksiGasSchema);
module.exports = {TransaksiGas, TransaksiGasSchema};