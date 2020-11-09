/**
 *
 * @type {Engineer Schema| Mongoose}
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EngineerSchema = new Schema({
    engnrid: {
        type: String,
        required: [true, "ID is required"]
    },
    name: {
        type: String,
        required: [true, "Name is required"]
    },
    status: {
        type: String,
        required: [true, "Status is required"]
    },
    phone: {
        type: String,
        required: [true, "Phone is required"]
    },
    email: {
        type: String,
        required: [true, "Email is required"]
    }
}, {collection: 'engineer'});

const Engineer = mongoose.model("Engineer", EngineerSchema);
module.exports = {Engineer, EngineerSchema};