const express = require('express');
const router = express.Router();
const passport = require('passport');
const middleware = require("../../middleware/userrole");
const controller = require("./controller");

router.get("/list", [passport.authenticate('jwt', {session: false}), middleware.isAdmin, middleware.isOperator], controller.tenantList);
router.get("/listm", [passport.authenticate('jwt', {session: false}), middleware.isUser], controller.tenantListMobile);
router.get("/:id", [passport.authenticate('jwt', {session: false}), middleware.isAdmin, middleware.isOperator], controller.tenantGet);
router.get("/generate/:id", [passport.authenticate('jwt', {session: false}), middleware.isAdmin, middleware.isOperator], controller.tenantNumber);
router.post('/add', [passport.authenticate('jwt', {session: false}), middleware.isAdmin, middleware.isOperator], controller.tenantAdd);
router.patch('/edit/:id', [passport.authenticate('jwt', {session: false}), middleware.isAdmin, middleware.isOperator], controller.tenantUpdate);
router.delete('/delete/:id', [passport.authenticate('jwt', {session: false}), middleware.isAdmin, middleware.isOperator], controller.tenantDelete);


module.exports = router;