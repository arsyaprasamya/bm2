const {listRating, lstRatingById, addRating, editRating, deleteRating, findRatingByParent, 
       EditRatingByParent, lstTicketById, listTicket} = require("./service");

module.exports = {
    Rating: async function (req, res, next) {
        try {
            const list = await listRating(req.params.filter, req.params.page, req.params.limit);
            if (list) {
                return res.status(200).json({"status": "success", "data": list});
            } else {
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        } catch (e) {
            return res.status(500).json({"status": "error", "data": e});
        }
    },
    RatingById: async function(req, res, next){
        try {
            const list = await lstRatingById(req.params.id);
            if (list) {
                return res.status(200).json({"status": "success", "data": list});
            } else {
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        }catch (e) {
            return res.status(500).json({"status": "error", "data": e});
        }
    },
    TicketById: async function(req, res, next){
        try {
            const list = await lstTicketById(req.params.id);
            if (list) {
                return res.status(200).json({"status": "success", "data": list});
            } else {
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        }catch (e) {
            return res.status(500).json({"status": "error", "data": e});
        }
    },
    listTicket: async function(req, res, next){
        try {
            const list = await listTicket(req.params.id);
            if (list) {
                return res.status(200).json({"status": "success", "data": list});
            } else {
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        }catch (e) {
            return res.status(500).json({"status": "error", "data": e});
        }
    },
    tambahRating: async function (req, res, next) {
        try {
            const addrat = await addRating(req.body);
            if (addrat) {
                return res.status(200).json({"status": "success", "data": addrat});
            } else {
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        } catch (e) {
            return res.status(500).json({"status": "error", "data": e});
        }
    },
    updateRating: async function (req, res, next) {
        try {
            const updaterat = await editRating(req.params.id, req.body);
            if (updaterat) {
                return res.status(200).json({"status": "success", "data": "Update data success!"});
            } else {
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        } catch (e) {
            return res.status(500).json({"status": "error", "data": e});
        }
    },
    updateRatingByParent: async function (req, res, next) {
        try {
            const updaterat = await EditRatingByParent(req.params.id, req.body);
            if (updaterat) {
                return res.status(200).json({"status": "success", "data": updaterat});
            } else {
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        } catch (e) {
            return res.status(500).json({"status": "error", "data": e});
        }
    },
    hapusRating: async function (req, res, next) {
        try {
            const hapusrat = await deleteRating(req.params.id);
            if (hapusrat) {
                return res.status(200).json({"status": "success", "data": hapusrat});
            } else {
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        } catch (e) {
            return res.status(500).json({"status": "error", "data": e});
        }
    },
    findRatingByParent : async function(req, res, next){
        try {
            const block = await findRatingByParent(req.params.id);
            if(block){
                return res.status(200).json({"status": "success", "data": block});
            }else{
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        }catch (e) {
            console.log(e);
        }
    }
};