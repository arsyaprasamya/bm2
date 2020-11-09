const Account = require('./model').Acct;

module.exports = {
    getAll: async function(id){
        try {
            const acct = await Acct.find(id).select("-__v");
            if(acct){
                return acct;
            }else{
                return false;
            }
        }catch (e) {
            console.log(e);
        }
    },
    getById : async function(id){
        try {
            const acct = await Acct.findById(id);
            if(acct){
                return acct;
            }else {
                return false;
            }
        }catch (e) {
            console.log(e)
        }
    },
}