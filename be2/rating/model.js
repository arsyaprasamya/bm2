/**
 *
 * @type {Rating Schema| Mongoose}
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Ticket = require("../ticket/model").Ticket;

const RatingSchema = new Schema({
    rating_id: {
        type: String,
        required: [false, "ID is required"]
    },
    rating: {
        type: String,
        enum : ['1', '2', '3', '4', '5'],
        required: [false, "Rating is required"]
    },
    feedback: {
        type: String,
        required: [false, "Feedback is required"]
    },
    ticket: {
        type: Schema.Types.ObjectId,
        required: [false, "ticket_id is required"],
        ref : Ticket
    },
    ticket_id: {
        type: String,
        required: [false, "Ticket ID is required"]
    },
    custname: {
        type: String,
        required: [false, "Customer name is required"]
    },
    tcktdate: {
        type: String,
        required: [false, "Ticket Date is required"]
    },
    created_by: {
        type: String,
        required: [false, "This field is required"]
    },
    created_date: {
        type: Date,
        required: [false, "This field is required"],
        default: Date.now()
    },
}, {collection: 'rating'});

RatingSchema.set('toObject', { virtuals: true });
RatingSchema.set('toJSON', { virtuals: true });

RatingSchema.virtual('Ticket', {
    ref: 'Ticket',
    localField: 'id_ticket',
    foreignField: 'rating_id',
    justOne: true
})

const Rating = mongoose.model("Rating", RatingSchema);
module.exports = {Rating, RatingSchema};