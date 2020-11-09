const express = require('express');
const router = express.Router();
const passport = require('passport');
const middleware = require("../middleware/userrole");
const controller = require("./controller");

router.get("/", [passport.authenticate('jwt', {session: false}), middleware.isAdmin], controller.Rating);
router.get("/relation/ticket", [passport.authenticate('jwt', {session: false}), middleware.isAdmin], controller.listTicket);
router.get("/:id/", [passport.authenticate('jwt', {session: false}), middleware.isAdmin], controller.RatingById);
router.get("/relation/ticket/:id/", [passport.authenticate('jwt', {session: false}), middleware.isAdmin], controller.TicketById);
router.get("/parent/:id", [passport.authenticate('jwt', {session: false}), middleware.isAdmin], controller.findRatingByParent);
router.post('/add', [passport.authenticate('jwt', {session: false}), middleware.isAdmin], controller.tambahRating);
router.post('/addrating', [passport.authenticate('jwt', {session: false}), middleware.isUser], controller.tambahRating);
router.patch('/edit/:id', [passport.authenticate('jwt', {session: false}), middleware.isAdmin], controller.updateRating);
router.patch('/update/mantul/:id', [passport.authenticate('jwt', {session: false}), middleware.isAdmin], controller.updateRatingByParent);
router.delete('/delete/:id', [passport.authenticate('jwt', {session: false}), middleware.isAdmin], controller.hapusRating);


module.exports = router;