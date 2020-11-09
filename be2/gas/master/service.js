/**
 *
 * Master gas database services
 */

const Gas = require('./model').Gas;

module.exports = {
    addGas : async function(gas){
        try {
            const newGas = await new Gas(gas).save();
            if(newGas){
                return newGas;
            }else {
                return false;
            }
        }catch (e) {
            console.log(e);
        }
    },
    
    listGas : async function(query, page = 1, limit = 1000){
        try {
            const skip = (page - 1)*limit;
            let gas;
            if(Object.keys(query).length === 0){
            gas = await Gas.find()
            .skip(skip)
            .limit(limit)
            .populate({
                path: 'unt',
                model: 'Unit',
                select: '-__v',
                populate: {
                    path: "flr",
                    model: "Floor",
                    select: "-__v",
                    populate: {
                        path: "blk",
                        model: "Block",
                        select: "-__v",
                        populate: {
                            path: "grpid",
                            model: "BlockGroup",
                            select: "-__v",
                        }
                    }
                }
            }).populate('rte', '-__v').select('-__v').sort({$natural:-1});
        }else{            
            gas = await Gas.find().or([
                { 'nmmtr': { $regex: `${query.nmmtr}` }}]).skip(skip).limit(limit).populate({
                path: 'unt',
                model: 'Unit',
                select: '-__v',
                populate: {
                    path: "flr",
                    model: "Floor",
                    select: "-__v",
                    populate: {
                        path: "blk",
                        model: "Block",
                        select: "-__v",
                        populate: {
                            path: "grpid",
                            model: "BlockGroup",
                            select: "-__v",
                        }
                    }
                }
            }).populate('rte', '-__v').select('-__v').sort({$natural:-1});
        }
            if(gas){
                return gas;
            }else{
                return false;
            }
        }catch (e) {
            console.log(e);
        }
    },
    findGasById : async function(id){
        try {
            const gas = await Gas.findById(id).populate("rte", "-__v").populate("unt", "-__v");
            if(gas){
                return gas;
            }else{
                return false;
            }
        }catch (e) {
            console.log(e);
        }
    },
    updateGas : async function(id, gas){
        try {
            const updateGas = await Gas.findByIdAndUpdate(id,gas);
            if(updateGas){
                return updateGas;
            }else{
                return false;
            }
        }catch (e) {
            console.log(e);
        }
    },
    deleteGas : async function(id){
        try {
            const gas = await Gas.findByIdAndRemove(id);
            if(gas){
                return gas;
            }else{
                return false;
            }
        }catch (e) {
            console.log(e);
        }
    },

}