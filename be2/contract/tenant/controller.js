const { listTenant, addTenant, editTenant, deleteTenant, getTenant, getContractNumber, listTenantMobile } = require("./service");

module.exports = {
    tenantList : async function(req, res, next){
        try {
            const str = JSON.parse(req.query.param);
            const allData = await listTenantMobile({}, 1, 0);
            let query = {};
            if(str.filter !== null) query = {contract_number: str.filter.contract_number}
            const tenant = await listTenant(query, str.pageNumber, str.limit);
            if(tenant){
                res.status(200).json({status: "success", data: tenant, "totalCount": allData.length});
            }else{
                res.status(500).json({status: "error", data: "internal server error"});
            }
        }catch (e) {
            res.status(500).json({status: "error", data: e});
        }
    },

//list Tenant Mobile
tenantListMobile : async function(req, res, next){
    try {
        const str = JSON.parse(req.query.param);
        // const allData = await listTenant({}, 1, 0);
        // let query = {};
        // if(str.filter !== null) query = {contract_number: str.filter.contract_number}
        const tenant = await listTenant(query, str.pageNumber, str.limit);
        if(tenant){
            res.status(200).json({status: "success", data: tenant, "totalCount": allData.length});
        }else{
            res.status(500).json({status: "error", data: "internal server error"});
        }
    }catch (e) {
        res.status(500).json({status: "error", data: e});
    }
},

    tenantGet : async function(req, res, next){
        try {
            const tenant = await getTenant(req.params.id);
            if(tenant){
                res.status(200).json({status: "success", data: tenant});
            }else{
                res.status(500).json({status: "error", data: "internal server error"});
            }
        }catch (e) {
            res.status(500).json({status: "error", data: e});
        }
    },
    tenantAdd : async function(req, res, next){
        try {
            const tenant = await addTenant(req.body);
            if(tenant){
                res.status(200).json({status: "success", data: tenant});
            }else{
                res.status(500).json({status: "error", data: "internal server error"});
            }
        }catch (e) {
            console.log(e);
        }
    },
    tenantUpdate : async function(req, res, next){
        try {
            const tenant = await editTenant(req.params.id, req.body);
            if(tenant){
                res.status(200).json({status: "success", data: tenant});
            }else{
                res.status(500).json({status: "error", data: "internal server error"});
            }
        }catch (e) {
            console.log(e);
        }
    },
    tenantNumber : async function(req, res, next){
        try {
            const number = await getContractNumber(req.params.id);
            if(number){
                res.status(200).json({status: "success", data: number});
            }else{
                res.status(500).json({status: "error", data: "internal server error"});
            }
        }catch (e) {
            res.status(500).json({status: "error", data: e});
        }
    },
    tenantDelete : async function(req, res, next){
        try {
            const tenant = await deleteTenant(req.params.id);
            if(tenant){
                res.status(200).json({status: "success", data: tenant});
            }else{
                res.status(500).json({status: "error", data: "internal server error"});
            }
        }catch (e) {
            console.log(e);
        }
    },
};