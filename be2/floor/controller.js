const {addFloor, listFloor, deleteFloor, findFloorById, updateFloor, getFloorByParentId} = require("./service");

module.exports = {
    addFlr : async function(req, res, next){
        try {
            const floor = await addFloor(req.body);
            if(floor){
                return res.status(200).json({"status": "success", "data": floor});
            }else{
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        }catch (e) {
            console.log(e);
        }
    },
    listFlr : async function(req, res, next){
        try {
            const str = JSON.parse(req.query.param);
            const allData = await listFloor({}, 1, 0);
            let query = {};
            if(str.filter !== null) query = {cdflr: str.filter.cdflr};
            const floor = await listFloor(query, str.pageNumber, str.limit);
            if (floor) {
                return res.status(200).json({"status": "success", "data": floor, "totalCount": allData.length});
            } else {
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        } catch (e) {
            console.log(e)
        }
    },
    getFlrByParent: async function(req, res, next){
        try {
            const floor = await getFloorByParentId(req.params.id);
            if (floor) {
                return res.status(200).json({"status": "success", "data": floor});
            } else {
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        } catch (e) {
            console.log(e)
        }
    },
    listFlrById : async function(req, res, next){
        try {
            const floor = await findFloorById(req.params.id);
            if(floor){
                return res.status(200).json({"status": "error", "data": floor});
            }else{
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        }catch (e) {
            console.log(e)
        }
    },
    updateFlr : async function(req, res, next){
        try {
            const floor = await updateFloor(req.body, req.params.id);
            if(floor){
                return res.status(200).json({"status": "error", "data": floor});
            }else{
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        }catch (e) {
            console.log(e)
        }
    },
    deleteFlr : async function(req, res, next){
        try {
            const floor = await deleteFloor(req.params.id);
            if(floor){
                return res.status(200).json({"status": "success", "data": "success delete floor data"})
            }else {
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        }catch (e) {

        }
    }


}