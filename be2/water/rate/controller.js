const {addRateWater, listRateWater, deleteRateWater, findRateWaterById, updateRateWater} = require("./service");

module.exports = {
    addRate : async function(req, res, next){
        try{
            const RateWater = await addRateWater(req.body);
            if(RateWater){
                res.status(200).json({"status": "success", "data": RateWater});
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
            const allData = await listRateWater({}, 1, 0);
            let query = {};
            
            if(str.filter !== null) query={nmrtewtr: str.filter.nmrtewtr};

            const RateWater = await listRateWater(query, str.pageNumber, str.limit);

            if(RateWater){
                res.status(200).json({"status": "success", "data": RateWater, "totalCount": allData.length});
            }else{
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        }catch (e) {
            console.log(e);
        }
    },
    deleteRate : async function(req, res, next){
        try{
            const RateWater = await deleteRateWater(req.params.id,);
            if(RateWater){
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
            const RateWater = await findRateWaterById(req.params.id);
            if(RateWater){
                res.status(200).json({"status": "success", "data": RateWater});
            }else{
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        }catch (e) {
            console.log(e);
        }
    },
    updateRate : async function(req, res, next){
        try{
            const RateWater = await updateRateWater(req.params.id, req.body);
            if(RateWater){
                res.status(200).json({"status": "success", "data": RateWater});
            }else{
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        }catch (e) {
            console.log(e);
        }
    }
}