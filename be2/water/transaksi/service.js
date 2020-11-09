/**
 *
 * Transaksi gas database service
 *
 */
const TransaksiWater = require('./model').TransaksiWater;
const { firstDay, lastDay } = require("../../utils/date");

module.exports = {
    addTransaksi: async function(transaksi){
        try {
            const data = await TransaksiWater.findOne({
                            wat: transaksi.wat,
                            watname: transaksi.watname,
                            billmnt: { $gt: firstDay(), $lte: lastDay() }
                        });

            if (data == null ) {
                const newTransaksi = await new TransaksiWater(transaksi).save();
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

//tambah Transaksi Water Mobile

addTransaksiWaterMobile: async function(transaksi){
    try {
        const newTransaksi = await new TransaksiWater(transaksi).save();
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
            const newTransaksi = await TransaksiWater.update({"checker": false}, {"$set":{"checker": true}}, {"multi": true})
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
            const newTransaksi = await TransaksiWater.find({"checker": true}).populate({
                path:'wat',
                model: "Water",
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
            const newTransaksi = await TransaksiWater.find({"checker": false}).skip(skip).limit(limit).populate({
                path:'wat',
                model: "Water",
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
            const transaksi = await TransaksiWater.find(query).skip(skip).limit(limit).populate({
                path:'wat',
                model: "Water",
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



// List Transaksi Water Mobile
MobilelistTransaksi: async function(query, page = 1, limit = 1000){
    try {
        const skip = (page - 1) * limit;
        const transaksi = await TransaksiWater.find(query).skip(skip).limit(limit).populate({
            path:'wat',
            model: "Water",
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

    // getTransaksiById: async function(id){
    //     try {
    //         const transaksi = await TransaksiWater.findById(id);
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
            const transaksi = await TransaksiWater.findById(id).populate({
                path:'wat',
                model: "Water",
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

// get trasnsaksi water by ID mobile
getTransaksiByIdWaterMobile: async function(id){
    try {
        const transaksi = await TransaksiWater.findById(id);
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
            const updateTransaksi = await TransaksiWater.findByIdAndUpdate(id, transaksi);
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
            const transaksi = await TransaksiWater.findByIdAndRemove(id);
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
            const transaksi = await TransaksiWater.find().populate({
                path:'wat',
                model: "Water",
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
                if(item.wat.unt._id == id){
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
