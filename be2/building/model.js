/**
 *
 * @type {Building Schema | Mongoose}
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Block = require("./../block/model").Block;

const BuildingSchema = new Schema({

    nmbld : {
        type : String,
        required : [true, 'nmbld is required']
    },
    addrbld : {
        type : String,
        required : [true, 'addrbld is required']
    },
    blk : {
        type : Schema.Types.ObjectId,
        required : [true],
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

}, {collection: 'bldtbl'});

const Building = mongoose.model("Building", BuildingSchema);
module.exports = {Building, BuildingSchema};