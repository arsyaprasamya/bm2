/**
 *
 * Customer database services
 */

const Customer = require('./model').Customer;

module.exports = {

    findAllCustomer : async function(query, page = 1, limit = 1000){
        try{
            var skip = (page - 1) * limit;
            var customer = await Customer.find(query).skip(skip).limit(limit).populate("blk", "-__v").select('-__v').sort({$natural:-1});
            return blockgroup;
        }catch (e) {
            console.log(e);
        }
    },


    addCustomer : async function(cust){
        try {
            const customer = await new Customer(cust).save();
            if(customer){
                return customer;
            }else{
                return false;
            }
        }catch (e) {
            console.log(e);
        }
    },
    listCustomer : async function(query, page = 1, limit = 1000){
        try {
            const skip = (page - 1) * limit;
            let customer;
            if(Object.keys(query).length === 0){
            customer = await Customer.find(query).skip(skip).limit(limit).populate({
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
            customer = await Customer.find().or([
                { 'cstrmrnm': { $regex: `${query.cstrmrnm}` }}, 
                // { 'addrcstmr': { $regex: `${query.cstrmrnm}` }},
                // { 'phncstmr': { $regex: `${query.cstrmrnm}` }},
                // { 'emailcstmr': { $regex: `${query.cstrmrnm}` }},
            ]).skip(skip).limit(limit).populate({
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
        }
            if(customer){
                return customer;
            }else{
                return false;
            }
        }catch (e) {
            console.log(e);
        }
    },
    editCustomer : async function(id, cust){
        try {
            const customer = await Customer.findByIdAndUpdate(id, cust);
            if(customer){
                return customer;
            }else{
                return false;
            }
        }catch (e) {
            console.log(e);
        }
    },
    findByCustomerId : async function(id){
        try {
            const customer = await Customer.findById(id).populate({
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
            });;
            if(customer){
                return customer;
            }else{
                return false;
            }
        }catch (e) {
            console.log(e);
        }
    },
    deleteCustomer : async function(id){
        try {
            const customer = await Customer.findByIdAndRemove(id);
            if(customer){
                return customer;
            }else{
                return false;
            }
        }catch (e) {
            console.log(e);
        }
    },
    countCustomer : async function(){
        try {
            const customer = await Customer.countDocuments();
            if(customer){
                return customer;
            }else{
                return false;
            }
        }catch (e) {
            console.log(e);
        }
    },
    findLast: async function(){
        try {
            const customer = await Customer.findOne().sort({$natural: -1}).limit(1);
            if(customer){
                return customer;
            }else{
                return false;
            }
        }catch (e) {
            console.log(e);
        }
    }
}