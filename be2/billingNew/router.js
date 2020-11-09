const express = require("express");
const router = express.Router();
const passport = require("passport");
const middleware = require("../middleware/userrole");
const controller = require("./controller");

router
  .route("/generateBilNum")
  .get(
    [passport.authenticate("jwt", { session: false }), middleware.isAdmin],
    controller.generateBillNum
  );

router
  .route("/getBillContract")
  .get(
    [passport.authenticate("jwt", { session: false }), middleware.isAdmin],
    controller.getBillingContract
  );

router
  .route("/generateBilling")
  .post(
    [passport.authenticate("jwt", { session: false }), middleware.isAdmin],
    controller.autoCreateBilling
  );

router
  .route("/")
  .post(
    [passport.authenticate("jwt", { session: false }), middleware.isAdmin],
    controller.createBilling
  )
  .get(
    [passport.authenticate("jwt", { session: false }), middleware.isAdmin],
    controller.getAllBilling
  );

router
  .route("/:id")
  .get(
    [passport.authenticate("jwt", { session: false }), middleware.isAdmin],
    controller.getBillingById
  )
  .patch(
    [passport.authenticate("jwt", { session: false }), middleware.isAdmin],
    controller.updateBilling
  )
  .delete(
    [passport.authenticate("jwt", { session: false }), middleware.isAdmin],
    controller.deleteBilling
  );

module.exports = router;
