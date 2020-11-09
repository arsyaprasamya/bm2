const ParkBilling = require('./model').ParkBilling;

module.exports = {
    getBillingById: async function(id){
        try {
            const billing = await ParkBilling.findById(id).populate({
                path : "parking",
                model : "Addplot",
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

    listParkBilling: async function (filter, page = 1, limit = 1000) {
        try {
            const skip = (page - 1) * limit;
            let billing;
            if(Object.keys(filter).length === 0){
            billing = ParkBilling.find(filter).skip(skip).limit(limit).populate({
                path: "parking",
                model: "Addplot",
                select: "-__v",
                populate: {
                     path: "unit",
                     model: "Unit",
                     select: "-__v",
                }
            })
        }else{
            billing = ParkBilling.find().or([{ 'billingNo': { $regex: `${filter.billingNo}` }}]).skip(skip).limit(limit).populate({
                path: "parking",
                model: "Addplot",
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
            var billing = await ParkBilling.findByIdAndRemove(id);
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