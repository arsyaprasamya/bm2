const mongoose = require('mongoose');
//const bcrypt = require('');
const Schema = mongoose.Schema;

const UserSchema = new Schema({

    first_name : {
        type : String,
        required : [true, 'first name is required']
    },
    last_name : {
        type : String,
        required : [true, 'last name is required']
    },
    username : {
        type : String,
        required : [true, 'username is required'],
        unique: true
    },
    password : {
        type : String,
        minLength : [8, 'password min length is 8 character'],
        required : true
    },
    tenant:{
        type: Schema.Types.ObjectId,
        ref: 'Customer'
    },
    engineer:{
        type: Schema.Types.ObjectId,
        ref: 'Engineer'
    },
    created_date : {
        type : Date,
        default : Date.now
    },
    updated_date : {
        type : Date,
        default : Date.now
    },
    role : {
        type : String,
        enum : ['administrator', 'operator', 'user', 'engineer'],
        required : true
    }

});

module.exports = User = mongoose.model("User", UserSchema);