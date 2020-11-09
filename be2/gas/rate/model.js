/**
 *
 * @type {Gas Rate Schema | Mongoose}
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RateGasSchema = new Schema({
    nmrtegas : {
        type: String,
        required : [true, "nmrtegas is required"]
    },
    rte : {
        type: Number,
        required: [true, "rte is required"]
    },
    maintenance: {
        type: Number,
        required: [true, "maintenance is required"]
    },
    administrasi : {
        type: Number,
        required: [true, "administrasi is required"]
    }
}, {collection: 'rtegas'});

const RateGas = mongoose.model("RateGas", RateGasSchema);
module.exports = {RateGas, RateGasSchema};
