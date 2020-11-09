const { addTransaksi, deleteTransaksi, getTransaksiById, listTransaksi, updateTransaksi, findTransaksiUnit, EditChecker, getCheckerFalse, getCheckerTrue, addTransaksiGasMobile, getTransaksiByIdGasMobile} =  require("./service");
const { findGasById } =  require("./../master/service");

module.exports = {
    tambahTransaksi: async function(req, res, next){
        try {
            const gas = await addTransaksi(req.body);
            if(gas){
                return res.status(200).json({"status": "success", "data": gas});
            }else{
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        }catch (e) {
            console.log(e);
        }
    },

// Add transaksi Gas by Mobile
tambahTransaksiGasMobile: async function(req, res, next){
    try {
        const gas = await addTransaksiGasMobile(req.body);
        if(gas){
            return res.status(200).json({"status": "success", "data": gas});
        }else{
            return res.status(500).json({"status": "error", "data": "internal server error"});
        }
    }catch (e) {
        console.log(e);
    }
},

    transaksiUpdate: async function(req, res, next){
        try {
            const transaksi = await updateTransaksi(req.params.id, req.body);
            if(transaksi){
                return res.status(200).json({"status": "success", "data": transaksi});
            }else{
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        }catch (e) {
            console.log(e);
        }
    },
    transaksiById: async function(req, res, next){
        try {
            const transaksi = await getTransaksiById(req.params.id);
            if(transaksi){
                return res.status(200).json({"status": "success", "data": transaksi});
            }else{
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        }catch (e) {
            console.log(e);
        }
    },

//get Transaksi By Id Mobile
transaksiByIdGasMobile: async function(req, res, next){
    try {
        const transaksi = await getTransaksiByIdGasMobile(req.params.id);
        if(transaksi){
            return res.status(200).json({"status": "success", "data": transaksi});
        }else{
            return res.status(500).json({"status": "error", "data": "internal server error"});
        }
    }catch (e) {
        console.log(e);
    }
},

    transaksiList: async function(req, res, next){
        try {
            var str = JSON.parse(req.query.param)
            const countTransaksi = await listTransaksi({}, 1, 0); 
            const transaksi = await listTransaksi(req.body.filter, str.page, str.limit);
            if(transaksi){
                return res.status(200).json({"status": "success", "data": transaksi,"totalCount": countTransaksi.length});
            }else{
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        }catch (e) {
            console.log(e);
        }
    },

    ListCheckerFalse: async function(req, res, next){
        try {
            var str = JSON.parse(req.query.param);
            const allData = await getCheckerFalse({}, 1, 0);
            const transaksi = await getCheckerFalse(req.body.filter, str.page, str.limit);
            if(transaksi){
                return res.status(200).json({"status": "success", "data": transaksi, "totalCount": allData.length});
            }else{
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        }catch (e) {
            console.log(e);
        }
    },
    
    ListCheckerTrue: async function(req, res, next){
        try {
            var str = JSON.parse(req.param);
            const allData = await getCheckerTrue({}, 1, 0);
            const transaksi = await getCheckerTrue(req.body.filter, str.page, str.limit);
            if(transaksi){
                return res.status(200).json({"status": "success", "data": transaksi,  "totalCount": allData.length});
            }else{
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        }catch (e) {
            console.log(e);
        }
    },
    UpdateChecker: async function(req, res, next){
        try {
            const gas = await EditChecker(req.body);
            if(gas){
                return res.status(200).json({"status": "success", "data": genSaltSync});
            }else{
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        }catch (e) {
            console.log(e);
        }
    },

    getTransaksiUnit: async function(req, res, next){
        try {
            const transaksi = await findTransaksiUnit(req.params.id);
            if(transaksi){
                return res.status(200).json({"status": "success", "data": transaksi});
            }else{
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        }catch (e) {
            return res.status(500).json({status: "error", "data": "internal server error"})
        }
    },
    transaksiDelete:  async function(req, res, next){
        try {
            const transaksi = await deleteTransaksi(req.params.id);
            if(transaksi){
                return res.status(200).json({"status": "success", "data": transaksi});
            }else{
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        }catch (e) {
            console.log(e);
        }
    },
}
