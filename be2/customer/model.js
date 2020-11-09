

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CustomerSchema = new Schema({
    cstrmrcd: {
        type: String,
        required: [false, "cstrmrcd is required"]
    },
    cstrmrpid : {
        type: String,
        required: [false, "cstrmrpid is required"]
    },
    cstrmrnm : {
        type: String,
        required: [false, "cstrmrnm is required"],
    },
    npwp : {
        type: String,
        required: [false, "npwp is required"],
        default: "-"
    },
    addrcstmr : {
        type: String,
        required: [false, "addrcstmr is required"]
    },
    phncstmr : {
        type: String,
        required: [false, "phncstmr is required"],
        default: "-"
    },
    emailcstmr : {
        type: String,
        required: [false, "emailcstmr is required"],
        default: "-"
    },
    gndcstmr : {
        type: String,
        required: [false, "gndcstmr is required"]
    },
    idvllg : {
        type: Schema.Types.ObjectId,
        required: [false, "idvllg is required"],
        ref: "Village"
    },
    postcode : {
        type: String,
        required: [false, "postcode is required"],
        default: "-"
    },
    type : {
        type : String,
        required: [false, "type is required"],
        default: "-"
    },
    bankname : {
        type : String,
        required: [false, "bankname is required"],
        default: "-"
    },
    bankaccnt : {
        type : String,
        required: [false, "bankaccnt is required"],
        default: "-"
    }
}, {collection: 'cstmr'});

const Customer =  mongoose.model("Customer", CustomerSchema);
module.exports = {Customer, CustomerSchema};