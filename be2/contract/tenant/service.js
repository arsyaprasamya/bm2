/**
 *
 * Tenant database services
 */
const mongoose = require('mongoose');
const Tenant = require('./model').Tenant;
const UnitService = require('../../unit/service');

module.exports = {
    addTenant : async function(tenant){
        try {
            const dataTenant = await Tenant.find().populate('unit','-__v');
            let flag = true;
            for (let i = 0; i < dataTenant.length; i++) {
                if (dataTenant[i].unit.id === tenant.unit) {
                    flag = false;
                    break;
                }
            }
            if (flag === false) {
                return false;
            }
            const lease = await new Tenant(tenant).save();
            if(lease){
                return lease;
            } else {
                return false;
            }
        }catch (e) {
            console.log(e);
        }
    },
    findLeaseByParent: async function(id){
        try {
            const lease = await Tenant.find({unit: id}).select("-__v");
            if(lease){
                return lease;
            }else{
                return false;
            }
        }catch (e) {
            console.log(e);
        }
    },
    getTenant: async function(id){
        try {
            const tenant = await Tenant.findById(id).populate('unit','-__v');
            if(tenant){
                return tenant;
            }else{
                return false;
            }
        }catch (e) {
            console.log(e);
        }
    },
    listTenant : async function(query, page = 1, limit = 1000){
        try {
            const skip = (page - 1) * limit;
            let lease;
            if(Object.keys(query).length === 0){
            lease = await Tenant.find(query).skip(skip).limit(limit).populate({
                path: "cstmr",
                model: "Customer",
                select: "-__v"
            }).populate({
                path: "unit",
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
                        }
                    }
                }
            }).sort({$natural:-1});
        }else{
            lease = await Tenant.find().or([
                { 'contract_number': { $regex: `${query.contract_number}` }}]).skip(skip).limit(limit).populate({
                path: "cstmr",
                model: "Customer",
                select: "-__v"
            }).populate({
                path: "unit",
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
                        }
                    }
                }
            }).sort({$natural:-1});
        }
            if(lease){
                return lease;
            }else{
                return false;
            }
        }catch (e) {
            console.log(e);
        }
    },

    //list Tenant Mobile 
    listTenantMobile : async function(query, page = 1, limit = 1000){
        try {
            const skip = (page - 1) * limit;
            // let lease;
            // if(Object.keys(query).length === 0){
            lease = await Tenant.find(query).skip(skip).limit(limit).populate({
                path: "cstmr",
                model: "Customer",
                select: "-__v"
            }).populate({
                path: "unit",
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
                        }
                    }
                }
            }).sort({$natural:-1});

            if(lease){
                return lease;
            
            }else{
                return false;
           }
        
    

        }catch (e) {
            console.log(e);
        }
        
    },

    getContractNumber : async function(unit_id){
        try {
            const month = new Date(Date.now()).getMonth() + 1;
            const year = new Date(Date.now()).getFullYear();
            const fromDate = new Date(year, month, 1);
            const toDate = new Date(fromDate.getFullYear(), fromDate.getMonth() + 1, 0);
            const condition = {"contract_date": {'$gte': fromDate, '$lte': toDate}};
            const ownership = await Tenant.find(condition);
            const unit = await UnitService.listUnitById(unit_id);
            var number = ownership.length + 1;
            console.log(unit);
            return `${unit.untnum}/${unit.flr.cdflr}/${unit.flr.blk.cdblk}/${year}/${('0' + month).slice(-2)}/${('000000' + number).slice(-5)}`;
        }catch (e) {
            console.log(e);
        }
    },
    editTenant : async function(id, tenant){
        try {
            const lease = await Tenant.findByIdAndUpdate(id, tenant);
            if(lease){
                return lease;
            }else{
                return false;
            }
        }catch (e) {
            console.log(e);
        }
    },
    deleteTenant : async function(id){
        try {
            const lease = await Tenant.findByIdAndRemove(id);
            if(lease){
                return lease;
            }else {
                return false;
            }
        }catch (e) {
            console.log(e);
        }
    }
}