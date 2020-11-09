const express = require('express');
const router = express.Router();
const multer = require("multer");
const passport = require('passport');
const middleware = require("../middleware/userrole");
const controller = require("./controller");

router.get("/project/export", [], controller.downloadFormatProject);
router.get("/block/export", [], controller.downloadFormatBlock);
router.get("/floor/export", [], controller.downloadFormatFloor);
router.get("/unit/export", [], controller.downloadFormatUnit);
router.get("/unittype/export", [], controller.downloadFormatUnitType);
router.get("/customer/export", [], controller.downloadFormatCustomer);
router.get("/parkinglot/export", [], controller.downloadFormatParkinglot);
router.get("/unitrate/export", [], controller.downloadFormatUnitRate);
router.get("/billing/export", [], controller.downloadFormatBilling);
router.get("/owner/export", [], controller.downloadFormatOwner);
router.get("/lease/export", [], controller.downloadFormatLease);
router.get("/deposit/export", [], controller.downloadFormatDeposit);
router.get("/powermas/export", [], controller.downloadFormatPowMaster);
router.get("/watermas/export", [], controller.downloadFormatWatMaster);
router.get("/gasmas/export", [], controller.downloadFormatGasMaster);
router.get("/engineer/export", [], controller.downloadFormatEngineer);

router.get("/category/export", [], controller.downloadFormatLocation);



router.get("/leasebilling/export", [], controller.downloadFormatLeaseBilling);
router.get("/rentalbilling/export", [], controller.downloadFormatRental);
router.get("/parkingbilling/export", [], controller.downloadFormatParkingBilling);

router.get("/export/electricity/consumption", [], controller.downloadFormatPowerConsumption);
router.get("/export/water/consumption", [], controller.downloadFormatWaterConsumption);
router.get("/export/gas/consumption", [], controller.downloadFormatGasConsumption);
router.post("/project/import", multer({ dest: 'upload/'}).single('file'), controller.uploadProjectExcel);
router.post("/block/import", multer({ dest: 'upload/'}).single('file'), controller.uploadBlockExcel);
router.post("/floor/import", multer({ dest: 'upload/'}).single('file'), controller.uploadFloor);
router.post("/unit/import", multer({ dest: 'upload/'}).single('file'), controller.uploadUnit2);
router.post("/unittype/import", multer({ dest: 'upload/'}).single('file'), controller.uploadUnitTypeExcel);
router.post("/unitrate/import", multer({ dest: 'upload/'}).single('file'), controller.uploadUnitRateExcel);
router.post("/customer/import", multer({ dest: 'upload/'}).single('file'), controller.uploadCustomer);
router.post("/owner/import", multer({ dest: 'upload/'}).single('file'), controller.uploadOwner);
router.post("/lease/import", multer({ dest: 'upload/'}).single('file'), controller.uploadLease);
router.post("/upload/electricityconsumption", multer({ dest: 'upload/'}).single('file'), controller.uploadElectricityConsExcel);
router.post("/upload/waterconsumption", multer({ dest: 'upload/'}).single('file'), controller.uploadWaterConsExcel);
router.post("/upload/gasconsumption", multer({ dest: 'upload/'}).single('file'), controller.uploadGasConsExcel);
router.post("/powermas/import", multer({ dest: 'upload/'}).single('file'), controller.uploadMasterPower);
router.post("/watermas/import", multer({ dest: 'upload/'}).single('file'), controller.uploadMasterWater);
// router.post("/gasmas/import", multer({ dest: 'upload/'}).single('file'), controller.uploadMasterGas);
module.exports = router;