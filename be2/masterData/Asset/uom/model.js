/**
 *
 * @type {uom Schema | Mongoose}
 */

const mongoose = require('mongoose');

const uomSchema = new mongoose.Schema({
  uom:{
    type: String,
    required: [true, 'Please input uom']
  },
  remarks: String,
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
}, {collection: 'uom'});

const Uom = mongoose.model("Uom", uomSchema);
module.exports = Uom;