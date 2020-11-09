//Controller Deposit

const {addCashBank, findAllCashBank, updateCashBank, deleteCashBank, findByCashBankId} = require("./service");

const { findUserByToken } = require('../controllers/userController');

const fs = require("fs");
const express = require('express');
const app = express();


module.exports = {
    tambahCashBank : async function(req, res, next){
        const cashbank = await addCashBank(req.body);
        if(cashbank){
            return res.status(200).json({"status": "success", "data": cashbank});
        }else{
            return res.status(500).json({"status": "error", "data": "internal server error"});
        }
    },
    listCashBank : async function(req, res, next){
        const str = JSON.parse(req.query.param);
        const allData = await findAllCashBank({}, 1, 0);
        let query = {};
        if(str.filter !== null) query = {voucherno: str.filter.voucherno};
        const listcashbank = await findAllCashBank(query, str.pageNumber, str.limit);
        if(allData){
            return res.status(200).json({"status": "success", "data": listcashbank, "totalCount": allData.length});
        }else{
            return res.status(500).json({"status": "error", "data": "internal server error"});
        }
    },
    editCashBank : async function(req, res, next){
        const upd = await updateCashBank(req.params.id, req.body);
        if(upd){
            return res.status(200).json({"status": "success", "data": upd});
        }else{
            return res.status(500).json({"status": "error", "data": "internal server error"});
        }
    },


    HapusCashBank : async function(req, res, next){
        const del = await deleteCashBank(req.params.id);
        if(del){
            return res.status(200).json({"status": "success", "data": "delete data success"});
        }else{
            return res.status(500).json({"status": "error", "data": "internal server error"});
        }
    },
    getCashBankByID : async function(req, res, next){
        const cashbank = await findByCashBankId(req.params.id);
        if(cashbank){
            return res.status(200).json({"status": "success", "data": cashbank});
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