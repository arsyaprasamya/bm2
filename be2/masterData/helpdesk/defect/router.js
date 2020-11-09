const express = require('express');
const router = express.Router();
const passport = require('passport');
const middleware = require("../../../middleware/userrole");
const controller = require("./controller");

router.get("/", [passport.authenticate('jwt', {session: false}), middleware.isAdmin], controller.Defect);
router.get("/relation/category", [passport.authenticate('jwt', {session: false}), middleware.isAdmin], controller.listCategory);
router.get("/:id/", [passport.authenticate('jwt', {session: false}), middleware.isUser], controller.DefectById);
router.get("/relation/category/:id/", [passport.authenticate('jwt', {session: false}), middleware.isAdmin], controller.CategoryById);
router.get("/parent/:id/", [passport.authenticate('jwt', {session: false}), middleware.isUser], controller.DefectByParent);
router.get("/generate/code", [passport.authenticate('jwt', {session: false}), middleware.isAdmin], controller.DefectGenerator);
router.post('/add', [passport.authenticate('jwt', {session: false}), middleware.isAdmin], controller.tambahDefect);
router.patch('/edit/:id', [passport.authenticate('jwt', {session: false}), middleware.isAdmin], controller.updateDefect);
router.delete('/delete/:id', [passport.authenticate('jwt', {session: false}), middleware.isAdmin], controller.hapusDefect);


module.exports = router;