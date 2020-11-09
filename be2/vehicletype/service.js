/**
 *
 * Parking lot database services
 */
const VehicleType = require('./model').VehicleType;

module.exports = {
    addVehicleType : async function(vhtp){
        try {
            const vehicletype = await new VehicleType(vhtp).save();
            if(vehicletype){
                return vehicletype;
            }else{
                return false;
            }
        }catch (e) {
            console.log(e);
        }
    },
    listVehicleType: async function(query, page = 1, limit = 1000){
        try {
            const skip = (page - 1) * limit;
            let vehicletype;
            if(Object.keys(query).length === 0){
                vehicletype = await VehicleType.find(query).skip(skip).limit(limit).sort({$natural:-1});
            }else{
                let num;
                num = parseInt(query.nmvhtp);
                if(!num){
                    num = "";
                }
            vehicletype = await VehicleType.find().or([
                { 'nmvhtp': { $regex: `${query.nmvhtp}` }}, 
                { 'vhttype': { $regex: `${query.nmvhtp}` }},
                { 'vhtprate': num},
            ]).skip(skip).limit(limit).sort({$natural:-1});
            }
            if(vehicletype){
                return vehicletype;
            }else{
                return false;
            }
        }catch (e) {
            console.log(e);
        }
    },
    editVehicleType: async function(id, vhtp){
        try {
            const vehicletype = await VehicleType.findByIdAndUpdate(id, vhtp);
            if(vehicletype){
                return vehicletype;
            }else{
                return false;
            }
        }catch (e) {
            console.log(e);
        }
    },
    findVehicleType: async function(id){
        try {
            const vehicletype = await VehicleType.findById(id);
            if(vehicletype){
                return vehicletype;
            }else {
                return false;
            }
        }catch (e) {
            console.log(e);
        }
    },
    deleteVehicleType: async function(id){
        try {
            const vehicletype = await VehicleType.findByIdAndRemove(id);
            if (vehicletype){
                return vehicletype;
            } else {
                return false;
            }
        }catch (e) {
            console.log(e)
        }
    }
}