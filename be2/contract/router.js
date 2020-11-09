const express = require("express");
const passport = require("passport");

const middleware = require("../middleware/userrole");
const controller = require("./controller");

const router = express.Router();

router
  .route("/listUnitContract")
  .get(
    [passport.authenticate("jwt", { session: false }), middleware.isAdmin],
    controller.listContract
  );





router.get(
  "/listUnitUser/:id",
  [
    passport.authenticate("jwt", { session: false }),
    middleware.isAdmin,
    middleware.isOperator,
  ],
  controller.listUnitByTenantWeb
);




router.get(
  "/listUnitUserMobile/:id",
  [
    passport.authenticate("jwt", { session: false }),
    middleware.isUser,
    
  ],
  controller.listUnitByTenant
);
module.exports = router;
