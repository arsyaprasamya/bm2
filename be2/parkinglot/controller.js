const { addParkingLot, deleteParkingLot, editParkingLot, findParkingLot, listParkingLot} = require('./service');
const services = require("./service");

module.exports = {
    listParking: async function(req, res, next){
        try {
            const str = JSON.parse(req.query.param);
            let query = {};
            if (str.filter !== null){
                query={space: str.filter.space}
            };
            const allData = await services.listParkingLot({}, 1, 0);
            const parking = await services.listParkingLot(query, str.pageNumber, str.limit);
            if(parking){
                return res.status(200).json({"status": "success", "data": parking, "totalCount": allData.length});
            }else{
                return res.status(500).json({"status": "success", "data": "internal server error"});
            }
        }catch (e) {
            return res.status(500).json({"status": "error", "data": e});
        }
    },
    
    addParking: async function(req, res, next){
        try {
            const parking = await addParkingLot(req.body);
            if(parking){
                return res.status(200).json({"status": "success", "data": parking});
            }else{
                return res.status(500).json({"status": "success", "data": "internal server error"});
            }
        }catch (e) {
            return res.status(500).json({"status": "error", "data": e});
        }
    },
    editParking: async function(req, res, next){
        try {
            const parking = await editParkingLot(req.params.id, req.body);
            if(parking){
                return res.status(200).json({"status": "success", "data": parking});
            } else {
                return res.status(500).json({"status": "success", "data": "internal server error"});
            }
        }catch (e) {
            return res.status(500).json({"status": "error", "data": e});
        }
    },
    deleteParking: async function(req, res, next){
        try {
            const parking = deleteParkingLot(req.params.id);
            if(parking){
                return res.status(200).json({"status": "success", "data": "parking lot delete success"});
            } else {
                return res.status(500).json({"status": "success", "data": "internal server error"});
            }
        }catch (e) {
            return res.status(500).json({"status": "error", "data": e});
        }
    },
    findParking: async function(req, res, next){
        try {
            const parking = await findParkingLot(req.params.id);
            if(parking){
                return res.status(200).json({"status": "success", "data": parking});
            }else{
                return res.status(500).json({"status": "success", "data": "internal server error"});
            }
        }catch (e) {
            return res.status(500).json({"status": "error", "data": e});
        }
    },
}