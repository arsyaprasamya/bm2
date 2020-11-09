/**
 *
 * @type {Regency Schema | Mongoose}
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RegencySchema = new Schema({
    code: {
        type: String,
        required : [true, "code is required"],
    },
    province_code: {
        type: String,
        required : [true, "province_code is required"],
    },
    name: {
        type: String,
        required : [true, "name is required"]
    },
}, {collection: 'regency'});
RegencySchema.set('toObject', { virtuals: true });
RegencySchema.set('toJSON', { virtuals: true });
RegencySchema.virtual('province', {
    ref: 'Province',
    localField: 'province_code',
    foreignField: 'code',
    justOne: true
});

const Regency = mongoose.model("Regency", RegencySchema);
module.exports = {Regency, RegencySchema};

