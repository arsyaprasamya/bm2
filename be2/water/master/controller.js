const ejs = require('ejs');
const QRCode = require('qrcode');
const path = require("path");
const moment = require("moment");
const pdf = require("html-pdf");
const fs = require("fs");
const { addWater, deleteWater, findWaterById, listWater, updateWater} =  require("./service");
const { listTransaksi} =  require("../transaksi/service");
const Water = require('./model').Water;
const Ownership = require('../../contract/owner/model').Ownership;
const Lease = require('../../contract/tenant/model').Tenant;
const Transaksi = require('../transaksi/model').TransaksiWater;


async function generateQR(id) {
    try {
        const water = await findWaterById(id);
        var imagestring = await QRCode.toDataURL(water.nmmtr, { errorCorrectionLevel: 'H', width: "400" });
        return {"imgstr" : imagestring, "wtnm": water.nmmtr};
    }catch (e) {
        console.log(e);
        return false;
    }
}


module.exports = {
    createQR : function(req, res, next){
        try {
            Promise.all(req.body.map(async e => {
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
    addWtr: async function(req, res , next){
        try {
            const water = await addWater(req.body);
            if(water){
                return res.status(200).json({"status": "success", "data": water});
            }else{
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        }catch (e) {
            console.log(e);
        }
    },
    
    // listPwr:  async function(req, res , next){
    //     try {
    //         const str = JSON.parse(req.query.param);
    //         const allData = await listPower({}, 1, 0);

    //         let query = {};
    //         if(str.filter !== null) query={nmmtr: str.filter.nmmtr};
    //         const power = await listPower(query, str.page, str.limit);

    //         if(power){
    //             return res.status(200).json({"status": "success", "data": power, "totalCount": allData.length});
    //         }else{
    //             return res.status(500).json({"status": "error", "data": "internal server error"});
    //         }
    //     }catch (e) {
    //         console.log(e);
    //     }
    // },

    listWtr:  async function(req, res , next){
        try {
            const str = JSON.parse(req.query.param);
            const allData = await listWater({}, 1, 0);

            let query = {};
            if(str.filter !== null) query={nmmtr: str.filter.nmmtr};
            const water = await listWater(query, str.page, str.limit);
            if(water){
                return res.status(200).json({"status": "success", "data": water, "totalCount": allData.length});
            }else{
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        }catch (e) {
            console.log(e);
        }
    },
    


    findWater:  async function(req, res , next){
        try {
            const month = new Date().getMonth() + 1;
            const year = new Date().getFullYear();
            var fromDate = new Date(year, month-1, 1);
            var toDate = new Date(fromDate.getFullYear(), fromDate.getMonth() + 1, 0)
            const water = await findWaterById(req.params.id);
            const lastWater = await listTransaksi({"billmnt": {'$gte': fromDate, '$lte': toDate}, "wat":req.params.id}, 1, 0);
            if(water){
                return res.status(200).json({"status": "success", "data": water, "lastConsumtion": lastWater[0]});
            }else{
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        }catch (e) {
            console.log(e);
        }
    },
    updateWtr:  async function(req, res , next){
        try {
            const water = await updateWater(req.params.id, req.body);
            if(water){
                return res.status(200).json({"status": "success", "data": water});
            }else{
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        }catch (e) {
            console.log(e);
        }
    },
    deleteWtr:  async function(req, res , next){
        try {
            const water = await deleteWater(req.params.id);
            if(water){
                return res.status(200).json({"status": "success", "data": "success delete water data"});
            }else{
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        }catch (e) {
            console.log(e);
        }
    }
}