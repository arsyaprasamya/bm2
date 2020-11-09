/**
 *
 * @type {Water Rate Schema | Mongoose}
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RateWaterSchema = new Schema({
    nmrtewtr : {
        type: String,
        required : [true, "nmrtegas is required"]
    },
    rte : {
        type: Number,
        required: [true, "rte is required"]
    },
    pemeliharaan : {
        type: Number,
        required: [true, "pemeliharaan is required"]
    },
    administrasi : {
        type: Number,
        required: [true, "administrasi is required"]
    },
 //   air_kotor : {
 //       type: Number,
 //       required: [true, "rte is required"]
 //   },
}, {collection: 'rtewtr'});

const RateWater = mongoose.model("RateWater", RateWaterSchema);
module.exports = {RateWater, RateWaterSchema};
