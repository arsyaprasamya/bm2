/**
 *
 * Rate gas database services
 */

const RateWater = require('./model').RateWater;

module.exports = {
    addRateWater : async function(ratewater){
        try {
            const newRatewater = await new RateWater(ratewater).save();
            if(newRatewater){
                return newRatewater
            }else{
                return false;
            }
        }catch (e) {
            console.log(e)
        }
    },
    listRateWater : async function(query, page = 1, limit = 10){
        try {
            const skip = (page - 1) * limit;
            let rateWater;
            if(Object.keys(query).length === 0) {
                rateWater = await RateWater.find({}).skip(skip).limit(limit).sort({$natural:-1});
            }else{
                rateWater = await RateWater.find().or([
                    { 'nmrtewtr': { $regex: `${query.nmrtewtr}` }}
                ])
                .skip(skip)
                .limit(limit)
                .sort({$natural:-1});
            }
            if(rateWater){
                return rateWater;
            }else{
                return false;
            }
        }catch (e) {
            console.log(e)
        }
    },
    findRateWaterById : async function(id){
        try {
            const rateWater = await RateWater.findById(id);
            if(rateWater){
                return rateWater;
            }else{
                return false;
            }
        }catch (e) {
            console.log(e)
        }
    },
    updateRateWater : async function(id, ratewater){
        try {
            const rateWater = await RateWater.findByIdAndUpdate(id, ratewater);
            if(rateWater){
                return rateWater;
            }else{
                return false;
            }
        }catch (e) {
            console.log(e)
        }
    },
    deleteRateWater : async function(id){
        try {
            const rateWater = await RateWater.findByIdAndRemove(id);
            if(rateWater){
                return rateWater;
            }else{
                return false;
            }
        }catch (e) {
            console.log(e)
        }
    },
}
