/**
 *
 * @type {Unit Schema | Mongoose}
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Floor = require("./../floor/model").Floor;

const UnitSchema = new Schema({
    cdunt : {
        type : String,
        required : [false, 'cdunt is required'],
        default: "-"
    },
    nmunt : {
        type : String,
        required : [false, 'nmunt is required']
    },
    untnum: {
        type: String,
        required: [false, 'untnum is required']
    },
    unttp:{
        type: Schema.Types.ObjectId,
        required: [false, 'unttp is required']
    },
    untrt:{
        type: Schema.Types.ObjectId,
        required: [false, 'untrt is required']
    },
    untsqr: {
        type: Number,
        required: [false, 'untsqr is required']
    },
    untlen: {
        type: Number,
        required: [false, 'untlen is required']
    },
    untwid: {
        type: Number,
        required: [false, 'untwid is required']
    },
    flr: {
        type: Schema.Types.ObjectId,
        required : [false],
        ref: Floor
    },
    rate: {
        type: Number,
        required: [false, 'rate is required']
    },
    srvcrate: {
        type: Number,
        required: [false, 'srvcrate is required']
    },
    sinkingfund: {
        type: Number,
        required: [false, 'sinkingfund is required'],
        default: 0,
    },
    ovstyrate: {
        type: Number,
        required: [false, 'ovstyrate is required']
    },
    price : {
        type : Number,
        required: [false, 'price is required']
    },
    rentalPrice : {
        type : Number,
        required : [false, 'rentPrice is required']
    },


}, {collection: 'tblmunit'});

const Unit = mongoose.model("Unit", UnitSchema);
module.exports = {Unit, UnitSchema};

