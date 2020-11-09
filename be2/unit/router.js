const express = require('express');
const router = express.Router();
const passport = require('passport');
const middleware = require("../middleware/userrole");
const controller = require("./controller");

router.get("/list", [passport.authenticate('jwt', {session: false}), middleware.isAdmin, middleware.isOperator], controller.listUnt);
router.get("/listuntmobile", [passport.authenticate('jwt', {session: false}), middleware.isUser], controller.listUntMobile);
router.get("/:id", [passport.authenticate('jwt', {session: false}), middleware.isAdmin, middleware.isOperator], controller.listUntById);
router.get("/listidmobile/:id", [passport.authenticate('jwt', {session: false}), middleware.isUser], controller.listUntByIdMobile);
router.get("/parent/:id", [passport.authenticate('jwt', {session: false}), middleware.isAdmin, middleware.isOperator], controller.getByParentId);
router.get("/parentmobile/:id", [passport.authenticate('jwt', {session: false}), middleware.isUser], controller.getByParentIdMobile);
router.get("/customer/:id", [passport.authenticate('jwt', {session: false}), middleware.isAdmin, middleware.isOperator], controller.getUnitCustomer);
router.post('/add', [passport.authenticate('jwt', {session: false}), middleware.isAdmin, middleware.isOperator], controller.addUnt);
router.post("/addmobile", [passport.authenticate('jwt', {session: false}), middleware.isUser], controller.addUntMobile);
router.patch('/edit/:id', [passport.authenticate('jwt', {session: false}), middleware.isAdmin, middleware.isOperator], controller.updateUnt);
router.patch('/editmobile/:id', [passport.authenticate('jwt', {session: false}), middleware.isUser], controller.updateUntMobile);
router.delete('/delete/:id', [passport.authenticate('jwt', {session: false}), middleware.isAdmin, middleware.isOperator], controller.deleteUnt);
router.delete('/deletemobile/:id', [passport.authenticate('jwt', {session: false}), middleware.isUser], controller.deleteUntMobile);


module.exports = router;