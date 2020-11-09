const ejs = require('ejs');
const path = require("path");
const moment = require("moment");
const pdf = require("html-pdf");
const fs = require("fs");
const { addBilling, listBilling, getBillingById, getBillingNumber, deleteBilling, listBillingMobile, getBillingByIdMobile} = require("./service");
const { listTenant } = require("../contract/tenant/service");
const { listUnit } = require("../unit/service");
const { listPower, updatePower } = require("../power/master/service");
const { listWater, updateWater } = require("../water/master/service");
const { listOwnership } = require('../contract/owner/service');
const updateTransaksiwtr = require("../water/transaksi/service").updateTransaksi;
const updateTransaksipwr = require("../power/transaksi/service").updateTransaksi;
const getTransaksiListrik = require("../power/transaksi/service").getTransaksiById;
const getTransaksiAir = require("../water/transaksi/service").getTransaksiById;
const listTransaksiListrik = require("../power/transaksi/service").listTransaksi;
const listTransaksiAir = require("../water/transaksi/service").listTransaksi;
const { Biling } = require('./model');
const Sequence = require("../models/sequence");
const errorHandler = require("../controllers/errorController");

function terbilang(nominal) {
    var bilangan = nominal.toString();
    var kalimat = "";
    var angka = new Array('0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0');
    var kata = new Array('', 'Satu', 'Dua', 'Tiga', 'Empat', 'Lima', 'Enam', 'Tujuh', 'Delapan', 'Sembilan');
    var tingkat = new Array('', 'Ribu', 'Juta', 'Milyar', 'Triliun');
    var panjang_bilangan = bilangan.length;

    /* pengujian panjang bilangan */
    if (panjang_bilangan > 15) {
        kalimat = "-";
    } else {
        /* mengambil angka-angka yang ada dalam bilangan, dimasukkan ke dalam array */
        for (i = 1; i <= panjang_bilangan; i++) {
            angka[i] = bilangan.substr(-(i), 1);
        }

        var i = 1;
        var j = 0;

        /* mulai proses iterasi terhadap array angka */
        while (i <= panjang_bilangan) {
            subkalimat = "";
            kata1 = "";
            kata2 = "";
            kata3 = "";

            /* untuk Ratusan */
            if (angka[i + 2] != "0") {
                if (angka[i + 2] == "1") {
                    kata1 = "Seratus";
                } else {
                    kata1 = kata[angka[i + 2]] + " Ratus";
                }
            }

            /* untuk Puluhan atau Belasan */
            if (angka[i + 1] != "0") {
                if (angka[i + 1] == "1") {
                    if (angka[i] == "0") {
                        kata2 = "Sepuluh";
                    } else if (angka[i] == "1") {
                        kata2 = "Sebelas";
                    } else {
                        kata2 = kata[angka[i]] + " Belas";
                    }
                } else {
                    kata2 = kata[angka[i + 1]] + " Puluh";
                }
            }

            /* untuk Satuan */
            if (angka[i] != "0") {
                if (angka[i + 1] != "1") {
                    kata3 = kata[angka[i]];
                }
            }

            /* pengujian angka apakah tidak nol semua, lalu ditambahkan tingkat */
            if ((angka[i] != "0") || (angka[i + 1] != "0") || (angka[i + 2] != "0")) {
                subkalimat = kata1 + " " + kata2 + " " + kata3 + " " + tingkat[j] + " ";
            }

            /* gabungkan variabe sub kalimat (untuk Satu blok 3 angka) ke variabel kalimat */
            kalimat = subkalimat + kalimat;
            i = i + 3;
            j = j + 1;
        }

        /* mengganti Satu Ribu jadi Seribu jika diperlukan */
        if ((angka[5] == "0") && (angka[6] == "0")) {
            kalimat = kalimat.replace("Satu Ribu", "Seribu");
        }
    }
    console.log(kalimat);
    return kalimat + " Rupiah";
}
function pad(num, size) {
    var s = num + "";
    while (s.length < size) s = "0" + s;
    return s;
  }


