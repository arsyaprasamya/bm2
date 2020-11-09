const { addGas, deleteGas, findGasById, listGas, updateGas} =  require("./service");

const { listTransaksi} =  require("../transaksi/service");
const ejs = require('ejs');
const QRCode = require('qrcode');
const path = require("path");
const moment = require("moment");
const pdf = require("html-pdf");
const fs = require("fs");
const Gas = require('./model').Gas;
const Ownership = require('../../contract/owner/model').Ownership;
const Lease = require('../../contract/tenant/model').Tenant;
const Transaksi = require('../transaksi/model').TransaksiGas;





async function generateQR(id) {
    try {
        const gas = await findGasById(id);
        var imagestring = await QRCode.toDataURL(gas.nmmtr, { errorCorrectionLevel: 'H', width: "400" });
        return {"imgstr" : imagestring, "gsnm": gas.nmmtr};
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























    addGs: async function(req, res , next){
        try {
            const gas = await addGas(req.body);
            if(gas){
                return res.status(200).json({"status": "success", "data": gas});
            }else{
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        }catch (e) {
            console.log(e);
        }
    },


    listGas:  async function(req, res , next){
        try {
            const str = JSON.parse(req.query.param)
            const dataGas = await listGas({}, 1, 0);
            let query = {};
            if(str.filter !== null) query = {nmmtr: str.filter.nmmtr};
            const gas = await listGas(query, str.page, str.limit);
            if(gas){
                return res.status(200).json({"status": "success", "data": gas, "totalCount": dataGas.length});
            }else{
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        }catch (e) {
            console.log(e);
        }
    },

    findGas:  async function(req, res , next){
        try {
            const gas = await findGasById(req.params.id);
            if(gas){
                return res.status(200).json({"status": "success", "data": gas});
            }else{
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        }catch (e) {
            console.log(e);
        }
    },
    updateGs:  async function(req, res , next){
        try {
            const gas = await updateGas(req.params.id, req.body);
            if(gas){
                return res.status(200).json({"status": "success", "data": gas});
            }else{
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        }catch (e) {
            console.log(e);
        }
    },
    deleteGs:  async function(req, res , next){
        try {
            const gas = await deleteGas(req.params.id);
            if(gas){
                return res.status(200).json({"status": "success", "data": "success delete gas data"});
            }else{
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        }catch (e) {
            console.log(e);
        }
    }
}