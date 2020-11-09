/**
 *
 * Transaksi gas database service
 *
 */
const TransaksiGas = require('./model').TransaksiGas;

module.exports = {
    addTransaksi: async function(transaksi){
        try {
            const newTransaksi = await new TransaksiGas(transaksi).save();
            if(newTransaksi){
                return newTransaksi;
            }else{
                return false;
            }
        }catch (e) {
            console.log(e);
        }
    },

// add transaksi Gas Mobile
addTransaksiGasMobile: async function(transaksi){
    try {
        const newTransaksi = await new TransaksiGas(transaksi).save();
        if(newTransaksi){
            return newTransaksi;
        }else{
            return false;
        }
    }catch (e) {
        console.log(e);
    }
},

    EditChecker: async function(transaksi){
        try {
            const newTransaksi = await TransaksiGas.update({"checker": false}, {"$set":{"checker": true}}, {"multi": true})
            if(newTransaksi){
                return newTransaksi;
            }else{
                return false;
            }
        }catch (e) {
            console.log(e);
        }
    },
    getCheckerTrue: async function(transaksi){
        try {
            const newTransaksi = await TransaksiGas.find({"checker": true}).populate({
                path:'gas',
                model: "Gas",
                select:'-__v',
                populate:[
                    {
                        path: "unt",
                        model: "Unit",
                        select: "-__v",
                    },
                    {
                        path: "rte",
                        model: "RateGas",
                        select: "-__v",
                    },
                ],
            }).select('-__v').sort({$natural:-1});
            if(newTransaksi){
                return newTransaksi;
            }else{
                return false;
            }
        }catch (e) {
            console.log(e);
        }
    },
    getCheckerFalse: async function(query, page = 1, limit = 10){
        try {
            const skip = (page - 1) * limit;
            const newTransaksi = await TransaksiGas.find({"checker": false}).skip(skip).limit(limit).populate({
                path:'gas',
                model: "Gas",
                select:'-__v',
                populate:[
                    {
                        path: "unt",
                        model: "Unit",
                        select: "-__v",
                    },
                    {
                        path: "rte",
                        model: "RateGas",
                        select: "-__v",
                    },
                ],
            }).select('-__v').sort({$natural:-1});
            if(newTransaksi){
                return newTransaksi;
            }else{
                return false;
            }
        }catch (e) {
            console.log(e);
        }
    },

    listTransaksi: async function(query, page = 1, limit = 10){
        try {
            const skip = (page - 1) * limit;
            const transaksi = await TransaksiGas.find(query).skip(skip).limit(limit).populate({
                path:'gas',
                model: "Gas",
                select:'-__v',
                populate: [
                    {
                        path: 'unt',
                        model: "Unit",
                        select: '-__v',
                    },
                    {
                        path: 'rte',
                        model: "RateGas",
                        select: '-__v',
                    }
                ]
            }).select('-__v').sort({$natural:-1});
            if(transaksi){
                return transaksi;
            }else{
                return false;
            }
        }catch (e) {
            console.log(e);
        }
    },
    getTransaksiById: async function(id){
        try {
            const transaksi = await TransaksiGas.findById(id);
            if(transaksi){
                return transaksi;
            }else{
                return false;
            }
        }catch (e) {
            console.log(e);
        }
    },

// Get Transaksi Gas by Id Mobile
getTransaksiByIdGasMobile: async function(id){
    try {
        const transaksi = await TransaksiGas.findById(id);
        if(transaksi){
            return transaksi;
        }else{
            return false;
        }
    }catch (e) {
        console.log(e);
    }
},

    updateTransaksi: async function(id, transaksi){
        try {
            const updateTransaksi = await TransaksiGas.findByIdAndUpdate(id, transaksi);
            if(updateTransaksi){
                return updateTransaksi;
            }else{
                return false;
            }
        }catch (e) {
            console.log(e);
        }
    },
    deleteTransaksi: async function(){
        try {
            const transaksi = await TransaksiGas.findByIdAndRemove(id);
            if(transaksi){
                return transaksi;
            }else{
                return false;
            }
        }catch (e) {
            console.log(e);
        }
    },

    findTransaksiUnit: async function(id){
        try {
            var tamung = [];
            const transaksi = await TransaksiGas.find().populate({
                path:'gas',
                model: "Gas",
                select:'-__v',
                populate:[
                    {
                        path: "unt",
                        model: "Unit",
                        select: "-__v",
                    },
                    {
                        path: "rte",
                        model: "RateGas",
                        select: "-__v",
                    },
                ],
            });
            transaksi.forEach(function (item) {
                if(item.gas.unt._id == id){
                    tamung.push(item);
                }
            });
            if(tamung){
                return tamung;
            }else{
                return false;
            }
        }catch (e) {
            console.log(e);
        }
    }
}