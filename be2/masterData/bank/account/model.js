/**
 *
 * @type {AcctBank Schema | Mongoose}
 */

const mongoose = require('mongoose');

const AcctBankSchema = new mongoose.Schema({
  bank : {
      type: mongoose.Schema.ObjectId,
      ref: 'Bank',
      required : [true, "Bank is required"]
  },
  acctName : {
    type: String,
    required : [true, "Account Name is required"]
  },
  acctNum : {
    type: Number,
    required : [true, "Account Number is required"]
  },
  branch : {
    type: String,
    required : [true, "Branch is required"]
  },
  remarks : {
    type: String
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
}, {collection: 'acctbank'});

const Acctbank = mongoose.model("Acctbank", AcctBankSchema);
module.exports = Acctbank;