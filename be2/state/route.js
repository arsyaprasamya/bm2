const express = require('express');
const router = express.Router();
const passport = require('passport');
const middleware = require("../middleware/userrole");
const controller = require("./controller");

router.get('/insertState', controller.createState);
router.get("/province",  controller.getProvince);
router.get("/regency",  controller.getRegency);
router.get("/district",  controller.getDistrict);
router.get("/village",  controller.getVillage);
router.get("/regency/:id", controller.getRegencyByParent);
router.get("/district/:id", controller.getDistrictByParent);
router.get("/village/:id", controller.getVillageByParent);
router.get("/kodepos/:kecamatan", controller.getKodePosByParent);

module.exports = router;