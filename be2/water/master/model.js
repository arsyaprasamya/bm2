/**
 *
 * @type {Gas Schema | Mongoose}
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Unit = require("../../unit/model").Unit;
const RateWater = require("../rate/model").RateWater;

const WaterSchema = new Schema({
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
        ref: RateWater
    }
}, {collection: 'tmwtr'});

const Water = mongoose.model("Water", WaterSchema);
module.exports = {Water, WaterSchema};

