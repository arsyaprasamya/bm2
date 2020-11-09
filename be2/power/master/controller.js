const ejs = require('ejs');
const QRCode = require('qrcode');
const path = require("path");
const moment = require("moment");
const pdf = require("html-pdf");
const fs = require("fs");
const { addPower, deletePower, findPowerById, listPower, updatePower,addPowerMobile, } =  require("./service");
const { listTransaksi } =  require("../transaksi/service");
const Power = require('./model').Power;
const Ownership = require('../../contract/owner/model').Ownership;
const Lease = require('../../contract/tenant/model').Tenant;
const Transaksi = require('../transaksi/model').TransaksiPower;

async function generateQR(id) {
    try {
        const power = await findPowerById(id);
        var imagestring = await QRCode.toDataURL(power.nmmtr, { errorCorrectionLevel: 'H', width: "400" });
        return {"imgstr" : imagestring, "pwnm": power.nmmtr};
    }catch (e) {
        return false;
    }
}

//generate QR by Mobile


module.exports = {
    addPwr: async function(req, res , next){
        try {
            const power = await addPower(req.body);
            if(power){
                return res.status(200).json({"status": "success", "data": power});
            }else{
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        }catch (e) {
            console.log(e);
        }
    },

//generate QR by Mobile
generateQRmobile: async function(req, res, next){
    try {
        const power = await generateQR(id);
        if(power){
            res.status(200).json({status: "success", data: power});
        }else{
            res.status(500).json({status: "error", data: "internal server error"});
        }
    }catch (e) {
        res.status(500).json({status: "error", data: e});
    }
},

//addPower in Mobile
addPwrMobile: async function(req, res , next){
    try {
        const power = await addPowerMobile(req.body);
        if(power){
            return res.status(200).json({"status": "success", "data": power});
        }else{
            return res.status(500).json({"status": "error", "data": "internal server error"});
        }
    }catch (e) {
        console.log(e);
    }
},
    createQR : function(req, res, next){
        try {
            Promise.all(req.body.map(async e => {
                return generateQR(e);
            })).then(async qrstr => {
                console.log(generateQR);
                const name = await Date.now();
                ejs.renderFile(path.join(__dirname, './template', "qrprint.template.ejs"), {qrimages: qrstr}, (err, data) => {
                    if (err) {
                        return res.status(500).json({status: "errorrrr", data: err});
                    } else {
                        let options = {
                            "format": "A4",
                            "orientation": "portrait",
                            "border": {
                                "top": "1cm",            // default is 0, units: mm, cm, in, px
                                "right": "2cm",
                                "bottom": "1cm",
                                "left": "1cm"
                            },
                        };
                        pdf.create(data, options).toFile(`temp/${name}.pdf`, function (err, data) {
                            if (err) {
                                res.send(err);
                            } else {
                                var file= `temp/${name}.pdf`;
                                fs.readFile(file,function(err,data){
                                    res.contentType("application/pdf");
                                    res.send(data);
                                });
                            }
                        });
                    }
                });
            }).catch(e => {
                return res.status(500).json({"status": 'error1', "data":e});
            });
        }catch (e) {
            return res.status(500).json({"status": "error2", "data": e});
        }
    },
// <<<<<<< HEAD

//create QR using Mobile
createQRmobile : function(req, res, next){
    try {
                Promise.all(req.res.map(async e => {
            return generateQR(e);
        })).then(async qrstr => {
            console.log(qrstr)
            const name = await Date.now();
            ejs.renderFile(path.join(__dirname, './template', "qrprint.template.ejs"), {qrimages: qrstr}, (err, data) => {
                if (err) {
                    return res.status(500).json({status: "error", data: err});
                } else {
                    let options = {
                        "format": "A4",
                        "orientation": "portrait",
                        "border": {
                            "top": "1cm",            // default is 0, units: mm, cm, in, px
                            "right": "2cm",
                            "bottom": "1cm",
                            "left": "1cm"
                        },
                    };
                    pdf.create(data, options).toFile(`temp/${name}.pdf`, function (err, data) {
                        if (err) {
                            res.send(err);
                        } else {
                            var file= `temp/${name}.pdf`;
                            fs.readFile(file,function(err,data){
                                res.contentType("application/pdf");
                                res.send(data);
                            });
                        }
                    });
                }
            });
        }).catch(e => {
            return res.status(500).json({"status": 'error', "data":e});
        });
    }catch (e) {
        return res.status(500).json({"status": "error", "data": e});
    }
},

    listPwr:  async function(req, res , next){
        try {
            const page = parseInt(req.query.pageNumber);
            const limit = parseInt(req.query.limit);
            const skip = (page - 1) * limit;
            let allData = await Power.countDocuments();

    // listPwr:  async function(req, res , next){
    //     try {
    //         const page = parseInt(req.query.pageNumber);
    //         const limit = parseInt(req.query.limit);
    //         const skip = (page - 1) * limit;
            // let allData = await Power.countDocuments();


            let doc = Power.find()
            .skip(skip)
            .limit(limit)
            .populate({
                path: "unt",
                model: "Unit",
                select: "-__v",
                populate: {
                    path: "flr",
                    model: "Floor",
                    select: "-__v",
                    populate: {
                        path: "blk",
                        model: "Block",
                        select: "-__v",
                        populate: {
                            path: "grpid",
                            model: "BlockGroup",
                            select: "-__v",
                        },
                    },
                },
            })
            .populate("rte", "-__v")
            .select("-__v")
            .lean()
            .sort({ $natural: -1 });

            if(req.query.search !== null && req.query.search !== undefined && req.query.search !== ""){
                doc = doc.or([
                    { nmmtr: { $regex: req.query.search } },
                ]);
            }
            let data = await doc;

            for (let i = 0; i < data.length; i++) {
                const dataOwnership = await Ownership.findOne({unit: data[i].unt._id}).lean();
                if (dataOwnership) {
                    let idContract = dataOwnership._id;
                    let startMeter = dataOwnership.start_electricity_stand;
                    const dataLease = await Lease.findOne({unit: data[i].unt._id});
                    if (dataLease) {
                        idContract = dataLease._id;
                        startMeter = dataLease.start_electricity_stand;
                    }
                    data[i].contract = idContract;
                    const dataTransaksi = await Transaksi.findOne({contract: idContract, isPaid: true, checker: true}, null, {sort: {cratedDate: -1 }});
                    if (dataTransaksi) {
                        data[i].startMeter = dataTransaksi.endpos;
                    }else{
                        data[i].startMeter = startMeter;
                    }
                }
            }

            if(data){
                if(req.query.search !== null && req.query.search !== undefined && req.query.search !== ""){
                    allData = data.length;
                }
                return res.status(200).json({"status": "success", data, "totalCount": allData});
            }else{
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        }catch (e) {
            console.error(e);
            return res.status(500).json({"status": "error", "data": "internal server error"});
        }
    },

    listPwr:  async function(req, res , next){
        try {
            const str = JSON.parse(req.query.param);
            const allData = await listPower({}, 1, 0);

            let query = {};
            if(str.filter !== null) query={nmmtr: str.filter.nmmtr};
            const power = await listPower(query, str.page, str.limit);

            if(power){
                return res.status(200).json({"status": "success", "data": power, "totalCount": allData.length});
            }else{
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        }catch (e) {
            console.log(e);
        }
    },

//list Power By Mobile
listPwrMobile:  async function(req, res , next){
    try {
        const page = parseInt(req.query.pageNumber);
        const limit = parseInt(req.query.limit);
        const skip = (page - 1) * limit;
        let allData = await Power.countDocuments();

        let doc = Power.find()
        .skip(skip)
        .limit(limit)
        .populate({
            path: "unt",
            model: "Unit",
            select: "-__v",
            populate: {
                path: "flr",
                model: "Floor",
                select: "-__v",
                populate: {
                    path: "blk",
                    model: "Block",
                    select: "-__v",
                    populate: {
                        path: "grpid",
                        model: "BlockGroup",
                        select: "-__v",
                    },
                },
            },
        })
        .populate("rte", "-__v")
        .select("-__v")
        .lean()
        .sort({ $natural: -1 });

        // if(req.query.search !== null && req.query.search !== undefined && req.query.search !== ""){
        //     doc = doc.or([
        //         { nmmtr: { $regex: req.query.search } },
        //     ]);
        // }
        let data = await doc;

        // for (let i = 0; i < data.length; i++) {
            const dataOwnership = await Ownership.findOne({unit: data.unt._id}).lean();
            if (dataOwnership) {
                let idContract = dataOwnership._id;
                let startMeter = dataOwnership.start_electricity_stand;
                const dataLease = await Lease.findOne({unit: data.unt._id});
                if (dataLease) {
                    idContract = dataLease._id;
                    startMeter = dataLease.start_electricity_stand;
                }
                data[i].contract = idContract;
                const dataTransaksi = await Transaksi.findOne({contract: idContract, isPaid: true, checker: true}, null, {sort: {cratedDate: -1 }});
                if (dataTransaksi) {
                    data[i].startMeter = dataTransaksi.endpos;
                }else{
                    data[i].startMeter = startMeter;
                }
            }
        

        if(data){
            if(req.query.search !== null && req.query.search !== undefined && req.query.search !== ""){
                allData = data.length;
            }
            return res.status(200).json({"status": "success", data, "totalCount": allData});
        }else{
            return res.status(500).json({"status": "error", "data": "internal server error"});
        }
    }catch (e) {
        console.error(e);
        return res.status(500).json({"status": "error", "data": "internal server error"});
    }
},

    findPower:  async function(req, res , next){
        try {
            //const month = 3 + 1;
            const month = new Date().getMonth() + 1;
            const year = new Date().getFullYear();
            var fromDate = new Date(year, month-1, 2);
            var toDate = new Date(fromDate.getFullYear(), fromDate.getMonth() + 1, 0)
            var power = await findPowerById(req.params.id);
            const lastPower = await listTransaksi({"billmnt": {'$gte': fromDate, '$lte': toDate}, "pow":req.params.id}, 1, 0);
            if(power){
                return res.status(200).json({"status": "success", "data": power, "lastConsumtion": lastPower[0]});
            }else{
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        }catch (e) {
            console.log(e);
        }
    },
    updatePwr:  async function(req, res , next){
        try {
            const power = await updatePower(req.params.id, req.body);
            if(power){
                return res.status(200).json({"status": "success", "data": power});
            }else{
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        }catch (e) {
            console.log(e);
        }
    },
    deletePwr:  async function(req, res , next){
        try {
            const power = await deletePower(req.params.id);
            if(power){
                return res.status(200).json({"status": "success", "data": "success delete power data"});
            }else{
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        }catch (e) {
            console.log(e);
        }
    }
}