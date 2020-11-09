/**
 *
 * @type {Start Application Server}
 */

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const globalErrorHandler = require("./controllers/errorController");
const config = require("./config");
const userrouter = require("./routes/user");
const blockgroup = require("./blockgroup/router");
const block = require("./block/router");
const building = require("./building/router");
const floor = require("./floor/router");
const unit = require("./unit/router");
const gas = require("./gas/index");
const power = require("./power/index");
const water = require("./water/index");
const parking = require("./parkinglot/route");
const customer = require("./customer/router");
const vt = require("./vehicletype/route");
const state = require("./state/route");
const datashare = require("./excel/route");
const unittype = require("./unittype/router");
const contractLease = require("./contract/tenant/router");
const contractOwner = require("./contract/owner/router");
const contract = require("./contract/router");
const billing = require("./billing/router");
const unitrate = require("./unitrate/router");
const deposit = require("./deposit/router");
const acctype = require("./masterData/COA/AccountType/router");
const acct = require("./masterData/COA/account/router");
const fiscal = require("./masterData/Asset/FiscalFixedAsset/router");
const fixedAsset = require("./masterData/Asset/FixedAsset/router");
const uom = require("./masterData/Asset/uom/router");
const pnltyrate = require("./masterData/penaltyRate/router");
const bank = require("./masterData/bank/router");
const bankacct = require("./masterData/bank/account/router");
const rentalbilling = require("./rentalBilling/router")
const leasebilling = require("./leaseBilling/router")
const parkingbilling = require("./parkBilling/router")
const tax = require("./masterData/tax/router");
const category = require("./masterData/helpdesk/category/router");
const defect = require("./masterData/helpdesk/defect/router");
const subdefect = require("./masterData/helpdesk/subdefect/router");
const engineer = require("./masterData/engineer/router");
const role = require("./routes/role");
const application = require("./routes/application");
const additionParking = require("./parkinglot/additional/router");
const ticket = require("./helpdesk/ticket/router");
const deliveryOrder = require("./helpdesk/deliveryOrder/router");
const rating = require("./rating/router");
const mstRevenue = require("./masterData/revenueRental/router");
const revenue = require("./revenue/router");
const assetManagement = require("./asset/assetManagement/router");
const assetDepreciation = require("./asset/assetDepreciation/router");
const newBilling = require("./billingNew/router");
const cashBank = require("./cashbank/router");
const invoice = require ("./invoice/router");


const listCollections = [];

const today = new Date();

const date = `${today.getDate()}/${
  today.getMonth() + 1
}/${today.getFullYear()}`;

const time = `${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`;

// database connection
mongoose.connect(config.dbUrl, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});
const db = mongoose.connection;

db.on("error", (error) => console.log(error));
db.once("open", async () => {
  // const list = await db.db.listCollections().toArray();
  // for (const el of list) {
  //   listCollections.push({collections: el.name});
  // }
  // console.log(listCollections);
  console.log("DB Connected");
});

// config cors for whitelist address
app.use(cors());

//passport authentication
app.use(passport.initialize());
require("./passportconfig")(passport);

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/js", express.static(__dirname + "/node_modules/bootstrap/dist/js"));
app.use("/js", express.static(__dirname + "/node_modules/jquery/dist"));
app.use("/css", express.static(__dirname + "/node_modules/bootstrap/dist/css"));
app.use("/ticketImages", express.static(__dirname + "/upload/ticket/"));
app.use("/doImages", express.static(__dirname + "/upload/do/"));
app.use(express.static("src"))

//route
app.use("/bm", (req, res, next) => {
  res.send(`<h1>Connected to server ${date} ${time}</h1>`);
});
app.use("/api/user", userrouter);
app.use("/api/blockgroup", blockgroup);
app.use("/api/block", block);
app.use("/api/building", building);
app.use("/api/floor", floor);
app.use("/api/unit", unit);
app.use("/api/gas", gas);
app.use("/api/power", power);
app.use("/api/water", water);
app.use("/api/parking", parking);
app.use("/api/customer", customer);
app.use("/api/vehicletype", vt);
app.use("/api/state", state);
app.use("/api/excel", datashare);
app.use("/api/unittype", unittype);
app.use("/api/contract/lease", contractLease);
app.use("/api/contract/ownership", contractOwner);
app.use("/api/contract", contract);
app.use("/api/billing", billing);
app.use("/api/rentalbilling", rentalbilling);
app.use("/api/parkingbilling", parkingbilling);
// app.use("/api/rentalbilling2", rentalbilling2);
app.use("/api/cashbank", cashBank);
app.use("/api/leasebilling", leasebilling);
app.use("/api/newBilling", newBilling);
app.use("/api/unitrate", unitrate);
app.use("/api/deposit", deposit);
app.use("/api/acctype", acctype);
app.use("/api/acct", acct);
app.use("/api/fiscalfa", fiscal);
app.use("/api/fixedasset", fixedAsset);
app.use("/api/uom", uom);
app.use("/api/invoice", invoice);


app.use("/api/pnltyrate", pnltyrate);
app.use("/api/bank", bank);
app.use("/api/bankacct", bankacct);
app.use("/api/tax", tax);
app.use("/api/category", category);
app.use("/api/defect", defect);
app.use("/api/subdefect", subdefect);
app.use("/api/role", role);
app.use("/api/application", application);
app.use("/api/additionalParking", additionParking);
app.use("/api/engineer", engineer);
app.use("/api/ticket", ticket);
app.use("/api/do", deliveryOrder);
app.use("/api/rating", rating);
app.use("/api/mstrevenue", mstRevenue);
app.use("/api/revenue", revenue);
app.use("/api/asset/management", assetManagement);
app.use("/api/asset/deprecitiaion", assetDepreciation);


app.use(globalErrorHandler);

//server start
app.listen(config.port, () => console.log(`server started`));
