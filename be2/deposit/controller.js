//Controller Deposit

const {addDeposit, findAllDeposit, updateDeposit, deleteDeposit, findByDepositId, GenerateInvCode, findAllDepositMobile, addDepositMobile, updateDepositMobile, deleteDepositMobile, findByDepositMobile} = require("./service");

const { findUserByToken } = require('../controllers/userController');
// const User = require("../../models/user");
const ejs = require('ejs');
const path = require("path");
const pdf = require("html-pdf");
const moment = require("moment");
const fs = require("fs");
const express = require('express');
const user = require("../models/user");
const app = express();

function terbilang (nominal){
    var bilangan=nominal.toString();
    var kalimat="";
    var angka   = new Array('0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0');
    var kata    = new Array('','Satu','Dua','Tiga','Empat','Lima','Enam','Tujuh','Delapan','Sembilan');
    var tingkat = new Array('','Ribu','Juta','Milyar','Triliun');
    var panjang_bilangan = bilangan.length;

    /* pengujian panjang bilangan */
    if(panjang_bilangan > 15){
        kalimat = "Diluar Batas";
    }else{
        /* mengambil angka-angka yang ada dalam bilangan, dimasukkan ke dalam array */
        for(i = 1; i <= panjang_bilangan; i++) {
            angka[i] = bilangan.substr(-(i),1);
        }

        var i = 1;
        var j = 0;

        /* mulai proses iterasi terhadap array angka */
        while(i <= panjang_bilangan){
            subkalimat = "";
            kata1 = "";
            kata2 = "";
            kata3 = "";

            /* untuk Ratusan */
            if(angka[i+2] != "0"){
                if(angka[i+2] == "1"){
                    kata1 = "Seratus";
                }else{
                    kata1 = kata[angka[i+2]] + " Ratus";
                }
            }

            /* untuk Puluhan atau Belasan */
            if(angka[i+1] != "0"){
                if(angka[i+1] == "1"){
                    if(angka[i] == "0"){
                        kata2 = "Sepuluh";
                    }else if(angka[i] == "1"){
                        kata2 = "Sebelas";
                    }else{
                        kata2 = kata[angka[i]] + " Belas";
                    }
                }else{
                    kata2 = kata[angka[i+1]] + " Puluh";
                }
            }

            /* untuk Satuan */
            if (angka[i] != "0"){
                if (angka[i+1] != "1"){
                    kata3 = kata[angka[i]];
                }
            }

            /* pengujian angka apakah tidak nol semua, lalu ditambahkan tingkat */
            if ((angka[i] != "0") || (angka[i+1] != "0") || (angka[i+2] != "0")){
                subkalimat = kata1+" "+kata2+" "+kata3+" "+tingkat[j]+" ";
            }

            /* gabungkan variabe sub kalimat (untuk Satu blok 3 angka) ke variabel kalimat */
            kalimat = subkalimat + kalimat;
            i = i + 3;
            j = j + 1;
        }

        /* mengganti Satu Ribu jadi Seribu jika diperlukan */
        if ((angka[5] == "0") && (angka[6] == "0")){
            kalimat = kalimat.replace("Satu Ribu","Seribu");
        }
    }
    console.log(kalimat);
    return kalimat+" Rupiah";
}

