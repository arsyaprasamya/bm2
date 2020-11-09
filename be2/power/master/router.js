const express = require('express');
const router = express.Router();
const passport = require('passport');
const middleware = require("../../middleware/userrole");
const controller = require("./controller");

router.get("/list", [passport.authenticate('jwt', {session: false}), middleware.isAdmin, middleware.isOperator], controller.listPwr);
router.get("/listmobile", [passport.authenticate('jwt', {session: false}), middleware.isUser], controller.listPwrMobile);
router.get("/qrgen", [passport.authenticate('jwt', {session: false}), middleware.isAdmin], controller.createQR);
router.get("/:id", [passport.authenticate('jwt', {session: false}), middleware.isAdmin, middleware.isOperator], controller.findPower);
router.post("/qrcodemobile", [passport.authenticate('jwt', {session: false}), middleware.isAdmin, middleware.isOperator], controller.createQRmobile);
router.post('/add', [passport.authenticate('jwt', {session: false}), middleware.isAdmin, middleware.isOperator], controller.addPwr);
router.post('/addpowermobile', [passport.authenticate('jwt', {session: false}), middleware.isUser], controller.addPwrMobile);
router.patch('/edit/:id', [passport.authenticate('jwt', {session: false}), middleware.isAdmin, middleware.isOperator], controller.updatePwr);
router.delete('/delete/:id', [passport.authenticate('jwt', {session: false}), middleware.isAdmin, middleware.isOperator], controller.deletePwr);


module.exports = router;