const express = require('express');
const router = express.Router();
const passport = require('passport');
const middleware = require("../../middleware/userrole");
const controller = require("./controller");

router
  .route('/')
  .get([passport.authenticate('jwt', {session: false}), middleware.isAdmin], controller.listAddParking)
  .post([passport.authenticate('jwt', {session: false}), middleware.isAdmin], controller.addParking);

router
  .route('/:id')
  .get([passport.authenticate('jwt', {session: false}), middleware.isAdmin], controller.getAddParking)
  .patch([passport.authenticate('jwt', {session: false}), middleware.isAdmin], controller.editAddParking)
  .delete([passport.authenticate('jwt', {session: false}), middleware.isAdmin], controller.deleteAddParking);

module.exports = router;