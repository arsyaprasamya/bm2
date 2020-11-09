const {listEngineer, lstEngineerById, addEngineer, editEngineer, deleteEngineer, getEngineerCode} = require("./service");

module.exports = {
    Engineer: async function (req, res, next) {
        try {
            //const list = await listEngineer(req.params.filter, req.params.page, req.params.limit);
            var str = JSON.parse(req.query.param);
            let query = {}
            const allData = await listEngineer({}, 1, 0);

            if(str.filter !== null) query={name: str.filter.name};
            const engineer = await listEngineer(query, str.pageNumber, str.limit);

            if (engineer) {
                return res.status(200).json({"status": "success", "data": engineer, "totalCount": allData.length});
            } else {
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        } catch (e) {
            return res.status(500).json({"status": "error", "data": e});
        }
    },
    EngineerById: async function(req, res, next){
        try {
            const list = await lstEngineerById(req.params.id);
            if (list) {
                return res.status(200).json({"status": "success", "data": list});
            } else {
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        }catch (e) {
            return res.status(500).json({"status": "error", "data": e});
        }
    },
    tambahEngineer: async function (req, res, next) {
        try {
            const addEng = await addEngineer(req.body);
            if (addEng) {
                return res.status(200).json({"status": "success", "data": addEng});
            } else {
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        } catch (e) {
            return res.status(500).json({"status": "error", "data": e});
        }
    },
    updateEngineer: async function (req, res, next) {
        try {
            const updateEng = await editEngineer(req.params.id, req.body);
            if (updateEng) {
                return res.status(200).json({"status": "success", "data": updateEng});
            } else {
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        } catch (e) {
            return res.status(500).json({"status": "error", "data": e});
        }
    },
    hapusEngineer: async function (req, res, next) {
        try {
            const hapusEng = await deleteEngineer(req.params.id);
            if (hapusEng) {
                return res.status(200).json({"status": "success", "data": "data already delete"});
            } else {
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        } catch (e) {
            return res.status(500).json({"status": "error", "data": e});
        }
    },
    engineerNumber : async function(req, res, next){
        try {
            const number = await getEngineerCode(req.params.id);
            if(number){
                res.status(200).json({status: "success", data: number});
            }else{
                res.status(500).json({status: "error", data: "internal server error"});
            }
        }catch (e) {
            res.status(500).json({status: "error", data: e});
        }
    },
    
    
};