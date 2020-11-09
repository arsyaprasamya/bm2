/**
 *
 * @type {Gas Schema | Mongoose}
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Unit = require("../../unit/model").Unit;
const RateGas = require("../rate/model").RateGas;

const GasSchema = new Schema({
    nmmtr : {
        type: String,
        required : [true, "nmmtr is required"]
    },
    unt : {
        type : Schema.Types.ObjectId,
        required: [false],
        ref: Unit
    },
    rte : {
        type: Schema.Types.ObjectId,
        required: [true, "rte is required"],
        ref: RateGas
    }
}, {collection: 'tmgas'});

const Gas = mongoose.model("Gas", GasSchema);
module.exports = {Gas, GasSchema};

