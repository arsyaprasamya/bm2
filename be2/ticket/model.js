/**
 *
 * @type {Ticket Schema| Mongoose}
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//const Rating = require("../rating/model").Rating;
//const Engineer = require("../engineer/model").Engineer;

const TicketSchema = new Schema({
    ticketId: { //id tiket
        type: String,
        required: [true, "ID is required"]
    },
    subject: { //subject
        type: String,
        required: [true, "Subject is required"]
    },
    unit:{
        type: Schema.Types.ObjectId,
        ref: 'Unit',
        required: [true, "Unit is required"]
    },
    subDefectId: { //subdefect (category, defect, subdefect)
        type: Schema.Types.ObjectId,
        required: [true, "subDefectId ID is required"]
    },
    description: String,
    dateScheduled: Date,
    dateList: [{ // list pilihan tanggal
        type: Date
    }],
    rescheduleDate: Date,
    priority: String,
    attachment: String,
    reason: String,
    status: String,
    engineerId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    rating: {
        type: Number,
        enum : [0, 1, 2, 3, 4, 5],
        required: [false, "Rating is required"],
        default: 0
    },
    feedback: String,
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    createdDate: {
        type: Date,
        default: Date.now()
    },
    updatedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    updatedDate: Date
}, {collection: 'ticket'});


TicketSchema.set('toObject', { virtuals: true });
TicketSchema.set('toJSON', { virtuals: true });

TicketSchema.virtual('Unit', {
    ref: 'Unit',
    localField: 'unit_id',
    foreignField: 'id_ticket',
    justOne: true
}),
TicketSchema.virtual('Engineer', {
    ref: 'Engineer',
    localField: 'engineer_id',
    foreignField: 'id_ticket',
    justOne: true
}),
TicketSchema.virtual('Customer', {
    ref: 'Customer',
    localField: 'customer_id',
    foreignField: 'id_ticket',
    justOne: true
}),
TicketSchema.virtual('Category', {
    ref: 'Category',
    localField: 'category_id',
    foreignField: 'id_ticket',
    justOne: true
});


const Ticket = mongoose.model("Ticket", TicketSchema);
module.exports = {Ticket, TicketSchema};
    