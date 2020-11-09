/**
 *
 * Rate gas database services
 */

const RatePower = require('./model').RatePower;

module.exports = {
    addRatePower : async function(ratepower){
        try {
            const newRatepower = await new RatePower(ratepower).save();
            if(newRatepower){
                return newRatepower
            }else{
                return false;
            }
        }catch (e) {
            console.log(e)
        }
    },
    listRatePower : async function(query, page = 1, limit = 10000){
        try {
            const skip = (page - 1) * limit;
            let ratePower;
            if(Object.keys(query).length === 0) {
                ratePower = await RatePower.find({}).skip(skip).limit(limit).sort({$natural:-1});
            }else{
                ratePower = await RatePower.find().or([
                    { 'nmrtepow': { $regex: `${query.nmrtepow}` }}
                ])
                .skip(skip)
                .limit(limit)
                .sort({$natural:-1});
            }
            if(ratePower){
                return ratePower;
            }else{
                return false;
            }
        }catch (e) {
            console.log(e)
        }
    },
    findRatePowerById : async function(id){
        try {
            const ratePower = await RatePower.findById(id);
            if(ratePower){
                return ratePower;
            }else{
                return false;
            }
        }catch (e) {
            console.log(e)
        }
    },
    updateRatePower : async function(id, ratepower){

        try {
            const ratePower = await RatePower.findByIdAndUpdate(id, ratepower);
            if(ratePower){
                return ratePower;
            }else{
                return false;
            }
        }catch (e) {
            console.log(e)
        }
    },
    deleteRatePower : async function(id){
        try {
            const ratePower = await RatePower.findByIdAndRemove(id);
            if(ratePower){
                return ratePower;
            }else{
                return false;
            }
        }catch (e) {
            console.log(e)
        }
    },
}
