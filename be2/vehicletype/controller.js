const { addVehicleType, deleteVehicleType, editVehicleType, findVehicleType, listVehicleType} = require('./service');

module.exports = {
    vehicleTypeAdd : async function(req, res, next){
        try {
            const vt = await addVehicleType(req.body);
            if(vt){
                return res.status(200).json({"status": "success", "data": vt});
            }else{
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        }catch (e) {
            console.log(e);
        }
    },
    vehicleTypeDelete : async function(req, res, next){
        try {
            const vt = await deleteVehicleType(req.params.id);
            if(vt){
                return res.status(200).json({"status": "success", "data": "success delete vehicle type"});
            }else{
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        }catch (e) {
            console.log(e);
        }
    },
    vehicleTypeEdit : async function(req, res, next){
        try {
            const vt = await editVehicleType(req.params.id, req.body);
            if(vt){
                return res.status(200).json({"status": "success", "data": vt});
            }else{
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        }catch (e) {
            console.log(e);
        }
    },
    vehicleTypeFind : async function(req, res, next){
        try {
            const vt = await findVehicleType(req.params.id);
            if(vt){
                return res.status(200).json({"status": "success", "data": vt});
            }else{
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        }catch (e) {
            console.log(e);
        }
    },
    vehicleTypeList : async function(req, res, next){
        try {
            const str = JSON.parse(req.query.param);
            const allData = await listVehicleType({}, 1, 0);
            let query = {};
            if(str.filter !== null) query = {nmvhtp: str.filter.nmvhtp};
            const vt = await listVehicleType(query, str.pageNumber, str.limit);
            if(vt){
                return res.status(200).json({"status": "success", "data": vt, "totalCount": allData.length});
            }else{
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        }catch (e) {
            console.log(e);
        }
    }
}