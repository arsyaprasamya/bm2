const express = require('express');
const router = express.Router();
const passport = require('passport');
const middleware = require("../../middleware/userrole");
const controller = require("./controller");


router.get("/", [passport.authenticate('jwt', {session: false}), middleware.isAdmin, middleware.isOperator], controller.transaksiList);
router.get("/unpost", [passport.authenticate('jwt', {session: false}), middleware.isAdmin, middleware.isOperator], controller.ListCheckerFalse);
router.get("/posted", [passport.authenticate('jwt', {session: false}), middleware.isAdmin, middleware.isOperator], controller.ListCheckerTrue);
router.get("/:id", [passport.authenticate('jwt', {session: false}), middleware.isAdmin, middleware.isOperator], controller.transaksiById);
router.get("/unit/:id", [passport.authenticate('jwt', {session: false}), middleware.isAdmin, middleware.isOperator], controller.getTransaksiUnit);
router.post('/add', [passport.authenticate('jwt', {session: false}), middleware.isAdmin, middleware.isOperator], controller.tambahTransaksi);
router.patch('/edit/:id', [passport.authenticate('jwt', {session: false}), middleware.isAdmin, middleware.isOperator], controller.transaksiUpdate);
router.patch('/posting', [passport.authenticate('jwt', {session: false}), middleware.isAdmin, middleware.isOperator], controller.UpdateChecker);
router.delete('/delete/:id', [passport.authenticate('jwt', {session: false}), middleware.isAdmin, middleware.isOperator], controller.transaksiDelete);
router.get("/mobilelist", [passport.authenticate('jwt', {session: false}), middleware.isAdmin], controller.transaksiListMobile);
router.get("/transaksi/:id", [passport.authenticate('jwt', {session: false}), middleware.isUser], controller.transaksiByIdMobile);
router.post('/addmobile', [passport.authenticate('jwt', {session: false}), middleware.isEngineer], controller.tambahTransaksiMobile);

module.exports = router;