const { CashBank } = require('./model');

/**
 * Cashbank Database Services
 */

function pad(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}

module.exports = {
    findAllCashBank : async function(query, page = 1, limit = 1000){
        try {
            const skip = (page - 1) * limit;
            let cb;
            if(Object.keys(query).length === 0) {
                cb = await CashBank.find({}).skip(skip).limit(limit).sort({$natural:-1});
            }else{
                cb = await CashBank.find().or([
                    { 'voucherno': { $regex: `${query.voucherno}` }}
                ])
                .skip(skip)
                .limit(limit)
                .select("-__v")
                .sort({$natural:-1});
            }

            if(cb){
                return cb;
            }else{
                return false;
            }
        }catch (e) {
            errorHandler(e);
        }
    },
    findByCashBankId : async function(id){
        try {
            var cashbank = await CashBank.findById(id);
            return cashbank;
        }catch (e) {
            console.log(e);
        }
    },
    addCashBank : async function(body){
        try {
            var cashbank = await new CashBank(body).save();
            if(cashbank){
                return cashbank;
            }else{
                return false;
            }
        }catch (e) {
            console.log(e);
        }
    },
    updateCashBank: async function(id, body){
        try{
            var cashbank = await CashBank.findByIdAndUpdate(id,body);
            if(cashbank){
                return cashbank;
            }else{
                return false;
            }
        }catch (e) {
            console.log(e);
        }
    },
    deleteCashBank : async function(id){
        try {
            var cashbank = await CashBank.findByIdAndRemove(id);
            if (cashbank){
                return cashbank;
            }else{
                return false;
            }
        }catch (e) {
            console.log(e);
        }
    },
}