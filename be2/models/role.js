const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RoleSchema = new Schema({
  roleCode:{
    type: String,
    required: [true, 'Role Code is Required']
  },
  desc:{
    type: String,
    required: [true, 'Description is Required']
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
    required: [false, 'End Effective Date is Required']
  },
  delete:{
    type: Boolean,
    default: false
  },
  ipadd:{
    type: String,
    required: [false, 'IP Address is Required']
  },
  createdDate:{
    type: Date,
    required: [false, 'Created Date is Required']
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
},{collection: 'role'});

module.exports = mongoose.model('Role', RoleSchema);