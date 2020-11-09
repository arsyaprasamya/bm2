
const mongoose = require('mongoose');
const Unit = require('../../contract/owner/model').Ownership;
const VehicleType = require('../../vehicletype/model').VehicleType;
const Tenant = require('../../customer/model').Customer;
const Block = require('../../block/model').Block;
const Schema = mongoose.Schema;

const AddplotSchema = new Schema({
    codeAddParkLot:{
      type: String,
      required: [true, 'Code Addition Parking Lot is Required']
    },
    unit:{
        type : Schema.Types.ObjectId,
        required: [false, 'type is required']
    },
    unitcustomer:{
      type : String,
      required : [false,'unitcustomer']
    },
    customer:{
      type: String,
      required: [false, 'Vehicle Number is Required']
    },
    vehicle:{
      type: Schema.Types.ObjectId,
      required: [false, 'Vehicle is Required'],
      ref: "VehicleType",
    },
    vehicleNum:{
      type: String,
      required: [false, 'Vehicle Number is Required']
    },
    blockPark:{
      type: Schema.Types.ObjectId,
      required: [false, 'Block Parking is Required'],
      ref: "Block",
    },
    space:{
      type: Number,
      required:[false, 'Space Parking is Required']
    },
    status:{
      type: String,
      required:[true, 'Space Parking is Required']
    },
    parkingRate:{
      type: Number,
      required: [true, 'Parking Rate is Required']
    },
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Created By is Required']
    },
    createdDate: {
      type: Date,
      default: Date.now()
    },
    updateBy: String,
    updateDate: Date
}, {collection: 'addplot'});

const Addplot = mongoose.model("Addplot", AddplotSchema);
module.exports = {Addplot, AddplotSchema};