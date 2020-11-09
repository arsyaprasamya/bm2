/**
 * Invoice Database Services
 */
const Invoice = require('./model').Invoice;
const Ownership = require('../contract/owner/model').Ownership;
const Lease = require('../contract/tenant/model').Tenant;
const Sequence = require("../models/sequence");

function pad(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}

module.exports = {
    findAllInvoice : async function(query, page = 1, limit = 1000){
        try{
            var skip = (page - 1) * limit;
            let invoice;
            if(Object.keys(query).length === 0){
            invoice = await Invoice.find(query).skip(skip).limit(limit).sort({$natural:-1}).lean();
            }else{
            invoice = await Invoice.find().or({ 'invoiceno': { $regex: `${query.invoiceno}` }}).skip(skip).limit(limit).sort({$natural:-1}).lean();
            }
            if (invoice){
                invoice.forEach(async element => {
                    let dataContract;
                    dataContract = await Lease.findOne({_id: element.contract}).populate('unit', '-__v');
                    if (dataContract === null || Object.keys(dataContract).length === 0) {
                        dataContract = await Ownership.findOne({_id: element.contract}).populate('unit', '-__v');   
                    }
                    element.cdunit = dataContract.unit.cdunt;
                });
                return invoice;
            }else{
                false;
            }
            
        }catch (e) {
            console.log(e);
        }
    },
    
    findByInvoiceId : async function(id){
        try {
            var invoice = await Invoice.findById(id);
            let dataContract;

            dataContract = await Lease.findOne({_id: invoice.contract}).populate('unit', '-__v');
            if (dataContract === null || Object.keys(dataContract).length === 0) {
                dataContract = await Ownership.findOne({_id: invoice.contract}).populate('unit', '-__v');   
            }
            invoice.cdunit = dataContract.unit.cdunt;
            return invoice;

        }catch (e) {
            console.log(e);
        }
    },

    addInvoice : async function(body){
        try {
            const dates = new Date();
            var invoice = await new Invoice(body).save();
            
            if (invoice) {
                const sequences = await Sequence.find({
                  menu: "invoice",
                  year: dates.getFullYear(),
                });
          
                const updateSequence = await Sequence.findByIdAndUpdate(
                  { _id: sequences[0]._id },
                  { sequence: sequences[0].sequence + 1 }
                );
          
                if (updateSequence) {
                  res.status(200).json({
                    status: "success",
                    data: invoice,
                  });
                }
              } else {
                res.status(500).json({
                  status: "error",
                  data: "Something Went Wrong",
                });
              }
            if(invoice){
                return invoice;
            }else{
                return false;
            }
        }catch (e) {
            console.log(e);
        }
    },
    updateInvoice: async function(id, body){
        try{
            var invoice = await Invoice.findByIdAndUpdate(id,body);
            if(invoice){
                return invoice;
            }else{
                return false;
            }
        }catch (e) {
            console.log(e);
        }
    },
    deleteInvoice : async function(id){
        try {
            var invoice = await Invoice.findByIdAndRemove(id);
            if (invoice){
                return invoice;
            }else{
                return false;
            }
        }catch (e) {
            console.log(e);
        }
    },

}