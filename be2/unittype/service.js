/**
 *
 * Unit database services
 */

const UnitType = require('./model').UnitType;

module.exports = {
    listUnitType: async function(query, page= 1, limit = 1000){
        try {
            const skip = (page - 1) * limit;
            let unittype;
            if(Object.keys(query).length === 0){
            unittype = await UnitType.find(query).skip(skip).limit(limit).select('-__v').sort({$natural:-1});
            }else{
            unittype = await UnitType.find().or([
            { 'unttp': { $regex: `${query.unttp}` }},
        ]).skip(skip).limit(limit).select('-__v').sort({$natural:-1});
            }
            if(unittype){
                return unittype;
            }else{
                return false;
            }
        }catch (e) {
            console.log(e);
        }
    },
    
    lstUnitTypeById: async function(id){
        try {
            const unittype = await UnitType.findById(id)
            if(unittype){
                return unittype;
            }else{
                return false;
            }
        }catch (e) {
            console.log(e)
        }
    },
    addUnitType: async function(type){
        try {
            const unitType = await new UnitType(type).save();
            if(unitType){
                return unitType;
            }else {
                return false;
            }
        }catch (e) {
            console.log(e)
        }
    },
    editUnitType: async function(id, unit){
        try {
            const unittype = await UnitType.findByIdAndUpdate(id, unit);
            if (unittype){
                return unittype
            }else{
                return false;
            }
        }catch (e) {
            console.log(e);
        }
    },


    deleteUnitType: async function(id){
        try {
            const unittype = await UnitType.findByIdAndRemove(id);
            if(unittype){
                return unittype;
            }else{
                return false
            }
        }catch (e) {
            console.log(e);
        }

    }
}