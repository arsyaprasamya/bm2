/**
 *
 * Unit database services
 */

const UnitRate = require('./model').UnitRate;
function validationUnit(){

}

module.exports = {
    listUnitRate: async function (query, page = 1, limit = 1000) {
        try{
            const skip = (page - 1) * limit;
            let unitrate;
            if(Object.keys(query).length === 0){
            unitrate = await UnitRate.find(query).skip(skip).limit(limit).select('-__v').sort({$natural:-1});
            }else{
            let num;
            num = parseInt(query.unit_rate_name);
            if(!num){
                num = "";
            }
            unitrate = await UnitRate.find().or([
                { 'unit_rate_name': { $regex: `${query.unit_rate_name}` }},
                { 'service_rate': num },
                { 'sinking_fund': num },
                { 'overstay_rate': num },
        ]).skip(skip).limit(limit).select('-__v').sort({$natural:-1});
            }
            if(unitrate){
                return unitrate;
            }else{
                return false;
            }
        }catch (e) {
            console.log(e);
        }
    },
    getUnitRateById: async function(id){
        try{
            const unitrate = await UnitRate.findById(id).populate().select('-__v');
            if(unitrate){
                return unitrate;
            }else{
                return false;
            }
        }catch (e) {
            console.log(e);
        }
    },
    addUnitRate: async function(unitrate){
        try {
            const newUnitRate = await new UnitRate(unitrate).save();
            if(newUnitRate){
                return newUnitRate;
            }else{
                return false;
            }
        }catch (e) {
            console.log(e);
        }
    },
    updateUnitRate: async function(id, unitrate){
        try {
            const updateUnitRate = await UnitRate.findByIdAndUpdate(id, unitrate);
            if(updateUnitRate){
                return updateUnitRate;
            }else{
                return false;
            }
        }catch (e) {
            console.log(e);
        }
    },
    deleteUnitRate: async function(id){
        try {
            const deleteUnitRate = await UnitRate.findByIdAndRemove(id);
            if(deleteUnitRate){
                return deleteUnitRate;
            }else{
                return false;
            }
        }catch (e) {
            console.log(e);
        }
    }
}