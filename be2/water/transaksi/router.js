const express = require('express');
const router = express.Router();
const passport = require('passport');
const middleware = require("../../middleware/userrole");
const controller = require("./controller");

router.get("/list", [passport.authenticate('jwt', {session: false}), middleware.isAdmin, middleware.isOperator], controller.transaksiList);
router.get("/posted", [passport.authenticate('jwt', {session: false}), middleware.isAdmin, middleware.isOperator], controller.ListCheckerTrue);
router.get("/unpost", [passport.authenticate('jwt', {session: false}), middleware.isAdmin, middleware.isOperator], controller.ListCheckerFalse);
router.get("/:id", [passport.authenticate('jwt', {session: false}), middleware.isAdmin, middleware.isOperator], controller.transaksiById);
router.get("/unit/:id", [passport.authenticate('jwt', {session: false}), middleware.isAdmin, middleware.isOperator], controller.getTransaksiUnit);
router.post('/add', [passport.authenticate('jwt', {session: false}), middleware.isAdmin, middleware.isOperator], controller.tambahTransaksi);
router.patch('/edit/:id', [passport.authenticate('jwt', {session: false}), middleware.isAdmin, middleware.isOperator], controller.transaksiUpdate);
router.patch('/posting', [passport.authenticate('jwt', {session: false}), middleware.isAdmin, middleware.isOperator], controller.UpdateChecker);
router.delete('/delete/:id', [passport.authenticate('jwt', {session: false}), middleware.isAdmin, middleware.isOperator], controller.transaksiDelete);
router.post('/addwatermobile', [passport.authenticate('jwt', {session: false}), middleware.isEngineer], controller.tambahTransaksiWaterMobile);
router.get("/wateridmobile/:id", [passport.authenticate('jwt', {session: false}), middleware.isEngineer], controller.transaksiById);

module.exports = router;