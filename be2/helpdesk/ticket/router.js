const express = require("express");
const passport = require("passport");

const middleware = require("../../middleware/userrole");
const controller = require("./controller");


const router = express.Router();

router
  .route("/generateTicketCode")
  .get(
    [passport.authenticate("jwt", { session: false }), middleware.isUser],
    controller.generateCodeTicket
  );

//getTicketByIdMobile
router
  .route("/TicketIdMobile/:id")
  .get(
    [passport.authenticate("jwt", { session: false }), middleware.isEngineer],
    controller.getTicketByIdMobile
  );

  router
  .route("/TicketIdMobile/:id")
  .get(
    [passport.authenticate("jwt", { session: false }), middleware.isUser],
    controller.getTicketByIdMobile
  );

router
  .route("/userTicket/:id")
  .get(
    [passport.authenticate("jwt", { session: false }), middleware.isAdmin],
    controller.getTicketByUser
  );

//get tiket by User Mobile
router
  
  .get("/userticketmobile/:id",
  
    [passport.authenticate("jwt", { session: false }), middleware.isUser],
    controller.getTicketByUserMobile
  );


//get tiket by engineer mobile
router
.get("/engineerticketmobile/:id",
  
[passport.authenticate("jwt", { session: false }), middleware.isEngineer],
controller.getTicketByEngineerMobile
);
//Get All tiket Mobile
router
  .route("/allmobile")
  .get(
    [passport.authenticate("jwt", { session: false }), middleware.isUser],
    controller.getAllTicketMobile
  )
router
  .route("/:id/image")
  .get(
    [passport.authenticate("jwt", { session: false }), middleware.isAdmin],
    controller.getImages
  );

  //Get Image Mobile
  router
  .route("/:id/imagemobile")
  .get(
    [passport.authenticate("jwt", { session: false }), middleware.isUser],
    controller.getImagesMobile
  );

  

router
  .route("/")
  .get(
    [passport.authenticate("jwt", { session: false }), middleware.isAdmin],
    controller.getAllTicket
  )
  .post(
    [passport.authenticate("jwt", { session: false }), middleware.isAdmin],
    controller.uploadTicketPhoto,
    controller.resizeTicketPhoto,
    controller.createTicket
  );

//create tiket mobile
router
.post("/createmobile",
  [passport.authenticate("jwt", { session: false }), middleware.isUser],
  controller.uploadTicketPhoto,
  controller.resizeTicketPhoto,
  controller.createTicket
);
// // get Ticket by ID Mobile
// router
// .get("/tiketmobile/:id"
//   [passport.authenticate("jwt", { session: false }), middleware.isAdmin],
//   controller.getTicketByIdMobile
// );
router
  .route("/:id")
  .get(
    [passport.authenticate("jwt", { session: false }), middleware.isAdmin],
    controller.getTicketById
  )
  .patch(
    [passport.authenticate("jwt", { session: false }), middleware.isAdmin],
    controller.updateTicket
  )
  .delete(
    [passport.authenticate("jwt", { session: false }), middleware.isAdmin],
    controller.deleteTicket
  );

module.exports = router;
