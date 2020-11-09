const express = require('express');
const router = express.Router();
const passport = require('passport');
const middleware = require("../middleware/userrole");
const controller = require("./controller");

router.get("/list", [passport.authenticate('jwt', {session: false}), middleware.isAdmin, middleware.isOperator], controller.listBill);
router.get("/create/:id", [passport.authenticate('jwt', {session: false}), middleware.isAdmin, middleware.isOperator], controller.createBilling);
router.get("/number/generate", [passport.authenticate('jwt', {session: false}), middleware.isAdmin, middleware.isOperator], controller.getBillNumber);
router.get("/:id", [passport.authenticate('jwt', {session: false}), middleware.isAdmin, middleware.isOperator], controller.findBillingId);
router.post('/add', [passport.authenticate('jwt', {session: false}), middleware.isAdmin, middleware.isOperator], controller.addBill);
router.delete('/delete/:id', [passport.authenticate('jwt', {session: false}), middleware.isAdmin, middleware.isOperator], controller.deleteBilling);

router.get("/generate/CodeRentalBiling",[passport.authenticate("jwt", { session: false }), middleware.isAdmin],controller.generateCodeRentalBiling);

module.exports = router;