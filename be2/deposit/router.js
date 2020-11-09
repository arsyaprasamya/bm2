const express = require('express');
const router = express.Router();
const passport = require('passport');
const middleware = require("../middleware/userrole");
const controller = require("./controller");

router.get("/list", [passport.authenticate('jwt', {session: false}), middleware.isAdmin, middleware.isOperator], controller.listDeposit);
router.get("/generatecode", [passport.authenticate('jwt', {session: false}), middleware.isAdmin, middleware.isOperator], controller.InvCodeGenerator);
router.get("/getuser", [passport.authenticate('jwt', {session: false}), middleware.isAdmin, middleware.isOperator], controller.GetUser);
// router.get("/export/:id/", [], controller.ExportPDFinvoice);
// router.get("/export2/:id/", [], controller.ExportPDFinvoice2);

router.get("/:id", [passport.authenticate('jwt', {session: false}), middleware.isAdmin, middleware.isOperator], controller.getDepositByID);
router.post('/add', [passport.authenticate('jwt', {session: false}), middleware.isAdmin, middleware.isOperator], controller.tambahDeposit);
router.patch('/edit/:id', [passport.authenticate('jwt', {session: false}), middleware.isAdmin, middleware.isOperator], controller.editDeposit);
router.delete('/delete/:id', [passport.authenticate('jwt', {session: false}), middleware.isAdmin, middleware.isOperator], controller.HapusDeposit);


router.get("/listmobile", [passport.authenticate('jwt', {session: false}), middleware.isUser], controller.listDepositMobile);
router.get("/mobile/:id", [passport.authenticate('jwt', {session: false}), middleware.isUser], controller.getDepositByIdMobile);
router.post('/addmobile', [passport.authenticate('jwt', {session: false}), middleware.isUser], controller.tambahDepositMobile);
router.patch('/editmobile/:id', [passport.authenticate('jwt', {session: false}), middleware.isUser], controller.editDepositMobile);
router.delete('/deletemobile/:id', [passport.authenticate('jwt', {session: false}), middleware.isUser], controller.HapusDepositMobile);


module.exports = router;