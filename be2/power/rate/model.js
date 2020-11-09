/**
 *
 * @type {Power Rate Schema | Mongoose}
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RatePowerSchema = new Schema({
    nmrtepow : {
        type: String,
        required : [true, "nmrtegas is required"]
    },
    rte : {
        type: Number,
        required: [true, "rte is required"]
    },
    ppju : {
        type: Number,
        required: [true, "ppju is required"]
    },
    srvc : {
        type: Number,
        required: [true, "srvc is required"]
    }
}, {collection: 'rtepow'});

const RatePower = mongoose.model("RatePower", RatePowerSchema);
module.exports = {RatePower, RatePowerSchema};
