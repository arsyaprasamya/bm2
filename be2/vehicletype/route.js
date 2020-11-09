const express = require('express');
const router = express.Router();
const passport = require('passport');
const middleware = require("../middleware/userrole");
const controller = require("./controller");

router.get("/list", [passport.authenticate('jwt', {session: false}), middleware.isAdmin, middleware.isOperator], controller.vehicleTypeList);
router.get("/:id", [passport.authenticate('jwt', {session: false}), middleware.isAdmin, middleware.isOperator], controller.vehicleTypeFind);
router.post('/add', [passport.authenticate('jwt', {session: false}), middleware.isAdmin, middleware.isOperator], controller.vehicleTypeAdd);
router.patch('/edit/:id', [passport.authenticate('jwt', {session: false}), middleware.isAdmin, middleware.isOperator], controller.vehicleTypeEdit);
router.delete('/delete/:id', [passport.authenticate('jwt', {session: false}), middleware.isAdmin, middleware.isOperator], controller.vehicleTypeDelete);


module.exports = router;