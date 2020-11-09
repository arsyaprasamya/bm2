/**
 *
 * Master gas database services
 */

const {listUnit} = require("../../unit/service");

const Water = require('./model').Water;

module.exports = {
    addWater : async function(water){
        try {
            const newWater = await new Water(water).save();
            if(newWater){
                return newWater;
            }else {
                return false;
            }
        }catch (e) {
            console.log(e);
        }
    },


    listWater : async function(query, page = 1, limit = 1000){
        try {
            const skip = (page - 1)*limit;
            let water;
            if(Object.keys(query).length === 0 ){
            water = await Water.find()
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
                        },
                    },
                },
            })
            .populate('rte', '-__v')
            .select('-__v')
            .sort({$natural:-1});
        }else{
            water = await Water.find()
                .or([
                    { 'nmmtr': { $regex: `${query.nmmtr}` }}
                ])
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
                            },
                        },
                    },
                
            })
            .populate('rte', '-__v')
            .select('-__v')
            .sort({$natural:-1});
        }
            if(water){
                return water;
            }else{
                return false;
            }
        }catch (e) {
            console.log(e);
        }
    },
    findWaterById : async function(id){
        try {
            const water = await Water.findById(id).populate("rte", "-__v").populate("unt", "-__v");
            if(water){
                return water;
            }else{
                return false;
            }
        }catch (e) {
            console.log(e);
        }
    },
    updateWater : async function(id, water){
        try {
            const updateWater = await Water.findByIdAndUpdate(id,water);
            if(updateWater){
                return updateWater;
            }else{
                return false;
            }
        }catch (e) {
            console.log(e);
        }
    },
    deleteWater : async function(id){
        try {
            const water = await Water.findByIdAndRemove(id);
            if(water){
                return water;
            }else{
                return false;
            }
        }catch (e) {
            console.log(e);
        }
    },

}