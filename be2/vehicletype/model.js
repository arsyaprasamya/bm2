/**
 *
 * @type {Vehicle Schema | Mongoose}
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VehicleTypeSchema = new Schema({
    nmvhtp: {
        type: String,
        required : [true, "nmvhtp is required"]
    },
    vhttype: {
        type: String,
        required : [false, "vhttype is required"]
    },
    vhtprate: {
        type: Number,
        required : [true, "vhtprate is required"]
    }
}, {collection: 'tmvhtp'});

const VehicleType = mongoose.model("VehicleType", VehicleTypeSchema);
module.exports = {VehicleType, VehicleTypeSchema};