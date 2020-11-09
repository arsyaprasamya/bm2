/**
 *
 * @type {Province Schema | Mongoose}
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const KodePosSchema = new Schema({
    kelurahan: {
        type: String,
        required : [true, "kelurahan is required"],
    },
    kecamatan: {
        type: String,
        required : [true, "kecamatan is required"]
    },
    kabupaten: {
        type: String,
        required : [true, "kabupaten is required"]
    },
    provinsi: {
        type: String,
        required : [true, "provinsi is required"]
    },
    kodepos: {
        type: String,
        required : [true, "kodepos is required"]
    },
}, {collection: 'kodepos'});

const KodePos = mongoose.model("KodePos", KodePosSchema);
module.exports = {KodePos, KodePosSchema};

