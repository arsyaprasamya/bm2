const {addRatePower, listRatePower, deleteRatePower, findRatePowerById, updateRatePower} = require("./service");

module.exports = {
    addRate : async function(req, res, next){
        try{
            const RatePower = await addRatePower(req.body);
            if(RatePower){
                res.status(200).json({"status": "success", "data": RatePower});
            }else{
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        }catch (e) {
            console.log(e);
        }
    },
    listRate : async function(req, res, next){
        try{
            const str = JSON.parse(req.query.param);
            const allData = await listRatePower({}, 1, 0);
            let query = {};
            
            if(str.filter !== null) query={nmrtepow: str.filter.nmrtepow};

            const RatePower = await listRatePower(query, str.page, str.limit);

            if(RatePower){
                res.status(200).json({"status": "success", "data": RatePower, "totalCount": allData.length});
            }else{
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        }catch (e) {
            console.log(e);
        }
    },
    deleteRate : async function(req, res, next){
        try{
            const RatePower = await deleteRatePower(req.params.id,);
            if(RatePower){
                res.status(200).json({"status": "success", "data": "success delete rate gas data"});
            }else{
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }

        }catch (e) {
            console.log(e);
        }
    },
    findRate : async function(req, res, next){
        try{
            const RatePower = await findRatePowerById(req.params.id);
            if(RatePower){
                res.status(200).json({"status": "success", "data": RatePower});
            }else{
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        }catch (e) {
            console.log(e);
        }
    },
    updateRate : async function(req, res, next){
        try{
            const RatePower = await updateRatePower(req.params.id, req.body);
            if(RatePower){
                res.status(200).json({"status": "success", "data": RatePower});
            }else{
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        }catch (e) {
            console.log(e);
        }
    }
}