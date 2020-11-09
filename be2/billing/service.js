const Billing = require('./model').Billing;

module.exports = {
    addBilling: async function (bill) {
        try {
            const billing = await new Billing(bill).save();
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
            const billing = await Billing.find(condition);
            var number = billing.length + 1;
            return `IPL/${year}/${('0' + (month+1)).slice(-2)}/${('000000' + number).slice(-5)}`;
        }catch (e) {
            console.log(e);
        }
    },
    getBillingById: async function(id){
        try {
            const billing = await Billing.findById(id).populate({
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
            })
            if(billing){
                return billing;
            }else{
                return false;
            }
        }catch (e) {
            console.log(e);
        }
    },


//getBilling by ID mobile
getBillingByIdMobile: async function(id){
    try {
        const billing = await Billing.findById(id).populate({
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
            path: "billed_to",
            model: "Customer",
            select: "-__v",
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

    listBilling: async function (filter, page = 1, limit = 1000) {
        try {
            const skip = (page - 1) * limit;
            let billing;
            if(Object.keys(filter).length === 0){
            billing = await Billing.find(filter).skip(skip).limit(limit).populate({
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
            billing = Billing.find().or([{ 'billing_number': { $regex: `${filter.billing_number}` }}]).skip(skip).limit(limit).populate({
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
                path: "billing.electricity.electric_trans",
                model: "TransaksiPower",
                select: "-__v",
                populate: {
                    path: "pow",
                    model: "Power",
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

//list Billing Mobile
    listBillingMobile: async function (query, page = 1, limit = 1000) {
            try {
                const skip = (page - 1) * limit;
                let billing;
                if(Object.keys(query).length === 0){
                billing = await Billing.find(query).skip(skip).limit(limit).sort({$natural:-1})
                console.log(billing)
                .populate({
                    path:"unit",
                    model:"Unit",
                    select:"-__v",
                }).populate({
                    path: "billed_to",
                    model: "Customer",
                    select: "-__v",
                });

                if (billing){
                    return billing;
                }else {
                    return false;
                }
            } 
                }catch (e) {
                    console.log(e);
                }       
},

//coba dulu yaa gan
// listBillingMobile: async function (query, page = 1, limit = 1000) {
//     try {
//         const skip = (page - 1) * limit;
//         let billing;
//         if(Object.keys(query).length === 0){
//         billing = await Billing.find().skip(skip).limit(limit).populate({
//             path: "unit",
//             model: "Unit",
//             select: "-__v",
//             populate: {
//                 path: "flr",
//                 model: "Floor",
//                 select: "-__v",
//                 populate: {
//                     path: "blk",
//                     model: "Block",
//                     select: "-__v",
//                     populate: {
//                         path: "grpid",
//                         model: "BlockGroup",
//                         select: "-__v",
//                     }
//                 }

//             }
//         }).populate({
//             path: "billed_to",
//             model: "Customer",
//             select: "-__v",
//         }).sort({$natural:-1});
//     }else{
//         billing = Billing.find().or([{ 'billing_number': { $regex: `${query.billing_number}` }}]).skip(skip).limit(limit).populate({
//             path: "unit",
//             model: "Unit",
//             select: "-__v",
//             populate: {
//                 path: "flr",
//                 model: "Floor",
//                 select: "-__v",
//                 populate: {
//                     path: "blk",
//                     model: "Block",
//                     select: "-__v",
//                     populate: {
//                         path: "grpid",
//                         model: "BlockGroup",
//                         select: "-__v",
//                     }
//                 }

//             }
//         }).populate({
//             path: "billed_to",
//             model: "Customer",
//             select: "-__v",
//         }).populate({
//             path: "billing.electricity.electric_trans",
//             model: "TransaksiPower",
//             select: "-__v",
//             populate: {
//                 path: "pow",
//                 model: "Power",
//                 select: "-__v",
//             }
//         }).sort({$natural:-1});
//     }
//         if (billing){
//             return billing;
//         }else {
//             return false;
//         }
//     } catch (e) {
//         console.log(e);
//     }
// },

    deleteBilling : async function(id){
        try {
            var billing = await Billing.findByIdAndRemove(id);
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