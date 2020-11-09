const {addUnit, deleteUnit, listUnit, listUnitById, updateUnit, getUnitByParent, listUnitMobile, getUnitByParentMobile, listUnitByIdMobile, addUnitMobile, deleteUnitMobile, updateUnitMobile} = require("./service");
const {listTenant} = require("../contract/tenant/service");
const {listOwnership} = require("../contract/owner/service");

module.exports = {
    addUnt : async function(req, res, next){
        const unit = await addUnit(req.body);
        if(unit){
            return res.status(200).json({"status": "success", "data": unit});
        }else{
            return res.status(500).json({"status": "error", "data": "internal server error"});
        }
    },

// add unit mobile
addUntMobile : async function(req, res, next){
    const unit = await addUnitMobile(req.body);
    if(unit){
        return res.status(200).json({"status": "success", "data": unit});
    }else{
        return res.status(500).json({"status": "error", "data": "internal server error"});
    }
},

    deleteUnt : async function(req, res, next){
        const unit = await deleteUnit(req.params.id);
        if(unit){
            return res.status(200).json({"status": "success", "data": "data already delete"});
        }else{
            return res.status(500).json({"status": "error", "data": "internal server error"});
        }
    },

//delete Unit Mobile
deleteUntMobile : async function(req, res, next){
    const unit = await deleteUnitMobile(req.params.id);
    if(unit){
        return res.status(200).json({"status": "success", "data": unit});
    }else{
        return res.status(500).json({"status": "error", "data": "internal server error"});
    }
},

    getByParentId: async function(req, res, next){
        try {
            const unit = await getUnitByParent(req.params.id);
            if (unit) {
                return res.status(200).json({"status": "success", "data": unit});
            } else {
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        } catch (e) {
            console.log(e);
        }
    },

// get unit by parent mobile
getByParentIdMobile: async function(req, res, next){
    try {
        const unit = await getUnitByParentMobile(req.params.id);
        if (unit) {
            return res.status(200).json({"status": "success", "data": unit});
        } else {
            return res.status(500).json({"status": "error", "data": "internal server error"});
        }
    } catch (e) {
        console.log(e);
    }
},

    getUnitCustomer: async function(req, res, next){
        try {
            const costumerTenantUnit = await listTenant({unit: req.params.id}, 1, 1000);
            if(costumerTenantUnit.length == 0){
                const costumerOwnerUnit = await listOwnership({unit: req.params.id}, 1, 1000);
                if(costumerOwnerUnit){
                    return res.status(200).json({status: "status", data:costumerOwnerUnit});
                }else{
                    return res.status(500).json({status: "error", data: "internal server error"});
                }
            }else if (costumerTenantUnit){
                return res.status(200).json({status: "success", data: costumerTenantUnit});
            }else{
                return res.status(500).json({status: "error", data: "internal server error"});
            }
        }catch (e) {
            return res.status(500).json({"status": "error", "data": "internal server error"});
        }
    },
    listUnt : async function(req, res, next){
        const str = JSON.parse(req.query.param);
        const allData = await listUnit({}, 1, 0);
        let query = {};
        
        if(str.filter !== null) query={cdunt: str.filter.cdunt};

        const unit = await listUnit(query, str.pageNumber, str.limit);

        if(unit){
            return res.status(200).json({"status": "success", "data": unit, "totalCount": allData.length});
        }else{
            return res.status(500).json({"status": "error", "data": "internal server error"});
        }
    },

    //list Unit Mobile 
    listUntMobile : async function(req, res, next){
         const list = await listUnitMobile(req.params.filter, req.params.page, req.params.limit);
        if(list){
            return res.status(200).json({"status": "success", "data": list, "totalCount": list.length});
        }else{
            return res.status(500).json({"status": "error", "data": "internal server error"});
        }
    },
    listUntById : async function(req, res, next){
        const unit = await listUnitById(req.params.id);
        if(unit){
            return res.status(200).json({"status": "success", "data": unit});
        }else{
            return res.status(500).json({"status": "error", "data": "internal server error"});
        }
    },

//list Unit By Id Mobile
listUntByIdMobile : async function(req, res, next){
    const unit = await listUnitByIdMobile(req.params.id);
    if(unit){
        return res.status(200).json({"status": "success", "data": unit});
    }else{
        return res.status(500).json({"status": "error", "data": "internal server error"});
    }
},

// update Unit Mobile
updateUntMobile : async function(req, res, next){
    const unit = await updateUnitMobile(req.params.id, req.body);
    if(unit){
        return res.status(200).json({"status": "success", "data": unit});
    }else{
        return res.status(500).json({"status": "error", "data": "internal server error"});
    }
},

    updateUnt : async function(req, res, next){
        const unit = await updateUnit(req.params.id, req.body);
        if(unit){
            return res.status(200).json({"status": "success", "data": unit});
        }else{
            return res.status(500).json({"status": "error", "data": "internal server error"});
        }
    }

};