/**
 *
 * Rating database services
 */

const Rating = require('./model').Rating;
const Ticket = require('../ticket/model').Ticket;

module.exports = {
    listRating: async function(query, page= 1, limit = 10){
        try {
            const skip = (page - 1) * limit;
            const rating = await Rating.find(query).skip(skip).limit(limit).populate("ticket", "-__v").select('-__v');
            if(rating){
                return rating;
            }else{
                return false;
            }
        }catch (e) {
            console.log(e);
        }
    },
    findRatingByParent: async function(id){
        try {
            const rating = await Rating.find({ticket_id: id}).select("-__v");
            if(rating){
                return rating;
            }else{
                return false;
            }
        }catch (e) {
            console.log(e);
        }
    },
    EditRatingByParent: async function(id){
        try {
           // const filter = { 'rating': {$ne: null} };
            const GetID = await Rating.findOne({_id: id}).select("-__v");
            const getTicket_id = GetID.ticket_id;
            const rating = await Rating.findOne( { 'rating': {$ne: null}, 'ticket_id' : getTicket_id }, {ticket_id: 1} )
            const lastValue = rating.ticket_id;
            const ticket = await Ticket.findOneAndUpdate( {_id : lastValue}, 
            {$set: {rated: true}});
            if(ticket){
                return ticket;
            }else{
                return false;
            }
        }catch (e) {
            console.log(e);
        }
    },
    lstRatingById: async function(id){
        try {
            const rating = await Rating.findById(id)
            if(rating){
                return rating;
            }else{
                return false;
            }
        }catch (e) {
            console.log(e)
        }
    },
    lstTicketById: async function(id){
        try {
            const ticket = await Ticket.findById(id)
            if(ticket){
                return ticket;
            }else{
                return false;
            }
        }catch (e) {
            console.log(e)
        }
    },
    
    listTicket : async function(query, page = 1, limit = 1000){
        try {
            const skip = (page - 1) * limit;
            const ticket = await Ticket.find(query).skip(skip).limit(limit).populate({path:'Ticket'});
            if(ticket){
                return ticket;
            }else{
                return false;
            }
        }catch (e) {
            console.log(e);
        }
    },

    addRating: async function(rat){
        try {
            const rating = await new Rating(rat).save();
            if(rating){
                return rating;
            }else {
                return false;
            }
        }catch (e) {
            console.log(e)
        }
    },
    editRating: async function(id, rat){
        try {
            const rating = await Rating.findByIdAndUpdate(id, rat);
            if (rating){
                return rating;
            }else{
                return false;
            }
        }catch (e) {
            console.log(e);
        }
    },
    
    deleteRating: async function(id){
        try {
            const rating = await Rating.findByIdAndRemove(id);
            if(rating){
                return rating;
            }else{
                return false
            }
        }catch (e) {
            console.log(e);
        }

    }
}