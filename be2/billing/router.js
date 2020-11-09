const express = require('express');
const router = express.Router();
const passport = require('passport');
const middleware = require("../middleware/userrole");
const controller = require("./controller");

router.get("/list", [passport.authenticate('jwt', {session: false}), middleware.isAdmin, middleware.isOperator], controller.listBill);
router.get("/create/:id", [passport.authenticate('jwt', {session: false}), middleware.isAdmin, middleware.isOperator], controller.createBilling);
router.get("/generate/codeBilling", [passport.authenticate('jwt', {session: false}), middleware.isAdmin, middleware.isOperator], controller.generateCodeBiling);
router.get("/:id", [passport.authenticate('jwt', {session: false}), middleware.isAdmin, middleware.isOperator], controller.findBillingId);
router.post('/add', [passport.authenticate('jwt', {session: false}), middleware.isAdmin, middleware.isOperator], controller.addBill);
router.post('/autocreate', [passport.authenticate('jwt', {session: false}), middleware.isAdmin, middleware.isOperator], controller.autoCreateBilling);
router.delete('/delete/:id', [passport.authenticate('jwt', {session: false}), middleware.isAdmin, middleware.isOperator], controller.deleteBilling);
//router.patch('/edit/:id', [passport.authenticate('jwt', {session: false}), middleware.isAdmin, middleware.isOperator], controller.customerEdit);
//router.delete('/delete/:id', [passport.authenticate('jwt', {session: false}), middleware.isAdmin, middleware.isOperator], controller.customerDelete);

router.get("/listmobilebill", [passport.authenticate('jwt', {session: false}), middleware.isAdmin,  middleware.isOperator], controller.BillingMobilelist);
router.get("/findmobile/:id", [passport.authenticate('jwt', {session: false}), middleware.isUser], controller.findBillingIdMobile);



module.exports = router;