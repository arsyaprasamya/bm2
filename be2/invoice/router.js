const express = require('express');
const router = express.Router();
const passport = require('passport');
const middleware = require("../middleware/userrole");
const controller = require("./controller");

router.get("/list", [passport.authenticate('jwt', {session: false}), middleware.isAdmin, middleware.isOperator], controller.listInvoice);
router.get("/:id", [passport.authenticate('jwt', {session: false}), middleware.isAdmin, middleware.isOperator], controller.getInvoiceByID);
router.post('/add', [passport.authenticate('jwt', {session: false}), middleware.isAdmin, middleware.isOperator], controller.tambahInvoice);
router.patch('/edit/:id', [passport.authenticate('jwt', {session: false}), middleware.isAdmin, middleware.isOperator], controller.editInvoice);
router.delete('/delete/:id', [passport.authenticate('jwt', {session: false}), middleware.isAdmin, middleware.isOperator], controller.HapusInvoice);
router.get("/generate/invoice",[passport.authenticate("jwt", { session: false }), middleware.isAdmin],controller.generateCodeInvoice);
router.get("/createinvoice/:id",[passport.authenticate("jwt", { session: false }), middleware.isAdmin],controller.createInvoice);
router.get("/createinvoice2/:id",[passport.authenticate("jwt", { session: false }), middleware.isAdmin],controller.createInvoiceAdmin);


module.exports = router;