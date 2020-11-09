/**
 *
 * Tenant database services
 */
const mongoose = require('mongoose');
const Ownership = require('./model').Ownership;
const UnitService = require('../../unit/service');

module.exports = {


    
    addOwnership : async function(ownership){
        try {
            const owner = await new Ownership(ownership).save();
            if(owner){
                const data = await Customer.findOneAndUpdate(
                    {_id : ownership.cstmr },
                    { $set : 
                        { cstrmrpid : ownership.ktp,
                          npwp : ownership.npwp},
                    }
                );
                if (data) {
                    return owner; 
                }else {
                    return false;
                }
            } else {
                return false;
            }
        }catch (e) {
            console.log(e);
        }
    },

    findOwnershipByParent: async function(id){
        try {
            const owner = await Ownership.find({unit: id}).select("-__v");
            if(owner){
                return owner;
            }else{
                return false;
            }
        }catch (e) {
            console.log(e);
        }
    },

    getOwnership: async function(id){
        try {
            const owner = await Ownership.findById(id).populate({
                path: "cstmr",
                model: "Customer",
                select: "-__v",
                populate: {
                    path: "idvllg",
                    model: "Village",
                    populate: {
                        path: "district",
                        populate: {
                            path: "regency",
                            populate: {
                                path: "province"
                            }
                        }
                    }
                }   
            });

            if(owner){
                return owner;
            }else{
                return false;
            }
        }catch (e) {
            console.log(e);
        }
    },
    listOwnership : async function(query, page = 1, limit = 1000){
        try {
            const skip = (page - 1) * limit;
            let owner;
            if(Object.keys(query).length === 0){
            owner = await Ownership.find(query).skip(skip).limit(limit).populate({
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
            }).populate({
                path: "idvllg",
                model: "Village",
                populate: {
                    path: "district",
                    populate: {
                        path: "regency",
                        populate: {
                            path: "province"
                        }
                    }
                }
            }).sort({$natural:-1});
        }else{
            owner = await Ownership.find().or([
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
            }).populate({
                path: "idvllg",
                model: "Village",
                populate: {
                    path: "district",
                    populate: {
                        path: "regency",
                        populate: {
                            path: "province"
                        }
                    }
                }
            }).
            sort({$natural:-1});
        }
            if(owner){
                return owner;
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
            const ownership = await Ownership.find(condition);
            const unit = await UnitService.listUnitById(unit_id);
            var number = ownership.length + 1;
            console.log(unit);
            return `${unit.untnum}/${unit.flr.cdflr}/${unit.flr.blk.cdblk}/${year}/${('0' + month).slice(-2)}/${('000000' + number).slice(-5)}`;
        }catch (e) {
            console.log(e);
        }
    },


    editOwnership : async function(id, tenant){
        try {
            const ownership = await Ownership.findByIdAndUpdate(id, tenant);

            if(ownership){
                const data = { cstrmrpid : tenant.ktp,
                                npwp : tenant.npwp }

                const updateCstmr =  await Customer.findOneAndUpdate(
                    {_id : tenant.cstmr}, data
                )
                if (updateCstmr){
                    return ownership;
                }else {
                    return false;
                }
            }else{
                return false;
            }
        }catch (e) {
            console.log(e);
        }
    },

    
    deleteOwnership : async function(id){
        try {
            const ownership = await Ownership.findByIdAndRemove(id);
            if(ownership){
                return ownership;
            }else {
                return false;
            }
        }catch (e) {
            console.log(e);
        }
    }
}