module.exports = {
    generateCodeBiling : async function (req, res, next) {
        try {
          const dates = new Date();
          const month = ("0" + (dates.getMonth() + 1)).slice(-2);
          const date = ("0" + dates.getDate()).slice(-2);
          const year = dates.getFullYear().toString().substr(-2);
      
          const sequences = await Sequence.find({
            menu: "billing",
            year: dates.getFullYear(),
          });
      
          const newNumber = pad(sequences[0].sequence, 5);
          const code = "Bill - " + date + month + year + "-" + newNumber;
      
          res.status(200).json({
            status: "success",
            data: code,
          });
        } catch (error) {
          console.error(error);
          return errorHandler(error);
        }
      },


    addBill : async function (req, res, next) {
        try {
          const dates = new Date();
          const createBilling = await Biling.create(req.body);
      
          if (createBilling) {
            const sequences = await Sequence.find({
              menu: "billing",
              year: dates.getFullYear(),
            });
      
            const updateSequence = await Sequence.findByIdAndUpdate(
              { _id: sequences[0]._id },
              { sequence: sequences[0].sequence + 1 }
            );
      
            if (updateSequence) {
              res.status(200).json({
                status: "success",
                data: createBilling,
              });
            }
          } else {
            res.status(500).json({
              status: "error",
              data: "Something Went Wrong",
            });
          }
        } catch (error) {
          console.error(error);
          return errorHandler(error);
        }
    },

    
    listBill: async function (req, res, next) {
        try {
            // const str = JSON.parse(req.query.param);
            const allData = await listBillingMobile({}, 1, 0);
            let query = {};
            if(query !== null) query = {billing_number: query.filter.billing_number};
            const bill = await listBillingMobile(query, pageNumber, limit);
            console.log(allData)
            if (bill) {
                return res.status(200).json({ status: "success", data: bill, "totalCount": allData.length });
            } else {
                return res.status(500).json({ status: "error", data: "internal server error" });
            }
        } catch (e) {
            console.error(e);
            return res.status(500).json({ status: "error", data: "internal server error" });
        }
    },

//list Billing by Mobile
BillingMobilelist: async function (req, res, next) {
    try {
            const str = JSON.parse(req.query.param);
            const allData = await listBillingMobile({}, 1, 0);
            let query = {};
            if(str.query !== null) query = {billing_number: str.filter.billing_number};
            const bill = await listBillingMobile(req.query.param);
            console.log(bill)
            if (bill) {
                return res.status(200).json({ status: "success", data: bill, "totalCount": allData.length });
            } else {
                return res.status(500).json({ status: "error", data: "internal server error" });
            } 
        } catch (e) {
            console.error(e);
            return res.status(500).json({ status: "error", data: "internal server error" });
        }
},
    getBillNumber: async function (req, res, next) {
        try {
            const bill = await getBillingNumber();
            if (bill) {
                return res.status(200).json({ status: "success", data: bill });
            } else {
                return res.status(500).json({ status: "error", data: "internal server error" });
            }
        } catch (e) {
            return res.status(500).json({ status: "error", data: "internal server error" });
        }
    },

    createBilling: async function (req, res, next) {
        try {
            const bill = await getBillingById(req.params.id);
            var detail = null;
            var detailListrik = await getTransaksiListrik(bill.billing.electricity.electric_trans);
            var detailAir = await getTransaksiAir(bill.billing.water.water_trans);
            detail = { electricity: detailListrik, water: detailAir };
            console.log(detail)
            const name = await Date.now();
            ejs.renderFile(path.join(__dirname, './template', "billing.template.ejs"), { billing: bill, moment: moment, detail: detail, terbilang: terbilang }, (err, data) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({ status: "error", data: err });
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
                            var file = `temp/${name}.pdf`;
                            fs.readFile(file, function (err, data) {
                                res.contentType("application/pdf");
                                res.send(data);
                            });
                        }
                    });
                }
            });
        } catch (e) {
            console.log(e)
            return res.status(500).json({ status: "error", data: "internal server error" });
        }
    },
    autoCreateBilling: async function(req, res, next){
        try {
            var splitDate = req.body.date.split("-");
            const unit = await listUnit({}, 1, 0);
            let success = true;
            for (const e of unit) {
                var billing = {};
                const month = parseInt(splitDate[1])-1;
                const year = parseInt(splitDate[0]);
                var fromDate = new Date(year, month, 2);
                var toDate = new Date(fromDate.getFullYear(), fromDate.getMonth() + 1, 0);
                var powermeter = await listPower({unt: e._id}, 1, 0);
                var watermeter = await listWater({unt: e._id}, 1, 0);

                let ownerUnit;
                ownerUnit = await listTenant({unit: e._id}, 1, 0);
                if(ownerUnit.length === 0){
                    ownerUnit = await listOwnership({unit: e._id}, 1, 0)
                }

                if (powermeter.length === 0 || watermeter.length === 0 || ownerUnit.length === 0){
                    console.log(e._id)
                    success = false;
                    continue;
                }
                console.log('powermeter id: '+powermeter[0]._id)
                console.log('watermeter id: '+watermeter[0]._id)
                const lastPower = await listTransaksiListrik({"billmnt": {'$gte': fromDate, '$lte': toDate}, "isPaid" : false, "checker" : true, "pow":powermeter[0]._id}, 1, 0);
                const lastWater = await listTransaksiAir({"billmnt": {'$gte': fromDate, '$lte': toDate},"isPaid" : false, "checker" : true, "wat":watermeter[0]._id}, 1, 0);

                if (lastPower.length === 0 || lastWater.length === 0){
                    success = false;
                    continue;
                }
                billing.unit = e._id;
                billing.billing_number = await getBillingNumber();
                billing.billing = {
                    service_charge: {
                        amount: e.untrt.service_rate * e.untsqr
                    },
                    sinkingfund: {
                        amountsink: e.untrt.sinking_fund * e.untsqr
                    },
                    ipl: {
                        amountipl: (e.untrt.service_rate * e.untsqr) +  (e.untrt.sinking_fund * e.untsqr)
                    },
                    electricity: {
                        electric_trans: lastPower[0]._id,
                    },
                    water: {
                        water_trans: lastWater[0]._id,
                    },
                };
                const date = new Date();
                billing.billed_to = ownerUnit[0].cstmr._id;
                billing.created_date = date;
                billing.billing_date = fromDate;
                billing.due_date = new Date(date.getFullYear(), date.getMonth(), date.getDate()+15);
                const cekbilling = await listBilling({"billing_date": {'$gte': fromDate, '$lte': toDate}, billed_to: ownerUnit[0].cstmr._id}, 1, 0)
                if(cekbilling.length < 1){
                    const bill = await addBilling(billing);
                    if(bill){
                        console.log(lastPower[0]._id, lastWater[0]._id)
                        const updatepwr = await updateTransaksipwr (lastPower[0]._id, {"isPaid": true});
                        const updatewtr = await updateTransaksiwtr (lastWater[0]._id, {"isPaid" : true});
                        success = true;
                    }
                }
                
            }
            if(success){
                return res.status(200).json({status: "success", data: "Generate Billing Success"});
            }
            return res.status(200).json({status: "success", data: "No Data"});
        }catch (e) {
            console.log(e);
            return res.status(500).json({"status": "error", "data": "internal server error"});
        }
    },
    findBillingId: async function (req, res, next) {
        const billing = await getBillingById(req.params.id);
        if (billing) {
            return res.status(200).json({ "status": "success", "data": billing });
        } else {
            return res.status(500).json({ "status": "error", "data": "internal server error" });
        }
    },


//get Billing By ID mobile

findBillingIdMobile: async function (req, res, next) {
    const billing = await getBillingByIdMobile(req.params.id);
    console.log(billing);
    if (billing) {
        return res.status(200).json({ "status": "success", "data": billing });
    } else {
        return res.status(500).json({ "status": "error", "data": "internal server error" });
    }
},

    deleteBilling: async function (req, res, next) {
        const del = await deleteBilling(req.params.id);
        if (del) {
            return res.status(200).json({ "status": "success", "data": "Billing deleted" });
        } else {
            return res.status(500).json({ "status": "error", "data": "internal server error" });
        }
    },
}