const express = require('express');
const router = express.Router();
const passport = require('passport');
const middleware = require("../middleware/userrole");
const controller = require("./controller");


//get all list ticket 0 - 1000 list
router.get("/", [passport.authenticate('jwt', {session: false}),middleware.isAdmin], controller.Ticket);

//get list ticket where status = open
router.get("/open", [passport.authenticate('jwt', {session: false}), middleware.isAdmin], controller.TicketByOpen);

//count document where status = open
router.get("/count/open", [passport.authenticate('jwt', {session: false}), middleware.isAdmin], controller.GetCountStatusByOpen);

//count document where status = Waiting for confirmation Or Waiting Scheduled
router.get("/count/waiting", [passport.authenticate('jwt', {session: false}), middleware.isAdmin], controller.GetCountStatusByWaiting);

//count document where status = Scheduled
router.get("/count/scheduled", [passport.authenticate('jwt', {session: false}), middleware.isAdmin], controller.GetCountStatusByScheduled);

//count document where status = Rescheduled
router.get("/count/rescheduled", [passport.authenticate('jwt', {session: false}), middleware.isAdmin], controller.GetCountStatusByRescheduled);

//count document where status = Rejected
router.get("/count/rejected", [passport.authenticate('jwt', {session: false}), middleware.isAdmin], controller.GetCountStatusByRejected);

//count document where status = Deorder
router.get("/count/deorder", [passport.authenticate('jwt', {session: false}), middleware.isAdmin], controller.GetCountStatusByDeorder);

//count document where status = Visit
router.get("/count/visit", [passport.authenticate('jwt', {session: false}), middleware.isAdmin], controller.GetCountStatusByVisit);

//count document where status = Fixed
router.get("/count/fixed", [passport.authenticate('jwt', {session: false}), middleware.isAdmin], controller.GetCountStatusByFixed);

//count document where status = Reported
router.get("/count/reported", [passport.authenticate('jwt', {session: false}), middleware.isAdmin], controller.GetCountStatusByReported);

//count document where status = Unreported
router.get("/count/unreported", [passport.authenticate('jwt', {session: false}), middleware.isAdmin], controller.GetCountStatusByUnreported);

//count document where status = Done
router.get("/count/done", [passport.authenticate('jwt', {session: false}), middleware.isAdmin], controller.GetCountStatusByDone);

//count document where status = Not Finished
router.get("/count/unfinished", [passport.authenticate('jwt', {session: false}), middleware.isAdmin], controller.GetCountStatusByNotfinish);

//get list document where rated = true
router.get("/rated", [passport.authenticate('jwt', {session: false}), middleware.isAdmin], controller.TicketByRated);

//get list document where rated = false
router.get("/unrated", [passport.authenticate('jwt', {session: false}), middleware.isAdmin], controller.TicketByUnrated);

//get username current user login(For admin)
router.get("/generate/admin", [passport.authenticate('jwt', {session: false}), middleware.isAdmin], controller.GetUser);

//get username current user login(For User)
router.get("/generate/user", [passport.authenticate('jwt', {session: false}), middleware.isAdmin], controller.GetUser);

//get username current user login(For SPV)
router.get("/generate/supervisor", [passport.authenticate('jwt', {session: false}), middleware.isAdmin], controller.GetUser);

//get get list ticket for only current user logged in
router.get("/userlist", [passport.authenticate('jwt', {session: false}), middleware.isAdmin], controller.listUser);

//get list ticket where status = wait for schedule
router.get("/waitschedule", [passport.authenticate('jwt', {session: false}), middleware.isAdmin], controller.TicketByWaitSchedule);

//get list ticket where status = delivery order
router.get("/deorder", [passport.authenticate('jwt', {session: false}), middleware.isAdmin], controller.TicketBydeorder);

//get list ticket where status = delivery order or fixed
router.get("/dofixed", [passport.authenticate('jwt', {session: false}), middleware.isAdmin], controller.TicketBydofixed);

//get list ticket where status = fixed
router.get("/fixed", [passport.authenticate('jwt', {session: false}), middleware.isAdmin], controller.TicketByfixed);

//get list ticket where status = reported
router.get("/reported", [passport.authenticate('jwt', {session: false}), middleware.isAdmin], controller.TicketByReported);

//get list ticket where status = reported
router.get("/spv/reported", [passport.authenticate('jwt', {session: false}), middleware.isAdmin], controller.TicketByReported);

//get list ticket where status = report
router.get("/report", [passport.authenticate('jwt', {session: false}), middleware.isAdmin], controller.TicketByreport);

//get list ticket where status = reported or fixed
router.get("/repfix", [passport.authenticate('jwt', {session: false}), middleware.isAdmin], controller.TicketByRepFix);

//get list ticket where status = wait for confirmation
router.get("/waitconf", [passport.authenticate('jwt', {session: false}), middleware.isAdmin], controller.TicketByWaitConf);

//get list ticket where status = scheduled
router.get("/scheduled", [passport.authenticate('jwt', {session: false}), middleware.isAdmin], controller.TicketByScheduled);

