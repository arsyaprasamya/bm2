/**
 *
 * @type {Trasaksi Water Schema | Mongoose}
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Water = require("./../master/model").Water;

const TransaksiWaterSchema = new Schema({
    wat : {
        type: Schema.Types.ObjectId,
        required : [false, "water is required"],
        ref: Water
    },
    dwres : {
        type : String,
        required: [false, "strtpos is required"],
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
        required: [true, "paid status is required"],
        default: false
    },
    air_kotor : {
        type: Number,
        required: [false, "air_kotor is required"]
    },
    watname : {
        type :String,
        required : [false, "watername is requierd"],
    },
    checker : {
        type: Boolean,
        default : false
    },
    cratedDate : {
        type: Date,
        default: Date.now()
    }
}, {collection: 'trwtr'});

const TransaksiWater = mongoose.model("TransaksiWater", TransaksiWaterSchema);
module.exports = {TransaksiWater, TransaksiWaterSchema};