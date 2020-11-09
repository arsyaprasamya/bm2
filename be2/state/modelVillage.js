/**
 *
 * @type {Village Schema | Mongoose}
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VillageSchema = new Schema({
    code: {
        type: String,
        required : [true, "code is required"],
    },
    district_code: {
        type: String,
        required : [true, "district_code is required"],
    },
    name: {
        type: String,
        required : [true, "name is required"]
    },
}, {collection: 'village'});

VillageSchema.set('toObject', { virtuals: true });
VillageSchema.set('toJSON', { virtuals: true });

VillageSchema.virtual('district', {
    ref: 'District',
    localField: 'district_code',
    foreignField: 'code',
    justOne: true
});

const Village = mongoose.model("Village", VillageSchema);
module.exports = {Village, VillageSchema};

