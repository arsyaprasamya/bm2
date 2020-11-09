/**
 *
 * @type {Province Schema | Mongoose}
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProvinceSchema = new Schema({
    code: {
        type: String,
        required : [true, "code is required"],
    },
    name: {
        type: String,
        required : [true, "name is required"]
    },
}, {collection: 'province'});
ProvinceSchema.set('toObject', { virtuals: true });
ProvinceSchema.set('toJSON', { virtuals: true });

const Province = mongoose.model("Province", ProvinceSchema);
module.exports = {Province, ProvinceSchema};

