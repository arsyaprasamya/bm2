const { addTransaksi, deleteTransaksi, getTransaksiById, listTransaksi, updateTransaksi, findTransaksiUnit, EditChecker,getCheckerFalse, getCheckerTrue, listTransaksiMobile, getTransaksiByIdMobile, addTransaksiMobile} =  require("./service");
const { findPowerById } =  require("./../master/service");

module.exports = {
    tambahTransaksi: async function(req, res, next){
            try {
                const power = await addTransaksi(req.body);
                if(power){
                    return res.status(200).json({"status": "success", "data": power});
                }else{
                    return res.status(500).json({"status": "error", "data": "internal server error"});
                }
            }catch (e) {
                console.log(e);
            }
        },


//tambah Transaksi by Mobile
tambahTransaksiMobile: async function(req, res, next){
    try {
        const power = await addTransaksiMobile(req.body);
        if(power){
            return res.status(200).json({"status": "success", "data": power});
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
        


        //transaksi by Mobile
        transaksiByIdMobile: async function(req, res, next){
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



          
        transaksiList: async function(req, res, next){
            try {
                const str = JSON.parse(req.query.param);
                const allData = await listTransaksi({}, 1, 0);
                const transaksi = await listTransaksi(req.body.filter, str.page, str.limit);
                if(transaksi){
                    return res.status(200).json({"status": "success", "data": transaksi,  "totalCount": allData.length});
                }else{
                    return res.status(500).json({"status": "error", "data": "internal server error"});
                }
            }catch (e) {
                console.log(e);
            }
        },


//list transaksi by Mobile

        transaksiListMobile: async function(req, res, next){
            try {
                const str = JSON.parse(req.query.param);
                const allData = await listTransaksiMobile({}, 1, 0);
                const transaksi = await listTransaksiMobile(req.body.filter, str.page, str.limit);
                console.log(transaksi);
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
            const getUnit = listTransaksi({unt: req.params.id}, 1, 10000);
            if(getUnit){
                return res.status(200).json({status: "success", data: getUnit});
            }else{
                return res.status(500).json({status: "error", data: "internal server error"});
            }
        }catch (e) {
            return res.status(500).json({"status": "error", "data": "internal server error"});
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
    
    ListCheckerTrue: async function(req, res, next){
        try {
            var str = JSON.parse(req.query.param);
            const allData = await getCheckerTrue({}, 1, 0);
            const transaksi = await getCheckerTrue(req.body.filter, str.page, str.limit);
            if(transaksi){
                return res.status(200).json({"status": "success", "data": transaksi, "totalCount": allData.length});
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