//get list ticket where status = done
router.get("/done", [passport.authenticate('jwt', {session: false}), middleware.isAdmin], controller.TicketByDone);

//get list ticket where status = cancel
router.get("/cancel", [passport.authenticate('jwt', {session: false}), middleware.isAdmin], controller.TicketByCancel);

//get list ticket where status = reschedule
router.get("/reschedule", [passport.authenticate('jwt', {session: false}), middleware.isAdmin], controller.TicketByRes);

//get list ticket for spv only
router.get("/spv", [passport.authenticate('jwt', {session: false}), middleware.isAdmin], controller.TicketBySPV);

//get list ticket where status = reject
router.get("/reject", [passport.authenticate('jwt', {session: false}), middleware.isAdmin], controller.TicketByReject);

//get list ticket where status = visit
router.get("/visit", [passport.authenticate('jwt', {session: false}), middleware.isAdmin], controller.TicketByVisit);

//get list ticket for user only
router.get("/user", [passport.authenticate('jwt', {session: false}), middleware.isAdmin], controller.TicketByUser);

//get list ticket for engineer only
router.get("/engineer", [passport.authenticate('jwt', {session: false}), middleware.isAdmin], controller.TicketByEngineer);

//get engineer list using array of object
router.get("/engineer/arr/:id", [passport.authenticate('jwt', {session: false}), middleware.isAdmin], controller.GetEngineerArr);

//get date list using array of object
router.get("/date/arr/:id", [passport.authenticate('jwt', {session: false}), middleware.isAdmin], controller.GetDateArr);

//get engineer list from ticket service
router.get("/relation/engineer", [passport.authenticate('jwt', {session: false}), middleware.isAdmin], controller.getEngineer);

//get customer unit By ID from ticket service
router.get("/customer/:id", [passport.authenticate('jwt', {session: false}), middleware.isAdmin], controller.getUnitCustomer);

//get engineer list from ticket service By ID
router.get("/relation/engineer/:id", [passport.authenticate('jwt', {session: false}), middleware.isAdmin], controller.getEngineerByID);

//get customer list from ticket service
router.get("/relation/customer", [passport.authenticate('jwt', {session: false}), middleware.isAdmin], controller.getCustomer);

//get category list from ticket service
router.get("/relation/category", [passport.authenticate('jwt', {session: false}), middleware.isAdmin], controller.getCategory);

//get unit list from ticket service
router.get("/relation/unit", [passport.authenticate('jwt', {session: false}), middleware.isAdmin], controller.getUnit);

//get unit list from ticket service By ID
router.get("/relation/unit/:id", [passport.authenticate('jwt', {session: false}), middleware.isAdmin],controller.getUnitByID);

//generate code for ticket_id
router.get("/generate/code", [passport.authenticate('jwt', {session: false}), middleware.isAdmin], controller.ticketCodeGenerator);

//generate code for delivery order
router.get("/generate/docode", [passport.authenticate('jwt', {session: false}), middleware.isAdmin], controller.doCodeGenerator);

//get ticket list By ID
router.get("/:id/", [passport.authenticate('jwt', {session: false}), middleware.isAdmin], controller.TicketById);

//export Delivery order and render to PDF
router.get("/export/:id/", [], controller.ExportPDFdeorder);

//export Delivery order2 and render to PDF
router.get("/export2/:id/", [], controller.ExportPDFdeorder2);

//export report and render to PDF
router.get("/exportreport/:id/", [], controller.ExportPDFreport);

//export image pdf view
router.get("/exportimage/:id/", [], controller.ExportPDFimage);

//export ticket and render to PDF
router.get("/exportticket/:id/", [], controller.ExportPDFticket);

//Send email for reset password
router.post("/email/resetpass/:id/", [], controller.ExportHTMLresetPassword);

//Send email while status Open
router.post("/email/open/:id/", [], controller.ExportHTMLopen);

//Send email while status Scheduled
router.post("/email/scheduled/:id/", [], controller.ExportHTMLscheduled);

//Send email while status Rescheduled
router.post("/email/rescheduled/:id/", [], controller.ExportHTMLrescheduled);

//Send email while status Cancel
router.post("/email/cancel/:id/", [], controller.ExportHTMLcancel);

//Send email while status Done
router.post("/email/done/:id/", [], controller.ExportHTMLdone);

//add ticket(For admin)
router.post('/add', [passport.authenticate('jwt', {session: false}), middleware.isAdmin], controller.tambahTicket);

//add ticket(For User)
router.post('/addticket', [passport.authenticate('jwt', {session: false}),middleware.isAdmin], controller.tambahTicket);

//edit ticket by ID
router.patch('/edit/:id', [passport.authenticate('jwt', {session: false}), middleware.isAdmin], controller.updateTicket);

//edit status by iD
router.patch('/edit/status/:id', [passport.authenticate('jwt', {session: false}), middleware.isAdmin],controller.updateStatus);

//delete ticket document by ID
router.delete('/delete/:id', [passport.authenticate('jwt', {session: false}), middleware.isAdmin], controller.hapusTicket);


router.use(express.static('ticket/template'))

module.exports = router;