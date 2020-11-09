/**
 *
 * @type {District Schema | Mongoose}
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DistrictSchema = new Schema({
    code: {
        type: String,
        required : [true, "code is required"],
    },
    regency_code: {
        type: String,
        required : [true, "regency_code is required"],
    },
    name: {
        type: String,
        required : [true, "name is required"]
    },
}, {collection: 'district'});
DistrictSchema.set('toObject', { virtuals: true });
DistrictSchema.set('toJSON', { virtuals: true });
DistrictSchema.virtual('regency', {
    ref: 'Regency',
    localField: 'regency_code',
    foreignField: 'code',
    justOne: true
});

const District = mongoose.model("District", DistrictSchema);
module.exports = {District, DistrictSchema};

