const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ApplicationSchema = new Schema({
  appCode:{
    type: String,
    required: [true, 'Application Code is Required']
  },
  name:{
    type: String,
    required: [true, 'Description is Required']
  },
  appType:{
    type: String,
    required: [true, 'Application Type is Required']
  },
  path:{
    type: String,
    required: [true, 'Application Path is Required']
  },
  icon: String,
  parents:{
    type: mongoose.Schema.ObjectId,
    ref: 'Application'
  },
  startEffDate:{
    type: Date,
    required: [true, 'Start Effective Date is Required']
  },
  endEffDate:{
    type: Date,
    required: [true, 'End Effective Date is Required']
  },
  active:{
    type: Boolean,
    default: true
  },
  delete:{
    type: Boolean,
    default: false
  },
  ipadd:{
    type: String,
    required: [true, 'IP Address is Required']
  },
  createdDate:{
    type: Date,
    required: [true, 'Created Date is Required']
  },
  createdBy:{
    type: Schema.ObjectId,
    ref: 'User',
    required: [true, 'Created By is Required']
  },
  updatedDate:{
    type: Date
  },
  updatedBy:{
    type: String
  }
},{collection: 'application'});

module.exports = mongoose.model('Application', ApplicationSchema);