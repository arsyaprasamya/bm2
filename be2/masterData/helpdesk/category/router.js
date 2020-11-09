const express = require('express');
const router = express.Router();
const passport = require('passport');
const middleware = require("../../../middleware/userrole");
const controller = require("./controller");

router.get("/", [passport.authenticate('jwt', {session: false}), middleware.isAdmin, middleware.isAdmin], controller.Category);
router.get("/:id/", [passport.authenticate('jwt', {session: false}), middleware.isUser], controller.CategoryById);
router.get("/generate/code", [passport.authenticate('jwt', {session: false}), middleware.isAdmin, middleware.isAdmin], controller.CategoryGenerator);
router.post('/add', [passport.authenticate('jwt', {session: false}), middleware.isAdmin, middleware.isAdmin], controller.tambahCategory);
router.patch('/edit/:id', [passport.authenticate('jwt', {session: false}), middleware.isAdmin, middleware.isAdmin], controller.updateCategory);
router.delete('/delete/:id', [passport.authenticate('jwt', {session: false}), middleware.isAdmin, middleware.isAdmin],controller.hapusCategory);


//categorymobile
router.get("/list/mobile", [passport.authenticate('jwt', {session: false}), middleware.isUser], controller.CategoryMobile);
module.exports = router;