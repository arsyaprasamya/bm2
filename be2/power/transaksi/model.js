/**
 *
 * @type {Trasaksi Power Schema | Mongoose}
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Power = require("./../master/model").Power;

const TransaksiPowerSchema = new Schema({
    pow : {
        type: Schema.Types.ObjectId,
        required : [false, "contract is required"],
        ref: Power
    },
    strtpos : {
        type : Number,
        required: [false, "strtpos is required"],
    },
    endpos : {
        type: Number,
        required: [false, "endpos is required"]
    },
    strtpos2 : {
        type : Number,
        required: [false, "strtpos is required"],
    },
    endpos2 : {
        type: Number,
        required: [false, "endpos is required"]
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
        default: false
    },
    loss : {
        type: Number,
        required: [false, "loss is required"]
    },
    lossres : {
        type : String,
        required: [false, "strtpos is required"],
    },
    powname : {
        type : String,
        required :[ false, "powname"],
    },
    checker : {
        type : Boolean,
        default : false
    },
    cratedDate : {
        type: Date,
        default: Date.now()
    }

}, {collection: 'trpow'});

const TransaksiPower = mongoose.model("TransaksiPower", TransaksiPowerSchema);
module.exports = {TransaksiPower, TransaksiPowerSchema};