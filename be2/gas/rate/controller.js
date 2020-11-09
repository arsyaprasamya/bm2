const {addRateGas, listRateGas, deleteRateGas, findRateGasById, updateRateGas} = require("./service");

module.exports = {
    addRate : async function(req, res, next){
        try{
            const RateGas = await addRateGas(req.body);
            if(RateGas){
                res.status(200).json({"status": "success", "data": RateGas});
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
            const dataGas = await listRateGas({}, 1, 0);
            let query = {};
            
            if(str.filter !== null) query={nmrtegas: str.filter.nmrtegas, rte: str.filter.rte};

            const RateGas = await listRateGas(query, str.pageNumber, str.limit);
            
            if(RateGas){
                res.status(200).json({"status": "success", "totalCount": dataGas.length,"data": RateGas});
            }else{
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        }catch (e) {
            console.log(e);
        }
    },
    deleteRate : async function(req, res, next){
        try{
            const RateGas = await deleteRateGas(req.params.id,);
            if(RateGas){
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
            const RateGas = await findRateGasById(req.params.id);
            if(RateGas){
                res.status(200).json({"status": "success", "data": RateGas});
            }else{
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        }catch (e) {
            console.log(e);
        }
    },
    updateRate : async function(req, res, next){
        try{
            const RateGas = await updateRateGas(req.params.id, req.body);
            if(RateGas){
                res.status(200).json({"status": "success", "data": RateGas});
            }else{
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        }catch (e) {
            console.log(e);
        }
    }
}