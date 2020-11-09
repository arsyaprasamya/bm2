/**
 *
 * Floor Database Service
 */

const Floor = require('./model').Floor;

module.exports = {
    listFloor: async function(query, page=1, limit=1000){
        try { 
            var skip = (page - 1) * limit;
            let floor;
            if(Object.keys(query).length === 0){
                floor = await Floor.find(query).skip(skip).limit(limit).populate({
                    path: "blk",
                    model: "Block",
                    select: "-__v",
                    populate: {
                        path: "grpid",
                        model: "BlockGroup",
                        select: "-__v",
                    }
                }).select("-__v").sort({$natural:-1});
            }else{
                floor = await Floor.find().or([{ 'cdflr': { $regex: `${query.cdflr}` }}, { 'nmflr': { $regex: `${query.cdflr}` }}]).skip(skip).limit(limit).populate({
                    path: "blk",
                    model: "Block",
                    select: "-__v",
                    populate: {
                        path: "grpid",
                        model: "BlockGroup",
                        select: "-__v",
                    }
                }).select("-__v").sort({$natural:-1});
            }
            if(floor){
                return floor;
            }else{
                return false
            }
        }catch (e) {
            console.log(e);
        }
    },
    findFloorById: async function(id){
        try {
            const floor = await Floor.findById(id).populate("building", "-__v").select("-__v");
            if(floor){
                return floor;
            }else {
                return false;
            }
        }catch (e) {
            console.log(e);
        }
    },
    getFloorByParentId: async function(id){
        try {
            const floor = await Floor.find({blk: id}).populate("building", "-__v").select("-__v");
            if(floor){
                return floor;
            }else {
                return false;
            }
        }catch (e) {
            console.log(e);
        }
    },
    addFloor: async function(floor){
        try {
            const newFloor = await new Floor(floor).save();
            if(newFloor){
                return newFloor;
            }else{
                return false;
            }
        }catch (e) {
            console.log(e);
        }
    },
    updateFloor: async function(floor, id){
        try {
            const updateFloor = await Floor.findByIdAndUpdate(id, floor);
            if(updateFloor){
                return updateFloor
            }else{
                return false;
            }
        }catch (e) {
            console.log(e);
        }
    },
    deleteFloor: async function(id){
        try {
            const floor = await Floor.findByIdAndRemove(id);
            if(floor){
                return floor;
            }else {
                return false;
            }
        }catch (e) {
            console.log(e);
        }
    }
}