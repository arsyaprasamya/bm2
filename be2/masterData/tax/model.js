/**
 *
 * @type {Tax Schema | Mongoose}
 */

const mongoose = require('mongoose');

const TaxSchema = new mongoose.Schema({
    taxName : {
        type: String,
        required : [true, "Tax Name is required"]
    },
    tax : {
      type: Number,
      required : [true, "Tax % is required"]
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
}, {collection: 'tax'});

const Tax = mongoose.model("Tax", TaxSchema);
module.exports = Tax;