module.exports = {
    tambahDeposit : async function(req, res, next){
        const deposit = await addDeposit(req.body);
        if(deposit){
            return res.status(200).json({"status": "success", "data": deposit});
        }else{
            return res.status(500).json({"status": "error", "data": "internal server error"});
        }
    },
    listDeposit : async function(req, res, next){
        const str = JSON.parse(req.query.param);
        const allData = await findAllDeposit({}, 1, 0);
        let query = {};
        if(str.filter !== null) query = {depositno: str.filter.depositno};
        const listdeposit = await findAllDeposit(query, str.pageNumber, str.limit);
        if(listdeposit){
            return res.status(200).json({"status": "success", "data": listdeposit, "totalCount": allData.length});
        }else{
            return res.status(500).json({"status": "error", "data": "internal server error"});
        }
    },
    
    editDeposit : async function(req, res, next){
        const upd = await updateDeposit(req.params.id, req.body);
        if(upd){
            return res.status(200).json({"status": "success", "data": upd});
        }else{
            return res.status(500).json({"status": "error", "data": "internal server error"});
        }
    },

    HapusDeposit : async function(req, res, next){
        const del = await deleteDeposit(req.params.id);
        if(del){
            return res.status(200).json({"status": "success", "data": "success delete power data"});
        }else{
            return res.status(500).json({"status": "error", "data": "internal server error"});
        }
    },
    getDepositByID : async function(req, res, next){
        const deposit = await findByDepositId(req.params.id);
        if(deposit){
            return res.status(200).json({"status": "success", "data": deposit});
        }else{
            return res.status(500).json({"status": "error", "data": "internal server error"});
        }
    },
    InvCodeGenerator: async function(req, res, next){
        try {
            const number = await GenerateInvCode(req.params.id);
            if(number){
                res.status(200).json({status: "success", data: number});
            }else{
                res.status(500).json({status: "error", data: "internal server error"});
            }
        }catch (e) {
            res.status(500).json({status: "error", data: e});
        }
    },

    DepoOutCodeGenerator: async function(req, res, next){
        try {
            const number = await GenerateDepositOutCode(req.params.id);
            if(number){
                res.status(200).json({status: "success", data: number});
            }else{
                res.status(500).json({status: "error", data: "internal server error"});
            }
        }catch (e) {
            res.status(500).json({status: "error", data: e});
        }
    },

    // ExportPDFinvoice:  async function(req, res, next){
    //     const dord = await findByDepositId(req.params.id);
        
    //     try {
    //         const name = await Date.now();
    //         ejs.renderFile(path.join(__dirname, './template', "invoice.template.ejs"),{Inv: dord, moment: moment , terbilang: terbilang}, (err, data) => {
    //             if (err) {
    //                 console.log(err);
    //                 return res.status(500).json({status: "error", data: err});
    //             } else {
    //                 let options = {
    //                     "height": "7in",
    //                     "width": "9in",
    //                    // "format": "Letter",
    //                     "orientation": "landscape",
    //                     "border": {
    //                         "top": "2cm",            // default is 0, units: mm, cm, in, px
    //                         "right": "1cm",
    //                         "bottom": "1cm",
    //                         "left": "1.5cm"
    //                     },
    //                 };
    //                 app.get('/about', function(req, res) {
    //                     res.render('pages/about');
    //                 });
    //                 pdf.create(data, options).toFile(`temp/${name}.pdf`, function (err, data) {
    //                     if (err) {
    //                         res.send(err);
    //                     } else {
    //                        var file= `temp/${name}.pdf`;
    //                         fs.readFile(file,function(err,data){
    //                             res.contentType("application/pdf");
    //                             res.send(data);
    //                         });
    //                     }
    //                 });
    //             }
    //         });
    //     } catch (e) {
    //         console.log(e)
    //         return res.status(500).json({status: "error", data: "internal server error"});
    //     }
    // },
    // ExportPDFinvoice2:  async function(req, res, next){
    //     const dord = await findByDepositId(req.params.id);
        
    //     try {
    //         const name = await Date.now();
    //         ejs.renderFile(path.join(__dirname, './template', "invoice2.template.ejs"),{Inv: dord, moment: moment , terbilang: terbilang}, (err, data) => {
    //             if (err) {
    //                 console.log(err);
    //                 return res.status(500).json({status: "error", data: err});
    //             } else {
    //                 let options = {
    //                     "height": "7in",
    //                     "width": "9in",
    //                    // "format": "Letter",
    //                     "orientation": "landscape",
    //                     "border": {
    //                         "top": "2cm",            // default is 0, units: mm, cm, in, px
    //                         "right": "1cm",
    //                         "bottom": "1cm",
    //                         "left": "1.5cm"
    //                     },
    //                 };
    //                 app.get('/about', function(req, res) {
    //                     res.render('pages/about');
    //                 });
    //                 pdf.create(data, options).toFile(`temp/${name}.pdf`, function (err, data) {
    //                     if (err) {
    //                         res.send(err);
    //                     } else {
    //                        var file= `temp/${name}.pdf`;
    //                         fs.readFile(file,function(err,data){
    //                             res.contentType("application/pdf");
    //                             res.send(data);
    //                         });
    //                     }
    //                 });
    //             }
    //         });
    //     } catch (e) {
    //         console.log(e)
    //         return res.status(500).json({status: "error", data: "internal server error"});
    //     }
    // },


    //mobile

    listDepositMobile : async function(req, res, next){
        const list = await findAllDepositMobile(req.params.filter, req.params.page, req.params.limit);
        if(list){
            return res.status(200).json({"status": "success", "data": list, "totalCount": list.length});
        }else{
            return res.status(500).json({"status": "error", "data": "internal server error"});
        }
    },

    tambahDepositMobile : async function(req, res, next){
        const deposit = await addDepositMobile(req.body);
        if(deposit){
            return res.status(200).json({"status": "success", "data": deposit});
        }else{
            return res.status(500).json({"status": "error", "data": "internal server error"});
        }
    },

    editDepositMobile : async function(req, res, next){
        const upd = await updateDepositMobile(req.params.id, req.body);
        if(upd){
            return res.status(200).json({"status": "success", "data": upd});
        }else{
            return res.status(500).json({"status": "error", "data": "internal server error"});
        }
    },

    getDepositByIdMobile: async function(req, res, next){
        const deposit = await findByDepositMobile(req.params.id);
        if(deposit){
            console.log(deposit);
            return res.status(200).json({"status": "success", "data": deposit, "totalCount": deposit.length});
        }else{
            return res.status(500).json({"status": "error", "data": "internal server error"});
        }
    },

    HapusDepositMobile : async function(req, res, next){
        const del = await deleteDepositMobile(req.params.id);
        if(del){
            return res.status(200).json({"status": "success", "data": "delete success!"});
        }else{
            return res.status(500).json({"status": "error", "data": "internal server error"});
        }
    },

    getDepositByID : async function(req, res, next){
        const deposit = await findByDepositId(req.params.id);
        if(deposit){
            return res.status(200).json({"status": "success", "data": deposit});
        }else{
            return res.status(500).json({"status": "error", "data": "internal server error"});
        }
    },

    GetUser : async function (req, res, next) {
        try {
        errors = {};
        const username = req.body.username;
        const password = req.body.password;
    //    const user = await findByUsername(username);
        const userr = await findUserByToken(req, res, next);
    //    var match = await bcrypt.compare(password, user.password);
            if(userr) {
    //        const getobjectid = userr._id;
     //       const getUsername = userr.username;
    //        const getFirstName = userr.first_name;
    //        const getLastName = userr.last_name;
    //        const final = {
    //            objectid: getobjectid, 
  //              uname: getUsername, 
  //              firstname: getFirstName,
  //              lastname: getLastName
    //        }
                return res.status(200).json({"status": "success", "data": userr});
            }else {
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        } catch (e) {
            return res.status(500).json({"status": "error", "data": 'Your session has expired'});
        }
    }
}