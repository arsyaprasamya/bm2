/**
 *
 * @type {Mainacct Schema | Mongoose}
 */

const mongoose = require('mongoose');

const AcctSchema = new mongoose.Schema({
    acctType : {
        type: mongoose.Schema.ObjectId,
        ref: 'Acctype',
        required : [true, "Account Type is required"]
    },
    acctNo : {
      type: String,
      required : [true, "Main Account No is required"]
    },
    acctName : {
      type: String,
      required : [true, "Main Account Name is required"]
    },
    parents:{
      type: mongoose.Schema.ObjectId,
      ref: 'Acct',
      required: [false, "Parent is required"]
    },
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Created By is Required']
    },
    createdDate: {
      type: Date,
      default: Date.now()
    },
    updateBy: String,
    updateDate: Date
}, {collection: 'acct'});

const Acct = mongoose.model("Acct", AcctSchema);
module.exports = Acct;