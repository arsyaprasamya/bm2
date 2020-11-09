/**
 *
 * @type {Floor Schema | Mongoose}
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Block = require("./../block/model").Block;

const FloorSchema = new Schema({
    cdflr : {
        type: String,
        required: [true, 'cdflr is required']
    },
    nmflr : {
        type : String,
        required : [true, 'nmflr is required']
    },

    blk : {
        type : Schema.Types.ObjectId,
        required : [false],
        ref : Block
    },
    crtdate : {
        type : Date,
        default : Date.now
    },
    upddate : {
        type : Date,
        default : Date.now
    },

}, {collection: 'flrtbl'});

const Floor = mongoose.model("Floor", FloorSchema);
module.exports = {Floor, FloorSchema};