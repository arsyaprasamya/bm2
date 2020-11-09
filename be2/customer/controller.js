const { addCustomer, deleteCustomer, editCustomer, findByCustomerId, listCustomer, findLast, countCustomer} = require('./service');

function pad(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}

module.exports = {
    customerAdd : async function(req, res, next){
        try {
            const customer = await addCustomer(req.body);
            if(customer){
                return res.status(200).json({"status": "success", "data": customer});
            }else{
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        }catch (e) {
            console.log(e);
        }
    },
    customerEdit : async function(req, res, next){
        try {
            const customer = await editCustomer(req.params.id, req.body);
            if(customer){
                return res.status(200).json({"status": "success", "data": customer});
            }else{
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        }catch (e) {
            console.log(e);
        }
    },
    customerDelete : async function(req, res, next){
        try {
            const customer = await deleteCustomer(req.params.id);
            if(customer){
                return res.status(200).json({"status": "success", "data": "seccess delete customer"});
            }else{
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        }catch (e) {
            console.log(e);
        }
    },
    customerFind: async function(req, res, next){
        try {
            const customer = await findByCustomerId(req.params.id);
            if(customer){
                return res.status(200).json({"status": "success", "data": customer});
            }else{
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        }catch (e) {
            console.log(e);
        }
    },
    customerList: async function(req, res, next){
        try {
            const str = JSON.parse(req.query.param);
            const allData = await listCustomer({}, 1, 0);
            let query = {};
            if(str.filter !== null) query = {cstrmrnm: str.filter.cstrmrnm}
            const customer = await listCustomer(query, str.pageNumber, str.limit);
            if(customer){
                return res.status(200).json({"status": "success", "data": customer, "totalCount": allData.length});
            }else{
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        }catch (e) {
            console.log(e);
        }
    },
    customerCodeGenerator: async function(req, res, next){
        try {
            const customerCount = await countCustomer();
            const lastCustomer = await findLast();
            const newNumber = 'T' + pad(customerCount+1,5);
            if(newNumber){
                return res.status(200).json({"status": "success", "data": newNumber});
            }else{
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        }catch (e) {
            console.log(e);
        }
    }
}