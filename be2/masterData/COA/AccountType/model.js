/**
 *
 * @type {Acctype Schema | Mongoose}
 */

const mongoose = require('mongoose');

const AcctypeSchema = new mongoose.Schema({
    acctypeno : {
        type: String,
        required : [true, "acctypeno is required"]
    },
    acctype : {
      type: String,
      required : [true, "acctype is required"]
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
}, {collection: 'acctype'});

const Acctype = mongoose.model("Acctype", AcctypeSchema);
module.exports = Acctype;