const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GroupSchema = new Schema({
    name : {
        type : String,
        required : true
    },
    rolegroup_id : {
        type: String,
        required : false
    }
});

module.exports = mongoose.model('UserGroup', GroupSchema);