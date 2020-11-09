const { addTransaksi, deleteTransaksi, getTransaksiById, listTransaksi, updateTransaksi, findTransaksiUnit, EditChecker, getCheckerFalse, getCheckerTrue, MobilelistTransaksi, addTransaksiWaterMobile, getTransaksiByIdWaterMobile} =  require("./service");
const { findWaterById } =  require("./../master/service");
const { listTransaksiMobile } = require("../../power/transaksi/service");

module.exports = {
    tambahTransaksi: async function(req, res, next){
        try {
            const water = await addTransaksi(req.body);
            if(water){
                return res.status(200).json({"status": "success", "data": water});
            }else{
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        }catch (e) {
            console.log(e);
        }
    },

//tambah transaksi water Mobile
tambahTransaksiWaterMobile: async function(req, res, next){
    try {
        const water = await addTransaksiWaterMobile(req.body);
        if(water){
            return res.status(200).json({"status": "success", "data": water});
        }else{
            return res.status(500).json({"status": "error", "data": "internal server error"});
        }
    }catch (e) {
        console.log(e);
    }
},


    UpdateChecker: async function(req, res, next){
        try {
            const water = await EditChecker(req.body);
            if(water){
                return res.status(200).json({"status": "success", "data": water});
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


// get transaksi water by id Mobile

transaksiById: async function(req, res, next){
    try {
        const transaksi = await getTransaksiByIdWaterMobile(req.params.id);
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
            // const str = JSON.parse(req.query.param);
            const allData = await listTransaksi({}, 1, 0);
            const transaksi = await listTransaksi(req.params.filter, req.params.page, req.params.limit);
            if(transaksi){
                return res.status(200).json({"status": "success", "data": transaksi,  "totalCount": allData.length});
            }else{
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        }catch (e) {
            console.log(e);
        }
    },


//list Transaksi Mobile
MobiletransaksiList: async function(req, res, next){
    try {
        var str = JSON.parse(req.query.param);
        const allData = await MobilelistTransaksi({}, 1, 0);
        const transaksi = await MobilelistTransaksi(req.body.filter, str.page, str.limit);
        if(transaksi){
            return res.status(200).json({"status": "success", "data": transaksi,  "totalCount": allData.length});
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
