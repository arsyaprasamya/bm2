const express = require('express');
const router = express.Router();
const passport = require('passport');
const middleware = require("../../../middleware/userrole");
const controller = require("./controller");

router.get("/", [passport.authenticate('jwt', {session: false}), middleware.isAdmin], controller.SubDefect);
router.get("/relation/category", [passport.authenticate('jwt', {session: false}), middleware.isAdmin], controller.listDefect);
router.get("/:id/", [passport.authenticate('jwt', {session: false}), middleware.isAdmin], controller.SubDefectById);
router.get("/relation/category/:id/", [passport.authenticate('jwt', {session: false}), middleware.isAdmin], controller.DefectById);
router.get("/parent/:id/", [passport.authenticate('jwt', {session: false}), middleware.isUser], controller.SubDefectByParent);
router.get("/generate/code", [passport.authenticate('jwt', {session: false}), middleware.isAdmin], controller.SubDefectGenerator);
router.post('/add', [passport.authenticate('jwt', {session: false}), middleware.isAdmin], controller.tambahSubDefect);
router.patch('/edit/:id', [passport.authenticate('jwt', {session: false}), middleware.isAdmin], controller.updateSubDefect);
router.delete('/delete/:id', [passport.authenticate('jwt', {session: false}), middleware.isAdmin], controller.hapusSubDefect);


module.exports = router;