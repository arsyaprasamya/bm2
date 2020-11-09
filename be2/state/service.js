/**
 *
 * Parking lot database services
 */
const Province = require('./modelProvince').Province;
const Regency = require('./modelRegency').Regency;
const District = require('./modelDistrict').District;
const Village = require('./modelVillage').Village;
const KodePos = require('./modelPostalCode').KodePos;

module.exports = {
    listProvince : async function(query, page = 1, limit = 1000) {
        try {
            const skip = (page - 1) * limit;
            const province = await Province.find(query).skip(skip).limit(limit);
            if(province){
                return province;
            }else{
                return false;
            }
        }catch (e) {
            console.log(e);
        }
    },
    listRegency : async function(query, page = 1, limit = 1000){
        try {
            const skip = (page - 1) * limit;
            const regency = await Regency.find(query).skip(skip).limit(limit).populate({path:'province'});
            if(regency){
                return regency;
            }else{
                return false;
            }
        }catch (e) {
            console.log(e);
        }
    },
    listDistrict : async function(query, page = 1, limit = 1000){
        try {
            const skip = (page - 1) * limit;
            const district = await District.find(query).skip(skip).limit(limit).populate({path:'regency',populate:{path:'province'}});
            if(district){
                return district;
            }else{
                return false;
            }
        }catch (e) {
            console.log(e);
        }
    },
    listVillage : async function(query, page = 1, limit = 1000){
        try {
            const skip = (page - 1) * limit;
            const village = await Village.find(query).skip(skip).limit(limit).populate({path:'district', populate:{path: 'regency', populate: {path: 'province'}}});
            if(village){
                return village;
            }else{
                return false;
            }
        }catch (e) {
            console.log(e);
        }
    },
    listKodePos: async function(query, page = 1, limit = 1000){
        try {
            const skip = (page - 1) * limit;
            const kodepos = await KodePos.find(query).skip(skip).limit(limit);
            if(kodepos){
                return kodepos;
            }else{
                return false;
            }
        }catch (e) {
            console.log(e);
        }
    }

}
