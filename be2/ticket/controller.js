const {listTicket, lstTicketById, addTicket, editTicket, deleteTicket, listEngineer, 
      countTicket, listCustomer, listCategory, editStatus, listEngineerByID, listTicketBySPV, 
      listUnit, listUnitByID, GenerateDoCode, listTicketByEngineer, listTicketByUser , 
      listEngineerArr, listDateArr, listTicketOpen, listTicketWaitSchedule, listTicketScheduled,
      listTicketWaitingConf, listTicketCancel, listTicketDone, listTicketdeorder, listTicketdofixed, 
      listTicketReport, listTicketReported, listTicketFixed,listTicketrepfix, listTicketRejected, 
      listTicketVisit, listTicketRes, CountTicketByOpen, CountTicketByWaiting, CountTicketByScheduled,
      CountTicketByRescheduled, CountTicketByRejected, CountTicketByDeorder, CountTicketByVisit,
      CountTicketByFixed, CountTicketByReported, CountTicketByUnreported,  CountTicketByDone,
      CountTicketByNotfinish, listTicketRated, listTicketUnrated} = require("./service");
const {listTenant} = require("../contract/tenant/service");
const {listOwnership} = require("../contract/owner/service");


const ejs = require('ejs');
const path = require("path");
const pdf = require("html-pdf");
const fs = require("fs");
const express = require('express');
const app = express();
const { findByUsername } = require('../services/userService');
const { findUserByToken } = require('../controllers/userController');
const nodemailer = require("nodemailer");

const bcrypt = require('bcryptjs');
const { get } = require("http");
const Ticket = require('./model').Ticket;



function pad(num, size) {
    var s = num+"";
    while (s.length < size) s ="0" + s;
    return s;
}

