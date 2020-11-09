const ejs = require('ejs');
const path = require("path");
const moment = require("moment");
const pdf = require("html-pdf");
const fs = require("fs");
const Sequence = require("../models/sequence");
const errorHandler = require("../controllers/errorController");


const { addBilling, listRentalBilling, getBillingById, getBillingNumber, deleteBilling } = require("./service");
const { RentalBilling } = require('./model');

function pad(num, size) {
    var s = num + "";
    while (s.length < size) s = "0" + s;
    return s;
  }

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


module.exports = {
    generateCodeRentalBiling : async function (req, res, next) {
        try {
          const dates = new Date();
          const month = ("0" + (dates.getMonth() + 1)).slice(-2);
          const date = ("0" + dates.getDate()).slice(-2);
          const year = dates.getFullYear().toString().substr(-2);
      
          const sequences = await Sequence.find({
            menu: "rental",
            year: dates.getFullYear(),
          });
      
          const newNumber = pad(sequences[0].sequence, 5);
          const code = "RB-" + date + month + year + "-" + newNumber;
      
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
          const createBilling = await RentalBilling.create(req.body);
      
          if (createBilling) {
            const sequences = await Sequence.find({
              menu: "rental",
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
            const str = JSON.parse(req.query.param);
            const allData = await listRentalBilling({}, 1, 0);
            let query = {};
            if(str.filter !== null) query = {billingNo: str.filter.billingNo};
            const bill = await listRentalBilling(query, str.pageNumber, str.limit);
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
            const name = await Date.now();
            ejs.renderFile(path.join(__dirname, './template', "billing.template.ejs"), { billing: bill, moment: moment, terbilang: terbilang }, (err, data) => {
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

    generateCodeRentalBiling : async function (req, res, next) {
        try {
          const dates = new Date();
          const month = ("0" + (dates.getMonth() + 1)).slice(-2);
          const date = ("0" + dates.getDate()).slice(-2);
          const year = dates.getFullYear().toString().substr(-2);
      
          const sequences = await Sequence.find({
            menu: "rental",
            year: dates.getFullYear(),
          });
      
          const newNumber = pad(sequences[0].sequence, 5);
          const code = "RB-" + date + month + year + "-" + newNumber;
      
          res.status(200).json({
            status: "success",
            data: code,
          });
        } catch (error) {
          console.error(error);
          return errorHandler(error);
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

    
    deleteBilling: async function (req, res, next) {
        const del = await deleteBilling(req.params.id);
        if (del) {
            return res.status(200).json({ "status": "success", "data": "Billing deleted" });
        } else {
            return res.status(500).json({ "status": "error", "data": "internal server error" });
        }
    },    
}

