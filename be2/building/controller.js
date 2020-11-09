const {addBuilding, getBuildingById, listBuilding, editBuilding, deleteBuilding, getBuildingByParent} = require("./service");

module.exports = {
    listBld : async function(req, res, next){
        try {
            const building = await listBuilding(req.body.filter, req.body.page, req.body.limit);
            if(building){
                return res.status(200).json({"status": "success", "data": building});
            }else{
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        }catch (e) {
            return res.status(500).json({"status": "error", "data": e});
        }

    },
    listBldByParent : async function(req, res, next){
        try {
            const building = await getBuildingByParent(req.params.id);
            if (building){
                return res.status(200).json({"status": "success", "data": building});
            }else{
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        }catch (e) {
            return res.status(500).json({"status": "error", "data": e});
        }
    },
    getBld : async function(req, res, next){
        try {
            const building = await getBuildingById(req.params.id);
            if(building){
                return res.status(200).json({"status": "success", "data": building});
            }else{
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        }catch (e) {
            return res.status(500).json({"status": "error", "data": e});
        }
    },
    addBld : async function(req, res, next){
        try {
            const building = await addBuilding(req.body);
            if(building){
                return res.status(200).json({"status": "success", "data": building});
            }else{
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        }catch (e) {
            return res.status(500).json({"status": "error", "data": e});
        }
    },
    editBld: async function(req, res, next){
        try {
            const building = await editBuilding(req.params.id, req.body);
            if(building){
                return res.status(200).json({"status": "success", "data": building});
            }else{
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        }catch (e) {
            return res.status(500).json({"status": "error", "data": e});
        }
    },
    deleteBld : async function(req, res, next){
        try {
            const building = await deleteBuilding(req.params.id);
            if (building) {
                return res.status(200).json({"status": "success", "data": "success delete building data"});
            } else {
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        } catch (e) {
            return res.status(500).json({"status": "error", "data": e});
        }
    }
}