module.exports = {
    Ticket: async function (req, res, next) {
        try {
            //const list = await listTicket(req.params.filter, req.params.page, req.params.limit);
            var str = JSON.parse(req.query.param);
                const allData = await listTicket({}, 1, 0);
                const ticket = await listTicket({}, str.page, str.limit);
            if (ticket) {
                return res.status(200).json({"status": "success", "data": ticket, "totalCount": allData.length});
            } else {
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        } catch (e) {
            return res.status(500).json({"status": "error", "data": e});
        }
    },
    
    TicketById: async function(req, res, next){
        try {
            const list = await lstTicketById(req.params.id);
            if (list) {
                return res.status(200).json({"status": "success", "data": list});
            } else {
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        }catch (e) {
            return res.status(500).json({"status": "error", "data": e});
        }
    },
    TicketByRated: async function(req, res, next){
        try {
            const list = await listTicketRated(req.params.filter, req.params.page, req.params.limit);
            if (list) {
                return res.status(200).json({"status": "success", "data": list});
            } else {
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        }catch (e) {
            return res.status(500).json({"status": "error", "data": e});
        }
    },
    TicketByUnrated: async function(req, res, next){
        try {
            const list = await listTicketUnrated(req.params.filter, req.params.page, req.params.limit);
            if (list) {
                return res.status(200).json({"status": "success", "data": list});
            } else {
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        }catch (e) {
            return res.status(500).json({"status": "error", "data": e});
        }
    },
    TicketByOpen: async function(req, res, next){
        try {
            const list = await listTicketOpen(req.params.filter, req.params.page, req.params.limit);
            if (list) {
                return res.status(200).json({"status": "success", "data": list});
            } else {
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        }catch (e) {
            return res.status(500).json({"status": "error", "data": e});
        }
    },
    TicketByDone: async function(req, res, next){
        try {
            const list = await listTicketDone(req.params.filter, req.params.page, req.params.limit);
            if (list) {
                return res.status(200).json({"status": "success", "data": list});
            } else {
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        }catch (e) {
            return res.status(500).json({"status": "error", "data": e});
        }
    },
    TicketByCancel: async function(req, res, next){
        try {
            const list = await listTicketCancel(req.params.filter, req.params.page, req.params.limit);
            if (list) {
                return res.status(200).json({"status": "success", "data": list});
            } else {
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        }catch (e) {
            return res.status(500).json({"status": "error", "data": e});
        }
    },
    TicketByRes: async function(req, res, next){
        try {
            const list = await listTicketRes(req.params.filter, req.params.page, req.params.limit);
            if (list) {
                return res.status(200).json({"status": "success", "data": list});
            } else {
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        }catch (e) {
            return res.status(500).json({"status": "error", "data": e});
        }
    },
    TicketByScheduled: async function(req, res, next){
        try {
            const list = await listTicketScheduled(req.params.filter, req.params.page, req.params.limit);
            if (list) {
                return res.status(200).json({"status": "success", "data": list});
            } else {
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        }catch (e) {
            return res.status(500).json({"status": "error", "data": e});
        }
    },
    TicketByVisit: async function(req, res, next){
        try {
            const list = await listTicketVisit(req.params.filter, req.params.page, req.params.limit);
            if (list) {
                return res.status(200).json({"status": "success", "data": list});
            } else {
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        }catch (e) {
            return res.status(500).json({"status": "error", "data": e});
        }
    },
    TicketByReject: async function(req, res, next){
        try {
            const list = await listTicketRejected(req.params.filter, req.params.page, req.params.limit);
            if (list) {
                return res.status(200).json({"status": "success", "data": list});
            } else {
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        }catch (e) {
            return res.status(500).json({"status": "error", "data": e});
        }
    },
    TicketByWaitSchedule: async function(req, res, next){
        try {
            const list = await listTicketWaitSchedule(req.params.filter, req.params.page, req.params.limit);
            if (list) {
                return res.status(200).json({"status": "success", "data": list});
            } else {
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        }catch (e) {
            return res.status(500).json({"status": "error", "data": e});
        }
    },
    TicketByWaitConf: async function(req, res, next){
        try {
            const list = await listTicketWaitingConf(req.params.filter, req.params.page, req.params.limit);
            if (list) {
                return res.status(200).json({"status": "success", "data": list});
            } else {
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        }catch (e) {
            return res.status(500).json({"status": "error", "data": e});
        }
    },
    TicketBydeorder: async function(req, res, next){
        try {
            const list = await listTicketdeorder(req.params.filter, req.params.page, req.params.limit);
            if (list) {
                return res.status(200).json({"status": "success", "data": list});
            } else {
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        }catch (e) {
            return res.status(500).json({"status": "error", "data": e});
        }
    },
    TicketBydofixed: async function(req, res, next){
        try {
            const list = await listTicketdofixed(req.params.filter, req.params.page, req.params.limit);
            if (list) {
                return res.status(200).json({"status": "success", "data": list});
            } else {
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        }catch (e) {
            return res.status(500).json({"status": "error", "data": e});
        }
    },
    TicketByfixed: async function(req, res, next){
        try {
            const list = await listTicketFixed(req.params.filter, req.params.page, req.params.limit);
            if (list) {
                return res.status(200).json({"status": "success", "data": list});
            } else {
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        }catch (e) {
            return res.status(500).json({"status": "error", "data": e});
        }
    },
    TicketByreport: async function(req, res, next){
        try {
            const list = await listTicketReport(req.params.filter, req.params.page, req.params.limit);
            if (list) {
                return res.status(200).json({"status": "success", "data": list});
            } else {
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        }catch (e) {
            return res.status(500).json({"status": "error", "data": e});
        }
    },
    TicketByReported: async function(req, res, next){
        try {
            const list = await listTicketReported(req.params.filter, req.params.page, req.params.limit);
            if (list) {
                return res.status(200).json({"status": "success", "data": list});
            } else {
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        }catch (e) {
            return res.status(500).json({"status": "error", "data": e});
        }
    },
    TicketByreport: async function(req, res, next){
        try {
            const list = await listTicketReport(req.params.filter, req.params.page, req.params.limit);
            if (list) {
                return res.status(200).json({"status": "success", "data": list});
            } else {
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        }catch (e) {
            return res.status(500).json({"status": "error", "data": e});
        }
    },
    TicketByRepFix: async function(req, res, next){
        try {
            const list = await listTicketrepfix(req.params.filter, req.params.page, req.params.limit);
            if (list) {
                return res.status(200).json({"status": "success", "data": list});
            } else {
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        }catch (e) {
            return res.status(500).json({"status": "error", "data": e});
        }
    },
    TicketBySPV: async function(req, res, next){
        try {
            const list = await listTicketBySPV(req.params.filter, req.params.page, req.params.limit);
            if (list) {
                return res.status(200).json({"status": "success", "data": list});
            } else {
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        }catch (e) {
            return res.status(500).json({"status": "error", "data": e});
        }
    },
    TicketByEngineer: async function(req, res, next){
        try {
            const list = await listTicketByEngineer(req.params.filter, req.params.page, req.params.limit);
            if (list) {
                return res.status(200).json({"status": "success", "data": list});
            } else {
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        }catch (e) {
            return res.status(500).json({"status": "error", "data": e});
        }
    },
    TicketByUser: async function(req, res, next){
        try {
            const list = await listTicketByUser(req.params.filter, req.params.page, req.params.limit);
            if (list) {
                return res.status(200).json({"status": "success", "data": list});
            } else {
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        }catch (e) {
            return res.status(500).json({"status": "error", "data": e});
        }
    },
    tambahTicket: async function (req, res, next) {
        try {
            const addTic = await addTicket(req.body);
            if (addTic) {
                return res.status(200).json({"status": "success", "data": addTic});
            } else {
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        } catch (e) {
            return res.status(500).json({"status": "error", "data": e});
        }
    },
    GetEngineerArr: async function(req, res, next){
        try {
            const list = await listEngineerArr(req.params.id);
            if (list) {
                return res.status(200).json({"status": "success", "data": list});
            } else {
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        }catch (e) {
            return res.status(500).json({"status": "error", "data": e});
        }
    },
    GetDateArr: async function(req, res, next){
        try {
            const list = await listDateArr(req.params.id);
            if (list) {
                return res.status(200).json({"status": "success", "data": list});
            } else {
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        }catch (e) {
            return res.status(500).json({"status": "error", "data": e});
        }
    },
    GetCountStatusByOpen: async function(req, res, next){
        try {
            const list = await CountTicketByOpen(req.params.id);
            if (list) {
                return res.status(200).json({"status": "success", "data": list});
            } else {
                return res.status(500).json({"status": "error", "data": "Data not Found!"});
            }
        }catch (e) {
            return res.status(500).json({"status": "error", "data": e});
        }
    },
    GetCountStatusByWaiting: async function(req, res, next){
        try {
            const list = await CountTicketByWaiting(req.params.id);
            if (list) {
                return res.status(200).json({"status": "success", "data": list});
            } else {
                return res.status(500).json({"status": "error", "data": "Data not Found!"});
            }
        }catch (e) {
            return res.status(500).json({"status": "error", "data": e});
        }
    },
    GetCountStatusByScheduled: async function(req, res, next){
        try {
            const list = await CountTicketByScheduled(req.params.id);
            if (list) {
                return res.status(200).json({"status": "success", "data": list});
            } else {
                return res.status(500).json({"status": "error", "data": "Data not Found!"});
            }
        }catch (e) {
            return res.status(500).json({"status": "error", "data": e});
        }
    },
    GetCountStatusByRescheduled: async function(req, res, next){
        try {
            const list = await CountTicketByRescheduled(req.params.id);
            if (list) {
                return res.status(200).json({"status": "success", "data": list});
            } else {
                return res.status(500).json({"status": "error", "data": "Data not Found!"});
            }
        }catch (e) {
            return res.status(500).json({"status": "error", "data": e});
        }
    },
    GetCountStatusByRejected: async function(req, res, next){
        try {
            const list = await CountTicketByRejected(req.params.id);
            if (list) {
                return res.status(200).json({"status": "success", "data": list});
            } else {
                return res.status(500).json({"status": "error", "data": "Data not Found!"});
            }
        }catch (e) {
            return res.status(500).json({"status": "error", "data": e});
        }
    },
    GetCountStatusByDeorder: async function(req, res, next){
        try {
            const list = await CountTicketByDeorder(req.params.id);
            if (list) {
                return res.status(200).json({"status": "success", "data": list});
            } else {
                return res.status(500).json({"status": "error", "data": "Data not Found!"});
            }
        }catch (e) {
            return res.status(500).json({"status": "error", "data": e});
        }
    },
    GetCountStatusByVisit: async function(req, res, next){
        try {
            const list = await CountTicketByVisit(req.params.id);
            if (list) {
                return res.status(200).json({"status": "success", "data": list});
            } else {
                return res.status(500).json({"status": "error", "data": "Data not Found!"});
            }
        }catch (e) {
            return res.status(500).json({"status": "error", "data": e});
        }
    },
    GetCountStatusByFixed: async function(req, res, next){
        try {
            const list = await CountTicketByFixed(req.params.id);
            if (list) {
                return res.status(200).json({"status": "success", "data": list});
            } else {
                return res.status(500).json({"status": "error", "data": "Data not Found!"});
            }
        }catch (e) {
            return res.status(500).json({"status": "error", "data": e});
        }
    },
    GetCountStatusByReported: async function(req, res, next){
        try {
            const list = await CountTicketByReported(req.params.id);
            if (list) {
                return res.status(200).json({"status": "success", "data": list});
            } else {
                return res.status(500).json({"status": "error", "data": "Data not Found!"});
            }
        }catch (e) {
            return res.status(500).json({"status": "error", "data": e});
        }
    },
    GetCountStatusByDone: async function(req, res, next){
        try {
            const list = await CountTicketByDone(req.params.id);
            if (list) {
                return res.status(200).json({"status": "success", "data": list});
            } else {
                return res.status(500).json({"status": "error", "data": "Data not Found!"});
            }
        }catch (e) {
            return res.status(500).json({"status": "error", "data": e});
        }
    },
    GetCountStatusByUnreported: async function(req, res, next){
        try {
            const list = await CountTicketByUnreported(req.params.id);
            if (list) {
                return res.status(200).json({"status": "success", "data": list});
            } if (list = {}) {
                return res.status(500).json({"status": "Error", "data": "internal server error"});
            }
        }catch (e) {
            return res.status(500).json({"status": "error", "data": e});
        }
    },
    GetCountStatusByNotfinish: async function(req, res, next){
        try {
            const list = await CountTicketByNotfinish(req.params.id);
            if (list) {
                return res.status(200).json({"status": "success", "data": list});
            } if (list = {}) {
                return res.status(500).json({"status": "Error", "data": "internal server error"});
            }
        }catch (e) {
            return res.status(500).json({"status": "error", "data": e});
        }
    },
    updateTicket: async function (req, res, next) {
        try {
            const updateTic = await editTicket(req.params.id, req.body);
            if (updateTic) {
                return res.status(200).json({"status": "success", "data": "data updated"});
            } else {
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        } catch (e) {
            return res.status(500).json({"status": "error", "data": e});
        }
    },
    updateStatus: async function (req, res, next) {
        try {
            const updateTic = await editStatus(req.params.id, req.body);
            if (updateTic) {
                return res.status(200).json({"status": "success", "data": "data updated"});
            } else {
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        } catch (e) {
            return res.status(500).json({"status": "error", "data": e});
        }
    },
    hapusTicket: async function (req, res, next) {
        try {
            const hapusTic = await deleteTicket(req.params.id);
            if (hapusTic) {
                return res.status(200).json({"status": "success", "data": "delete data succesfull"});
            } else {
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        } catch (e) {
            return res.status(500).json({"status": "error", "data": e});
        }
    },
    getEngineer : async function (req, res, next) {
        try {
            const engineer = await listEngineer(req.body.filter, req.body.page, req.body.limit);
            if(engineer){
                return res.status(200).json({"status" : "success", "data": engineer});
            }else{
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        }catch (e) {
            console.log(e);
        }
    },
    getEngineerByID : async function (req, res, next) {
        try {
            const engineer = await listEngineerByID(req.params.id);
            if(engineer){
                return res.status(200).json({"status" : "success", "data": engineer});
            }else{
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        }catch (e) {
            console.log(e);
        }
    },
    getCustomer : async function (req, res, next) {
        try {
            const customer = await listCustomer(req.body.filter, req.body.page, req.body.limit);
            if(customer){
                return res.status(200).json({"status" : "success", "data": customer});
            }else{
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        }catch (e) {
            console.log(e);
        }
    },
    getCategory : async function (req, res, next) {
        try {
            const category = await listCategory(req.body.filter, req.body.page, req.body.limit);
            if(category){
                return res.status(200).json({"status" : "success", "data": category});
            }else{
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        }catch (e) {
            console.log(e);
        }
    },
    getUnit : async function (req, res, next) {
        try {
            const unit = await listUnit(req.body.filter, req.body.page, req.body.limit);
            if(unit){
                return res.status(200).json({"status" : "success", "data": unit});
            }else{
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        }catch (e) {
            console.log(e);
        }
    },
    getUnitByID : async function (req, res, next) {
        try {
            const unit = await listUnitByID(req.params.id);
            if(unit){
                return res.status(200).json({"status" : "success", "data": unit});
            }else{
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        }catch (e) {
            console.log(e);
        }
    },
    getUnitCustomer: async function(req, res, next){
        try {
            const costumerTenantUnit = await listTenant({unit: req.params.id}, 1, 1000);
            if(costumerTenantUnit.length == 0){
                const costumerOwnerUnit = await listOwnership({unit: req.params.id}, 1, 1000);
                if(costumerOwnerUnit){
                    return res.status(200).json({status: "status", data:costumerOwnerUnit});
                }else{
                    return res.status(500).json({status: "error", data: "internal server error"});
                }
            }else if (costumerTenantUnit){
                return res.status(200).json({status: "success", data: costumerTenantUnit});
            }else{
                return res.status(500).json({status: "error", data: "internal server error"});
            }
        }catch (e) {
            return res.status(500).json({"status": "error", "data": "internal server error"});
        }
    },
    ticketCodeGenerator: async function(req, res, next){
        try {
            const number = await countTicket(req.params.id);
            if(number){
                res.status(200).json({status: "success", data: number});
            }else{
                res.status(500).json({status: "error", data: "internal server error"});
            }
        }catch (e) {
            res.status(500).json({status: "error", data: e});
        }
    },
    doCodeGenerator: async function(req, res, next){
        try {
            const number = await GenerateDoCode(req.params.id);
            if(number){
                res.status(200).json({status: "success", data: number});
            }else{
                res.status(500).json({status: "error", data: "internal server error"});
            }
        }catch (e) {
            res.status(500).json({status: "error", data: e});
        }
    },
    ExportPDFdeorder:  async function(req, res, next){
        const dord = await lstTicketById(req.params.id);
        const ticket = await Ticket.findById(dord)
        const getEmail = ticket.customer_eml;
        const getTicketID = ticket.id_ticket;
        const subject = "Delivery Order" + " " + "[" + getTicketID + "]";
        
        try {
            const name = await getTicketID;
            ejs.renderFile(path.join(__dirname, './template', "deorder.template.ejs"),{Ticket: dord,}, (err, html) => {
                if (err) {
                    console.log(err);
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
                    app.get('/about', function(req, res) {
                        res.render('pages/about');
                        return html;
                    });
                    pdf.create(html, options).toFile(`temp/${name}.pdf`, function (err, data) {
                        if (err) {
                            res.send(err);
                        } else {
                            var file= `temp/${name}.pdf`;
                            var filename =`${name}.pdf`
                            fs.readFile(file,function(err,data){
                                res.contentType("application/pdf");
                                console.log(filename);
                                let transporter = nodemailer.createTransport({
                                    host: "srv59.niagahoster.com",
                                    port: 465,
                                    secure: true, // true for 465, false for other ports
                                    auth: {
                                      user: 'helpdesk@mgindotech.com', // generated ethereal user
                                      pass: 'mgmp111783', // generated ethereal password
                                    },
                                  });
                                  let info = transporter.sendMail({
                                    from: '"Be Residence" <helpdesk@mgindotech.com>', // sender address
                                    to: getEmail,  // list of receivers
                                    subject: subject,
                                //    text: "Hello Malik, Your Ticket has been created, please waiting for schedule available engineer", // plain text body
                                    html: '<p>Berikut ini kami lampirkan Delivery Order Anda:</p>', // html body
                                    attachments: [{
                                        filename: filename,
                                        path: 'http://localhost:3000/' + filename,
                                        cid: 'unique@kreata.ee' //same cid value as in the html img src
                                    }]
                                  });
                            
                                  res.send(data);
                            //      return res.status(500).json({status: "Sukses", data: "Email Terkirim"})                              
                            });
                            ;
                        }
                    });
                }
            });
        } catch (e) {
            console.log(e)
            return res.status(500).json({status: "error", data: "internal server error"});
        }
    },
    ExportPDFdeorder2:  async function(req, res, next){
        const dord = await lstTicketById(req.params.id);
        
        try {
            const name = await Date.now();
            ejs.renderFile(path.join(__dirname, './template', "deorder2.template.ejs"),{Ticket: dord,}, (err, data) => {
                if (err) {
                    console.log(err);
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
                    app.get('/about', function(req, res) {
                        res.render('pages/about');
                    });
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
        } catch (e) {
            console.log(e)
            return res.status(500).json({status: "error", data: "internal server error"});
        }
    },
    ExportPDFreport: async function(req, res, next){
        const dord = await lstTicketById(req.params.id);
        
        try {
            const name = await Date.now();
            ejs.renderFile(path.join(__dirname, './template', "report.template.ejs"),{Ticket: dord,}, (err, data) => {
                if (err) {
                    console.log(err);
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
                    app.get('/about', function(req, res) {
                        res.render('pages/about');
                    });
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
        } catch (e) {
            console.log(e)
            return res.status(500).json({status: "error", data: "internal server error"});
        }
    },
    ExportPDFimage: async function(req, res, next){
        const dord = await lstTicketById(req.params.id);
        
        try {
            const name = await Date.now();
            ejs.renderFile(path.join(__dirname, './template', "image.template.ejs"),{Ticket: dord,}, (err, data) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({status: "error", data: err});
                } else {
                    let options = {
                        "format": "A7",
                        "orientation": "landscape",
                        "border": {
                            "top": "0.75cm",            // default is 0, units: mm, cm, in, px
                            "right": "0cm",
                            "bottom": "0cm",
                            "left": "0cm"
                        },
                    };
                    app.get('/about', function(req, res) {
                        res.render('pages/about');
                    });
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
        } catch (e) {
            console.log(e)
            return res.status(500).json({status: "error", data: "internal server error"});
        }
    },
    ExportPDFticket: async function(req, res, next){
        const dord = await lstTicketById(req.params.id);
        
        try {
            const name = await Date.now();
            ejs.renderFile(path.join(__dirname, './template', "ticket.template.ejs"),{Ticket: dord,}, (err, data) => {
                if (err) {
                    console.log(err);
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
                    app.get('/about', function(req, res) {
                        res.render('pages/about');
                    });
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
        } catch (e) {
            console.log(e)
            return res.status(500).json({status: "error", data: "internal server error"});
        }
    },
    ExportHTMLresetPassword:   async function(req, res, next){
        const dord = await lstTicketById(req.params.id);
        const ticket = await Ticket.findById(dord)
        const getEmail = ticket.customer_eml;
        try {
        ejs.renderFile(path.join(__dirname, './template', "resetpass.template.ejs"),{Ticket: dord,}, (err, data) => {
            if (err) {
                console.log(err);
                return res.status(500).json({status: "error", data: err});
            } else {
            let transporter = nodemailer.createTransport({
                host: "srv59.niagahoster.com",
                port: 465,
                secure: true, // true for 465, false for other ports
                auth: {
                  user: 'helpdesk@mgindotech.com', // generated ethereal user
                  pass: 'mgmp111783', // generated ethereal password
                },
              });
              let info = transporter.sendMail({
                from: '"Be Residence" <helpdesk@mgindotech.com>', // sender address
                to: getEmail ,  // list of receivers
                subject: "B Management – Reset Password",
            //    text: "Hello Malik, Your Ticket has been created, please waiting for schedule available engineer", // plain text body
                html: data // html body
              });
              return res.status(500).json({status: "Sukses", data: "Email Terkirim"});
            }
        });
            
        } catch (e) {
            console.log(e)
            return res.status(500).json({status: "error", data: "Error coeg"});
        }
    },
    ExportHTMLopen:   async function(req, res, next){
        const dord = await lstTicketById(req.params.id);
        const ticket = await Ticket.findById(dord)
        const getEmail = ticket.customer_eml;
        const getStatus = ticket.status;
        const getTicketID = ticket.id_ticket;
        const subject = "Ticket" + " " + "[" + getTicketID + "]" + " Status " +  "[" + getStatus + "]";
        try {
        ejs.renderFile(path.join(__dirname, './template', "statopen.template.ejs"),{Ticket: dord,}, (err, data) => {
            if (err) {
                console.log(err);
                return res.status(500).json({status: "error", data: err});
            } else {
            let transporter = nodemailer.createTransport({
                host: "srv59.niagahoster.com",
                port: 465,
                secure: true, // true for 465, false for other ports
                auth: {
                  user: 'helpdesk@mgindotech.com', // generated ethereal user
                  pass: 'mgmp111783', // generated ethereal password
                },
              });
              let info = transporter.sendMail({
                from: '"Be Residence" <helpdesk@mgindotech.com>', // sender address
                to: getEmail,  // list of receivers
                subject: subject,
            //    text: "Hello Malik, Your Ticket has been created, please waiting for schedule available engineer", // plain text body
                html: data, // html body
                attachments: [{
                    filename: 'Logo be management-01.png',
                    path: 'http://localhost:3000/Logo be management-01.png',
                    cid: 'unique@kreata.ee' //same cid value as in the html img src
                }]
              });
              return res.status(500).json({status: "Sukses", data: "Email Terkirim"});
            }
        });
            
        } catch (e) {
            console.log(e)
            return res.status(500).json({status: "error", data: "Error coeg"});
        }
    },
    ExportHTMLscheduled:   async function(req, res, next){
        const dord = await lstTicketById(req.params.id);
        const ticket = await Ticket.findById(dord)
        const getEmail = ticket.customer_eml;
        const getStatus = ticket.status;
        const getTicketID = ticket.id_ticket;
        const subject = "Ticket" + " " + "[" + getTicketID + "]" + " Status " +  "[" + getStatus + "]";
        try {
        ejs.renderFile(path.join(__dirname, './template', "statscheduled.template.ejs"),{Ticket: dord,}, (err, data) => {
            if (err) {
                console.log(err);
                return res.status(500).json({status: "error", data: err});
            } else {
            let transporter = nodemailer.createTransport({
                host: "srv59.niagahoster.com",
                port: 465,
                secure: true, // true for 465, false for other ports
                auth: {
                  user: 'helpdesk@mgindotech.com', // generated ethereal user
                  pass: 'mgmp111783', // generated ethereal password
                },
              });
              let info = transporter.sendMail({
                from: '"Be Residence" <helpdesk@mgindotech.com>', // sender address
                to: getEmail ,  // list of receivers
                subject: subject,
            //    text: "Hello Malik, Your Ticket has been created, please waiting for schedule available engineer", // plain text body
                html: data, // html body
                attachments: [{
                    filename: 'Logo be management-01.png',
                    path: 'http://localhost:3000/Logo be management-01.png',
                    cid: 'unique@kreata.ee' //same cid value as in the html img src
                }]
              });
              return res.status(500).json({status: "Sukses", data: "Email Terkirim"});
            }
        });
            
        } catch (e) {
            console.log(e)
            return res.status(500).json({status: "error", data: "Error coeg"});
        }
    },
    ExportHTMLrescheduled: async function(req, res, next){
        const dord = await lstTicketById(req.params.id);
        const ticket = await Ticket.findById(dord)
        const getEmail = ticket.customer_eml;
        const getStatus = ticket.status;
        const getTicketID = ticket.id_ticket;
        const subject = "Ticket" + " " + "[" + getTicketID + "]" + " Status " +  "[" + getStatus + "]";
        try {
        ejs.renderFile(path.join(__dirname, './template', "statrescheduled.template.ejs"),{Ticket: dord,}, (err, data) => {
            if (err) {
                console.log(err);
                return res.status(500).json({status: "error", data: err});
            } else {
            let transporter = nodemailer.createTransport({
                host: "srv59.niagahoster.com",
                port: 465,
                secure: true, // true for 465, false for other ports
                auth: {
                  user: 'helpdesk@mgindotech.com', // generated ethereal user
                  pass: 'mgmp111783', // generated ethereal password
                },
              });
              let info = transporter.sendMail({
                from: '"Be Residence" <helpdesk@mgindotech.com>', // sender address
                to: getEmail ,  // list of receivers
                subject: subject,
            //    text: "Hello Malik, Your Ticket has been created, please waiting for schedule available engineer", // plain text body
                html: data, // html body
                attachments: [{
                    filename: 'Logo be management-01.png',
                    path: 'http://localhost:3000/Logo be management-01.png',
                    cid: 'unique@kreata.ee' //same cid value as in the html img src
                }]
              });
              return res.status(500).json({status: "Sukses", data: "Email Terkirim"});
            }
        });
            
        } catch (e) {
            console.log(e)
            return res.status(500).json({status: "error", data: "Error coeg"});
        }
    },
    ExportHTMLcancel: async function(req, res, next){
        const dord = await lstTicketById(req.params.id);
        const ticket = await Ticket.findById(dord)
        const getEmail = ticket.customer_eml;
        const getStatus = ticket.status;
        const getTicketID = ticket.id_ticket;
        const subject = "Ticket" + " " + "[" + getTicketID + "]" + " Status " +  "[" + getStatus + "]";
        try {
        ejs.renderFile(path.join(__dirname, './template', "statcancel.template.ejs"),{Ticket: dord,}, (err, data) => {
            if (err) {
                console.log(err);
                return res.status(500).json({status: "error", data: err});
            } else {
            let transporter = nodemailer.createTransport({
                host: "srv59.niagahoster.com",
                port: 465,
                secure: true, // true for 465, false for other ports
                auth: {
                  user: 'helpdesk@mgindotech.com', // generated ethereal user
                  pass: 'mgmp111783', // generated ethereal password
                },
              });
              let info = transporter.sendMail({
                from: '"Be Residence" <helpdesk@mgindotech.com>', // sender address
                to: getEmail ,  // list of receivers
                subject: subject,
            //    text: "Hello Malik, Your Ticket has been created, please waiting for schedule available engineer", // plain text body
                html: data, // html body
                attachments: [{
                    filename: 'Logo be management-01.png',
                    path: 'http://localhost:3000/Logo be management-01.png',
                    cid: 'unique@kreata.ee' //same cid value as in the html img src
                }]
              });
              return res.status(500).json({status: "Sukses", data: "Email Terkirim"});
            }
        });
            
        } catch (e) {
            console.log(e)
            return res.status(500).json({status: "error", data: "Error coeg"});
        }
    },
    ExportHTMLdone: async function(req, res, next){
        const dord = await lstTicketById(req.params.id);
        const ticket = await Ticket.findById(dord)
        const getEmail = ticket.customer_eml;
        const getStatus = ticket.status;
        const getTicketID = ticket.id_ticket;
        const subject = "Ticket" + " " + "[" + getTicketID + "]" + " Status " +  "[" + getStatus + "]";
        try {
        ejs.renderFile(path.join(__dirname, './template', "statdone.template.ejs"),{Ticket: dord,}, (err, data) => {
            if (err) {
                console.log(err);
                return res.status(500).json({status: "error", data: err});
            } else {
            let transporter = nodemailer.createTransport({
                host: "srv59.niagahoster.com",
                port: 465,
                secure: true, // true for 465, false for other ports
                auth: {
                  user: 'helpdesk@mgindotech.com', // generated ethereal user
                  pass: 'mgmp111783', // generated ethereal password
                },
              });
              let info = transporter.sendMail({
                from: '"Be Residence" <helpdesk@mgindotech.com>', // sender address
                to: getEmail ,  // list of receivers
                subject: subject,
            //    text: "Hello Malik, Your Ticket has been created, please waiting for schedule available engineer", // plain text body
                html: data, // html body
                attachments: [{
                    filename: 'Logo be management-01.png',
                    path: 'http://localhost:3000/Logo be management-01.png',
                    cid: 'unique@kreata.ee' //same cid value as in the html img src
                }]
              });
              return res.status(500).json({status: "Sukses", data: "Email Terkirim"});
            }
        });
            
        } catch (e) {
            console.log(e)
            return res.status(500).json({status: "error", data: "Error coeg"});
        }
    },
    listUser : async function(req, res, next){
        try {
        errors = {};
        const username = req.body.username;
        const password = req.body.password;
        const user = await findByUsername(username);
        var match = await bcrypt.compare(password, user.password);
            if(match) {
                const getobjectid = user._id
                const ticket = await Ticket.find({ created_by: getobjectid }, function (err, adventure) {});
                if(ticket){
                    res.status(200).json({status: "success", data: ticket});
                    }else{
                        return false;
                    }
            }else{
                return false;
            }
        }catch (e) {
            console.log(e)
        }
    },
    //this controller get user id on user currently login
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
    
    
};