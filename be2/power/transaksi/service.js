/**
 *
 * Transaksi gas database service
 *
 */
const TransaksiPower = require('./model').TransaksiPower;
const { firstDay, lastDay } = require("../../utils/date");

module.exports = {
    addTransaksi: async function(transaksi){
        try {

            const data = await TransaksiPower.findOne({
                            pow: transaksi.pow,
                            powname: transaksi.powname,
                            billmnt: { $gt: firstDay(), $lte: lastDay() }
                        });

            if (data == null ) {
                const newTransaksi = await new TransaksiPower(transaksi).save();
                if(newTransaksi){
                    return newTransaksi;
                }else{
                    return false;
                }
            } else {
                return data;
            }
        }catch (e) {
            console.log(e);
        }
    },


//tambah Transaksi By Mobile
addTransaksiMobile: async function(transaksi){
    try {
        const newTransaksi = await new TransaksiPower(transaksi).save();
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
            const newTransaksi = await TransaksiPower.update({"checker": false}, {"$set":{"checker": true}}, {"multi": true})
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
            const newTransaksi = await TransaksiPower.find({"checker": true}).populate({
                path:'pow',
                model: "Power",
                select:'-__v',
                populate:[
                    {
                        path: "unt",
                        model: "Unit",
                        select: "-__v",
                    },
                    {
                        path: "rte",
                        model: "RatePower",
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


    getCheckerFalse: async function(query, page = 1, limit = 1000){
        try {
            const skip = (page - 1) * limit;
            const newTransaksi = await TransaksiPower.find({"checker": false}).skip(skip).limit(limit).populate({
                path:'pow',
                model: "Power",
                select:'-__v',
                populate:[
                    {
                        path: "unt",
                        model: "Unit",
                        select: "-__v",
                    },
                    {
                        path: "rte",
                        model: "RatePower",
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

    
    listTransaksi: async function(query, page = 1, limit = 1000){
        try {
            const skip = (page - 1) * limit;
            const transaksi = await TransaksiPower.find(query).skip(skip).limit(limit).populate({
                path:'pow',
                model: "Power",
                select:'-__v',
                populate:[
                    {
                        path: "unt",
                        model: "Unit",
                        select: "-__v",
                    },
                    {
                        path: "rte",
                        model: "RatePower",
                        select: "-__v",
                    },
                    
                ],
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


//list transaksi by Mobile

listTransaksiMobile: async function(query, page = 1, limit = 1000){
    try {
        const skip = (page - 1) * limit;
        let transaksi;
        if (Object.keys(query).length === 0 || query.unt !== undefined) {
            transaksi = await TransaksiPower.find(query).skip(skip).limit(limit).populate({
            path:'pow',
            model: "Power",
            select:'-__v',
            populate:[
                {
                    path: "unt",
                    model: "Unit",
                    select: "-__v",
                },
                {
                    path: "rte",
                    model: "RatePower",
                    select: "-__v",
                },
                
            ],
        }).select('-__v').sort({$natural:-1});
        if(transaksi){
            return transaksi;
        }else{
            return false;
        }
    }  
    }catch (e) {
        console.log(e);
    } 
},

    getTransaksiById: async function(id){
        try {
            const transaksi = await TransaksiPower.findById(id);
            if(transaksi){
                return transaksi;
            }else{
                return false;
            }
        }catch (e) {
            console.log(e);
        }
    },



// get transaksi by ID Mobile
getTransaksiByIdWaterMobile: async function(id){
    try {
        const transaksi = await TransaksiPower.findById(id);
        if(transaksi){
            return transaksi;
        }else{
            return false;
        }
    }catch (e) {
        console.log(e);
    }
},


    // getTransaksiById: async function(id){
    //     try {
    //         const transaksi = await TransaksiPower.findById(id);
    //         if(transaksi){
    //             return transaksi;
    //         }else{
    //             return false;
    //         }
    //     }catch (e) {
    //         console.log(e);
    //     }
    // },

    getTransaksiById: async function(id){
        try {
            const transaksi = await TransaksiPower.findById(id).populate({
                path:'pow',
                model: "Power",
                select:'-__v',
                populate:[
                    {
                        path: "unt",
                        model: "Unit",
                        select: "-__v",
                    },
                    {
                        path: "rte",
                        model: "RatePower",
                        select: "-__v",
                    },
                    
                ],
            }).select('-__v').sort({$natural:-1});;
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
            const updateTransaksi = await TransaksiPower.findByIdAndUpdate(id, transaksi);
            if(updateTransaksi){
                return updateTransaksi;
            }else{
                return false;
            }
        }catch (e) {
            console.log(e);
        }
    },
    deleteTransaksi: async function(id){
        try {
            const transaksi = await TransaksiPower.findByIdAndRemove(id);
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
            const transaksi = await TransaksiPower.find().populate({
                path:'pow',
                model: "Power",
                select:'-__v',
                populate:[
                    {
                        path: "unt",
                        model: "Unit",
                        select: "-__v",
                    },
                    {
                        path: "rte",
                        model: "RateWater",
                        select: "-__v",
                    },
                ],
            });
            transaksi.forEach(function (item) {
                if(item.pow.unt._id == id){
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
