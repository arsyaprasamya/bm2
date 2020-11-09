const express = require("express");
const passport = require("passport");

const middleware = require("../../middleware/userrole");
const controller = require("./controller");

const router = express.Router();

router
  .route("/:id/image")
  .get(
    [passport.authenticate("jwt", { session: false }), middleware.isAdmin],
    controller.getImages
  );

router
  .route("/")
  .get(
    [passport.authenticate("jwt", { session: false }), middleware.isAdmin],
    controller.getAllDo
  );

//router all Do Mobile
router
  .get("/alldomobile",
  
    [passport.authenticate("jwt", { session: false }), middleware.isUser],
    controller.getAllDoMobile
  );

//router get by Id Do Mobile
// router
//   .get("/doidmobile/:id",
  
//     [passport.authenticate("jwt", { session: false }), middleware.isUser],
//     controller.getDoByIdMobile
//   );

  router
  .get("/doidmobile/:id",
  
    [passport.authenticate("jwt", { session: false }), middleware.isEngineer],
    controller.getDoByIdMobile
  );

//get DO by ID Engineer Mobile  
router
  .get("/doidusermobile/:id",
  
    [passport.authenticate("jwt", { session: false }), middleware.isEngineer],
    controller.getDoByIdUserMobile
  );

//router patch update Do Mobile
router
.patch("/updatemobile/:id",
  [passport.authenticate("jwt", { session: false }), middleware.isUser],
  controller.uploadDoPhoto,
  controller.resizeDoPhoto,
  controller.updateDoMobile
);

router
  .route("/:id")
  .get(
    [passport.authenticate("jwt", { session: false }), middleware.isAdmin],
    controller.getDoById
  )
  
  .patch(
    [passport.authenticate("jwt", { session: false }), middleware.isAdmin],
    controller.uploadDoPhoto,
    controller.resizeDoPhoto,
    controller.updateDo
  )
  .delete(
    [passport.authenticate("jwt", { session: false }), middleware.isAdmin],
    controller.deleteDo
  );

module.exports = router;
