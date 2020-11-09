/**
 *
 * @type {Block Schema | Mongoose}
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const BlockGroup = require("./../blockgroup/model").BlockGroup;

const BlockSchema = new Schema({
    cdblk : {
        type : String,
        required : [false, 'nmblk is required']
    },
    space : {
        type : String,
        required : [false, 'space is required']
    },
    availspace : {
        type : String,
        required : [false, 'availspace is required']
    },
    dtss : {
        type : String,
        required : [false, 'space is required']
    },
    month : {
        type : String,
        required : [false, 'month is required']
    },
    nmblk : {
        type : String,
        required : [false, 'nmblk is required']
    },
    addrblk : {
        type : String,
        required : [false, 'addblk is required'],
        default : "-",
    },
    phnblk : {
        type : String,
        required : [false, 'addblk is required'],
        default : "-",
    },
    grpid : {
        type : Schema.Types.ObjectId,
        required : [false],
        ref : BlockGroup
    },
    grpnm : {
        type : String,
        required : [false, 'grpnm is required']
    },
    rt : {
        type : String,
        required : [false, 'rt is required'],
    },
    rw : {
        type : String,
        required : [false, 'rw is required'],
    },
    crtdate : {
        type : Date,
        default : Date.now
    },
    upddate : {
        type : Date,
        default : Date.now
    }
}, {collection: 'blktbl'});

const Block = mongoose.model("Block", BlockSchema)
module.exports = {Block, BlockSchema};