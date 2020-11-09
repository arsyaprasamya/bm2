const RentalBilling = require('./model').RentalBilling;

module.exports = {
    addBilling: async function (bill) {
        try {
            const billing = await new RentalBilling(bill).save();
            if (billing) {
                return billing;
            } else {
                return false;
            }
        } catch (e) {
            console.log(e)
        }
    },

    getBillingNumber : async function(){
        try {
            const month = new Date(Date.now()).getMonth();
            const year = new Date(Date.now()).getFullYear();
            const fromDate = new Date(year, month, 2);
            const toDate = new Date(fromDate.getFullYear(), fromDate.getMonth() + 1, 0);
            const condition = {"created_date": {'$gte': fromDate, '$lte': toDate}};
            const billing = await RentalBilling.find(condition);
            var number = billing.length + 1;
            return `IPL/${year}/${('0' + (month+1)).slice(-2)}/${('000000' + number).slice(-5)}`;
        }catch (e) {
            console.log(e);
        }
    },

    getBillingById: async function(id){
        try {
            const billing = await RentalBilling.findById(id).populate({
                path : "lease",
                model : "Tenant",
                select : "-__v",
                populate : {
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
            }
            });
            if(billing){
                return billing;
            }else{
                return false;
            }
        }catch (e) {
            console.log(e);
        }
    },

    listRentalBilling: async function (filter, page = 1, limit = 1000) {
        try {
            const skip = (page - 1) * limit;
            let billing;
            if(Object.keys(filter).length === 0){
            billing = RentalBilling.find(filter).skip(skip).limit(limit).populate({
                path: "lease",
                model: "Tenant",
                select: "-__v",
                populate: {
                     path: "unit",
                     model: "Unit",
                     select: "-__v",
                }
            })
        }else{
            billing = RentalBilling.find().or([{ 'billingNo': { $regex: `${filter.billingNo}` }}]).skip(skip).limit(limit).populate({
                path: "lease",
                model: "Tenant",
                select: "-__v",
                populate: {
                     path: "unit",
                     model: "Unit",
                     select: "-__v",
                }
            }).sort({$natural:-1});
        }
            if (billing){
                return billing;
            }else {
                return false;
            }
        } catch (e) {
            console.log(e);
        }
    },

    deleteBilling : async function(id){
        try {
            var billing = await RentalBilling.findByIdAndRemove(id);
            if (billing){
                return true;
            }else{
                return false;
            }
        }catch (e) {
            console.log(e);
        }
    }

};