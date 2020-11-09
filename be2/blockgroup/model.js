/**
 *
 * @type {BlockGroup Schema | Mongoose}
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BlockGroupSchema = new Schema({
    grpnm : {
        type : String,
        required : [false, 'grpnm is required']
    },
    crtdate : {
        type : Date,
        default : Date.now
    },
    upddate : {
        type : Date,
        default : Date.now
    }
}, {collection: 'blkbrp'});

const BlockGroup = mongoose.model("BlockGroup", BlockGroupSchema)
module.exports = {BlockGroup, BlockGroupSchema};