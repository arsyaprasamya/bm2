/**
 *
 * @type {Gas Schema | Mongoose}
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Unit = require("../../unit/model").Unit;
const RatePower = require("../rate/model").RatePower;

const PowerSchema = new Schema({
    code : {
        type: String,
        required: [false, "code is required"]
    },
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
        ref: RatePower
    },
    ppju : {
        type: Number,
        required: [false, "ppju is required"]
    },
    srvc : {
        type: Number,
        required: [false, "ppju is required"]
    },
}, {collection: 'tmpow'});

const Power = mongoose.model("Power", PowerSchema);
module.exports = {Power, PowerSchema};

