/**
 *
 * Ticket database services
 */
const express = require('express');
const Ticket = require('./model').Ticket;
const Engineer = require('../masterData/engineer/model').Engineer;
const Customer = require('../customer/model').Customer;
const Category = require('../masterData/helpdesk/category/model').Category;
const Rating = require('../rating/model').Rating;
const Unit = require('../unit/model').Unit;

var fs = require('fs');

function pad(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}

var readHTMLFile = function(path, callback) {
    fs.readFile(path, {encoding: 'utf-8'}, function (err, html) {
        if (err) {
            throw err;
            callback(err);
        }
        else {
            callback(null, html);
        }
    });
};


module.exports = {
    listTicket: async function(query, page= 1, limit = 1000){
        try {
            const skip = (page - 1) * limit;
            const ticket = await Ticket.find(query).skip(skip).limit(limit).sort({$natural:-1});
            if(ticket){
                return ticket;
            }else{
                return false;
            }
        }catch (e) {
            console.log(e);
        }
    },
    lstTicketById: async function(id){
        try {
            const ticket = await Ticket.findById(id)
  //          const get = ticket.customer_eml;
            if(ticket){
                return ticket;
            }else{
                return false;
            }
        }catch (e) {
            console.log(e)
        }
    },
    addTicket: async function(tic){
        try {
            const ticket = await new Ticket(tic).save();
            if(ticket){
                return ticket;
            }else {
                return false;
            }
        }catch (e) {
            console.log(e)
        }
    },
    editTicket: async function(id, tic){
        try {
            const ticket = await Ticket.findByIdAndUpdate(id, tic);
            if (ticket){
                return ticket;
            }else{
                return false;
            }
        }catch (e) {
            console.log(e);
        }
    },
    deleteTicket: async function(id){
        try {
            const ticket = await Ticket.findByIdAndRemove(id);
            if(ticket){
                return ticket;
            }else{
                return false;
            }
        }catch (e) {
            console.log(e);
        }

    },
    editStatus: async function(id, tic){
        try {
            const ticket = await Ticket.findByIdAndUpdate(id, tic);
            if (ticket){
                return ticket;
            }else{
                return false;
            }
        }catch (e) {
            console.log(e);
        }
    },
    listEngineer : async function(query, page = 1, limit = 1000){
        try {
            const skip = (page - 1) * limit;
            const engineer = await Engineer.find(query).skip(skip).limit(limit).populate({path:'Engineer'});
            if(engineer){
                return engineer;
            }else{
                return false;
            }
        }catch (e) {
            console.log(e);
        }
    },
    listEngineerArr: async function(id){
        try {
            const list = await Ticket.find( {_id: id}, { engineer_list: 1} )
            if(list){
                return list;
            }else{
                return false;
            }
        }catch (e) {
            console.log(e)
        }
    },
    listDateArr: async function(id){
        try {
            const list = await Ticket.find( {_id: id}, { date_list: 1} )
            if(list){
                return list;
            }else{
                return false;
            }
        }catch (e) {
            console.log(e)
        }
    },
    listEngineerByID : async function(id){
        try {
            const ticket = await Engineer.findById(id)
            if(ticket){
                return ticket;
            }else{
                return false;
            }
        }catch (e) {
            console.log(e)
        }
    },
    listTicketBySPV : async function(tic){
        try {
            const ticket = await Ticket.find({ $or:[ {'status':'Waiting for Schedule'}, 
            {'status':'Waiting for Confirmation'}, {'status' : 'Scheduled'},  {'status':'Fixed'}, 
             {'status':'Done'}, {'status':'Canceled'}, {'status':'Reported'}, {'status':'Rescheduled'},
             {'status':'Report'}  ]}).sort({$natural:-1});
            if(ticket){
                return ticket;
            }else{
                return false;
            }
        }catch (e) {
            console.log(e)
        }
    },
    listTicketRated : async function(tic){
        try {
            const ticket = await Ticket.find({
                $and: [ {rating: {$gt: 0} },{status: 'Done'}
                ]
            }).sort({$natural:-1});
            if(ticket){
                return ticket;
            }else{
                return false;
            }
        }catch (e) {
            console.log(e)
        }
    },
    listTicketUnrated : async function(tic){
        try {
            const ticket = await Ticket.find({
                $and: [
                    { $or: [{rating: 0}] },{status: 'Done'}
                ]
            }).sort({$natural:-1});
            if(ticket){
                return ticket;
            }else{
                return false;
            }
        }catch (e) {
            console.log(e)
        }
    },
    listTicketOpen : async function(tic){
        try {
            const ticket = await Ticket.find({ status: 'Open' }).sort({$natural:-1});
            if(ticket){
                return ticket;
            }else{
                return false;
            }
        }catch (e) {
            console.log(e)
        }
    },
    listTicketRes : async function(tic){
        try {
            const ticket = await Ticket.find({ status: 'Reschedule' }).sort({$natural:-1});
            if(ticket){
                return ticket;
            }else{
                return false;
            }
        }catch (e) {
            console.log(e)
        }
    },
    listTicketFixed : async function(tic){
        try {
            const ticket = await Ticket.find({ status: 'Fixed' }).sort({$natural:-1});
            if(ticket){
                return ticket;
            }else{
                return false;
            }
        }catch (e) {
            console.log(e)
        }
    },
    listTicketWaitSchedule : async function(tic){
        try {
            const ticket = await Ticket.find({ status: 'Waiting for Schedule' }).sort({$natural:-1});
            if(ticket){
                return ticket;
            }else{
                return false;
            }
        }catch (e) {
            console.log(e)
        }
    },
    listTicketdeorder : async function(tic){
        try {
            const ticket = await Ticket.find({ status: 'Scheduled' }).sort({$natural:-1});
            if(ticket){
                return ticket;
            }else{
                return false;
            }
        }catch (e) {
            console.log(e)
        }
    },
    listTicketdofixed : async function(tic){
        try {
            const ticket = await Ticket.find({ $or:[ {'status':'Scheduled'}, 
            {'status':'Fixed'}, {'status':'Reported'}, {'status':'Done'},
            {'status':'Report'}, {'status':'Visit'} ]}).sort({$natural:-1});
            if(ticket){
                return ticket;
            }else{
                return false;
            }
        }catch (e) {
            console.log(e)
        }
    },
    listTicketrepfix : async function(tic){
        try {
            const ticket = await Ticket.find({ $or:[ {'status':'Report'}, {'status':'Reported'}, 
            {'status':'Done'} ]}).sort({$natural:-1});
            if(ticket){
                return ticket;
            }else{
                return false;
            }
        }catch (e) {
            console.log(e)
        }
    },
    listTicketReported : async function(tic){
        try {
            const ticket = await Ticket.find({ status: 'Reported' }).sort({$natural:-1});
            if(ticket){
                return ticket;
            }else{
                return false;
            }
        }catch (e) {
            console.log(e)
        }
    },
    listTicketVisit : async function(tic){
        try {
            const ticket = await Ticket.find({ status: 'Visit' }).sort({$natural:-1});
            if(ticket){
                return ticket;
            }else{
                return false;
            }
        }catch (e) {
            console.log(e)
        }
    },
    listTicketRejected : async function(tic){
        try {
            const ticket = await Ticket.find({ status: 'Rejected' }).sort({$natural:-1});
            if(ticket){
                return ticket;
            }else{
                return false;
            }
        }catch (e) {
            console.log(e)
        }
    },
    listTicketReport : async function(tic){
        try {
            const ticket = await Ticket.find({ status: 'Report' }).sort({$natural:-1});
            if(ticket){
                return ticket;
            }else{
                return false;
            }
        }catch (e) {
            console.log(e)
        }
    },
    listTicketWaitingConf : async function(tic){
        try {
            const ticket = await Ticket.find({ status: 'Waiting for Confirmation' }).sort({$natural:-1});
            if(ticket){
                return ticket;
            }else{
                return false;
            }
        }catch (e) {
            console.log(e)
        }
    },
    listTicketScheduled : async function(tic){
        try {
            const ticket = await Ticket.find({ status: 'Scheduled' }, function (err, adventure) {});
            if(ticket){
                return ticket;
            }else{
                return false;
            }
        }catch (e) {
            console.log(e)
        }
    },
    listTicketDone : async function(tic){
        try {
            const ticket = await Ticket.find({ status: 'Done' }, function (err, adventure) {});
            if(ticket){
                return ticket;
            }else{
                return false;
            }
        }catch (e) {
            console.log(e)
        }
    },
    listTicketCancel : async function(tic){
        try {
            const ticket = await Ticket.find({ status: 'Cancel' }, function (err, adventure) {});
            if(ticket){
                return ticket;
            }else{
                return false;
            }
        }catch (e) {
            console.log(e)
        }
    },
    listTicketByUser : async function(tic){
        try {
            const ticket = await Ticket.find ({ $or:[ {'status':'Open'}, 
            {'status':'Waiting for Confirmation'}, {'status' : 'Scheduled'},  {'status':'Waiting for schedule'}, 
             {'status':'Done'}, {'status':'Canceled'}  ]}, function (err, adventure) {});
            if(ticket){
                return ticket;
            }else{
                return false;
            }
        }catch (e) {
            console.log(e)
        }
    },
    listTicketByEngineer : async function(tic){
        try {
            const ticket = await Ticket.find ({ $or:[ {'status' : 'Scheduled'},  {'status':'Fixed'}, 
             {'status':'Done'}, {'status':'Canceled'}  ]}).sort({$natural:-1});
            if(ticket){
                return ticket;
            }else{
                return false;
            }
        }catch (e) {
            console.log(e)
        }
    },
    listCustomer : async function(query, page = 1, limit = 1000){
        try {
            const skip = (page - 1) * limit;
            const customer = await Customer.find(query).skip(skip).limit(limit).populate({path:'Customer'}).sort({$natural:-1});
            if(customer){
                return customer;
            }else{
                return false;
            }
        }catch (e) {
            console.log(e);
        }
    },
    listCategory : async function(query, page = 1, limit = 1000){
        try {
            const skip = (page - 1) * limit;
            const category = await Category.find(query).skip(skip).limit(limit).populate({path:'Category'}).sort({$natural:-1});
            if(category){
                return category;
            }else{
                return false;
            }
        }catch (e) {
            console.log(e);
        }
    },
    listUnit : async function(query, page = 1, limit = 1000){
        try {
            const skip = (page - 1) * limit;
            const unit = await Unit.find(query).skip(skip).limit(limit).populate({path:'Unit'}).sort({$natural:-1});
            if(unit){
                return unit;
            }else{
                return false;
            }
        }catch (e) {
            console.log(e);
        }
    },
    listUnitByID : async function(id){
        try {
            const unit = await Unit.findById(id)
            if(unit){
                return unit;
            }else{
                return false;
            }
        }catch (e) {
            console.log(e)
        }
    },
    countTicket : async function(val){
        try {
            var a = new Date(); 
            var month = ("0" + (a.getMonth() + 1)).slice(-2); 
            var date = ("0" + a.getDate()).slice(-2); 
            var year = a.getFullYear().toString().substr(-2);
            const ticketCount = await Ticket.countDocuments();
            const newNumber = pad(ticketCount+1,5);
            //var unique = Math.floor(1000 + Math.random() * 9000);
            var code = ('TC-'+ date + month + year + '-' + newNumber);
            return code;
        }catch (e) {
            console.log(e);
        }
    },
    GenerateDoCode : async function(val){
        try {
            var a = new Date(); 
            var month = ("0" + (a.getMonth() + 1)).slice(-2); 
            var date = ("0" + a.getDate()).slice(-2); 
            var year = a.getFullYear().toString().substr(-2);
            const ticketCount = await Ticket.countDocuments();
            const newNumber = pad(ticketCount+1,5);
            //var unique = Math.floor(1000 + Math.random() * 9000);
            var code = ('DO-'+ date + month + year + '-' + newNumber);
            return code;
        }catch (e) {
            console.log(e);
        }
    },
    CountTicketByOpen : async function(){
        try {
            const ticket = await Ticket.count({status : 'Open'})
            if(ticket){
                return ticket;
            }else{
                return false;
            }
        }catch (e) {
            console.log(e);
        }
    },
    CountTicketByOpen : async function(){
        try {
            const ticket = await Ticket.countDocuments({status : 'Open'})
            if(ticket){
                return ticket;
            }else{
                return false;
            }
        }catch (e) {
            console.log(e);
        }
    },
    CountTicketByWaiting : async function(){
        try {
            const ticket = await Ticket.countDocuments({ $or:[ {'status' : 'Scheduled'},  {'status':'Fixed'}]});
            if(ticket){
                return ticket;
            }else{
                return false;
            }
        }catch (e) {
            console.log(e);
        }
    },
    CountTicketByScheduled :async function(){
        try {
            const ticket = await Ticket.countDocuments({status : 'Scheduled'})
            if(ticket){
                return ticket;
            }else{
                return false;
            }
        }catch (e) {
            console.log(e);
        }
    },
    CountTicketByRescheduled :async function(){
        try {
            const ticket = await Ticket.countDocuments({status : 'Rescheduled'})
            if(ticket){
                return ticket;
            }else{
                return false;
            }
        }catch (e) {
            console.log(e);
        }
    },
    CountTicketByRejected :async function(){
        try {
            const ticket = await Ticket.countDocuments({status : 'Rejected'})
            if(ticket){
                return ticket;
            }else{
                return false;
            }
        }catch (e) {
            console.log(e);
        }
    },
    CountTicketByDeorder :async function(){
        try {
            const ticket = await Ticket.countDocuments({status : 'Scheduled'})
            if(ticket){
                return ticket;
            }else{
                return false;
            }
        }catch (e) {
            console.log(e);
        }
    },
    CountTicketByVisit :async function(){
        try {
            const ticket = await Ticket.countDocuments({status : 'Visit'})
            if(ticket){
                return ticket;
            }else{
                return false;
            }
        }catch (e) {
            console.log(e);
        }
    },
    CountTicketByFixed :async function(){
        try {
            const ticket = await Ticket.countDocuments({status : 'Fixed'})
            if(ticket){
                return ticket;
            }else{
                return false;
            }
        }catch (e) {
            console.log(e);
        }
    },
    CountTicketByReported :async function(){
        try {
            const ticket = await Ticket.countDocuments({status : 'Reported'})
            if(ticket){
                return ticket;
            }else{
                return false;
            }
        }catch (e) {
            console.log(e);
        }
    },
    CountTicketByDone :async function(){
        try {
            const ticket = await Ticket.countDocuments({status : 'Done'})
            if(ticket){
                return ticket;
            }else{
                return false;
            }
        }catch (e) {
            console.log(e);
        }
    },
    CountTicketByUnreported :async function(){
        try {
            const reported = await Ticket.countDocuments({status : 'Reported'})
            const fixed = await Ticket.countDocuments({status : 'Fixed'})
            var unreported = fixed - reported;
            if(unreported){
                return unreported;
            }if(unreported = "0"){
                    return "0";
            }else{
                return false;
            }
        }catch (e) {
            console.log(e);
        }
    },
    CountTicketByNotfinish :async function(){
        try {
            const open = await Ticket.countDocuments({status : 'Open'})
            const done = await Ticket.countDocuments({status : 'Done'})
            var notfinish = open - done;
            if(notfinish){
                return notfinish;
            }if(unreported = "0"){
                    return "0";
            }else{
                return false;
            }
        }catch (e) {
            console.log(e);
        }
    }
      
       
    
}