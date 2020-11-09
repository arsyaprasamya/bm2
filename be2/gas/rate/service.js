/**
 *
 * Rate gas database services
 */

const RateGas = require('./model').RateGas;

module.exports = {
    addRateGas : async function(rategas){
        try {
            const newRategas = await new RateGas(rategas).save();
            if(newRategas){
                return newRategas
            }else{
                return false;
            }
        }catch (e) {
            console.log(e)
        }
    },
    listRateGas : async function(query, page = 1, limit = 10000){
        try {
            const skip = (page - 1) * limit;
            let rateGas;
            if(Object.keys(query).length === 0) {
                rateGas = await RateGas.find({}).skip(skip).limit(limit).sort({$natural:-1});
            }else{
                rateGas = await RateGas.find().or([
                    { 'nmrtegas': { $regex: `${query.nmrtegas}` }},
                ])
                .skip(skip)
                .limit(limit)
                .sort({$natural:-1});
            } 
            if(rateGas){
                return rateGas;
            }else{
                return false;
            }
        }catch (e) {
            console.log(e)
        }
    },
    findRateGasById : async function(id){
        try {
            const rateGas = await RateGas.findById(id);
            if(rateGas){
                return rateGas;
            }else{
                return false;
            }
        }catch (e) {
            console.log(e)
        }
    },
    updateRateGas : async function(id, rategas){
        try {
            const rateGas = await RateGas.findByIdAndUpdate(id, rategas);
            if(rateGas){
                return rateGas;
            }else{
                return false;
            }
        }catch (e) {
            console.log(e)
        }
    },
    deleteRateGas : async function(id){
        try {
            const rateGas = await RateGas.findByIdAndRemove(id);
            if(rateGas){
                return rateGas;
            }else{
                return false;
            }
        }catch (e) {
            console.log(e)
        }
    },
}
