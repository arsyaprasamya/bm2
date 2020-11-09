const express = require('express');
const router = express.Router();
const master = require("./master/router");
const rate = require("./rate/router");
const transaksi = require("./transaksi/router");


router.use("/master", master);
router.use("/rate", rate);
router.use("/transaksi",transaksi);

module.exports = router;