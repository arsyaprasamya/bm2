const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Unit = require("../unit/model").Unit;
const Block = require('../block/model').Block;
const VehicleType = require("../vehicletype/model").VehicleType;


const ParkingLotSchema = new Schema({
    nmplot: {
        type: String,
        required : [false, "nmplot is required"]
    },
    vehnum: {
        type: String,
        required : [true, "Vehicle number is required"]
    },
    vehicle:
    {
        type : Schema.Types.ObjectId,
        required : [true, "Vehicle is required"],
        ref : VehicleType
    },
    space:
    {
        type : String,
        required:[true, "Space is required"]
    },
    unit:
    {
        type : Schema.Types.ObjectId,
        required : [true, "Unit is required"],
        ref : Unit
    },
    block:
    {
        type: Schema.Types.ObjectId,
        required : [true, "Block is required"],
        ref : Block
    },
    createdBy:
    {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [false, "Created By is required"]
    },
    createdDate: {
        type: Date,
        default: Date.now()
    },
    updateBy: String,
    updateDate: Date
}, {collection: 'tmplot'});

const ParkingLot = mongoose.model("ParkingLot", ParkingLotSchema);
module.exports = {ParkingLot, ParkingLotSchema};