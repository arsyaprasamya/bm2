/**
 *
 * Parking lot database services
 */
const ParkingLot = require('./model').ParkingLot;
const Block = require('../block/model').Block;
const errorHandler = require('../controllers/errorController');

module.exports = {
    listParkingLot : async function(query, page = 1, limit = 1000){
        try {
            const skip = (page - 1) * limit;
            let parkinglot;
            if(Object.keys(query).length === 0) {
                parkinglot = await ParkingLot.find({}).skip(skip).limit(limit).sort({$natural:-1});
            }else{
                parkinglot = await ParkingLot.find().or([
                    { 'space': { $regex: `${query.space}` }}
                ])
                .skip(skip)
                .limit(limit)
                .select("-__v")
                .populate("vehicle", "-__v")
                .populate("unit", "-__v")
                .populate("block", "-__v")
                .sort({$natural:-1});
            }

            if(parkinglot){
                return parkinglot;
            }else{
                return false;
            }
        }catch (e) {
            errorHandler(e);
        }
    },
    findParkingLot : async function(id){
        try {
            const parkinglot = await ParkingLot.findById(id);
            if(parkinglot){
                return parkinglot;
            }else{
                return false
            }
        }catch (e) {
            errorHandler(e);
        }
    },
    addParkingLot : async function(data){
        try {
            data.createdBy = '5f3a09e95f56d23d1c9c31a2';
            const parkinglot = await new ParkingLot(data).save();
            if(parkinglot){
                const block = await Block.findOneAndUpdate( {_id : data.block}, 
                    {$set: {availspace: data.avaliablespace}});
                if(block){
                    return parkinglot;
                }
                return false;
            }else{
                return false;
            }
        }catch (e) {
            errorHandler(e);
        }
    },
    editParkingLot : async function(id, parkingLot){
        try {
            const parkinglot = await ParkingLot.findByIdAndUpdate(id, parkingLot);
            if(parkinglot){
                return parkinglot;
            }else{
                return false;
            }
        }catch (e) {
            console.log(e);
        }
    },
    deleteParkingLot : async function(id){
        try {
            const parkinglot = await ParkingLot.findByIdAndDelete(id);
            if(parkinglot){
                return parkinglot;
            }else{
                return false;
            }
        }catch (e) {
            console.log(e);
        }
    }
}