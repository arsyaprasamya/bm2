const Ownership = require("./owner/model").Ownership;
const Lease = require("./tenant/model").Tenant;
const Tenant = require("../customer/model").Customer;
const contractLease = require("./tenant/model");
const User = require("../models/user");
const errorHandler = require("../controllers/errorController");
const { ObjectId } = require("mongodb");
const { OwnershipSchema } = require("./owner/model");

exports.listContract = async (req, res, next) => {
  try {
    // let data = [];
    if (contractLease.typeLease === 1) {
    const dataOwnership = await Ownership.find().populate("unit", "-__v");
    let dataLease = await Lease.find().populate("unit", "-__v");

    dataOwnership.forEach((el, index) => {
      if (el.unit.cdunt !== dataLease[index].unit.cdunt) {
        dataLease.push(el);
      }
      // unit adalah document dari ownershipContract collection, cdunt adalah document dari tblmunit collection
    });
    } else {
      // let data = [];
      let dataLease = await Lease.find().populate("unit", "-__v");

      res.status(200).json({
      status: "success",
      totalCount: dataLease.length,
      data: dataLease,
    });
    }
    } catch (err) {
      console.error(err);
      return errorHandler(err);
    }
  };



exports.listUnitByTenantWeb = async (req, res, next) => {
  try {
    // let data = [];
    if (contractLease.typeLease === 1) {
    const dataOwnership = await Ownership.findById(req.params.id);
    let dataLease = await Lease.findById()
    .populate({
      path: "unit",
      model: "Unit",
      select: "-__v",
      populate: [
      {
        path: "unttp",
        model: "UnitType",
        select: "-__v",
      },
      {
        path: "untrt",
        model: "UnitRate",
        select: "-__v",
      },
    ],
    });
    
   
    dataOwnership.forEach((el, index) => {
      if (el.unit.cdunt !== dataLease[index].unit.cdunt) {
        dataLease.push(el);
      }
      // unit adalah document dari ownershipContract collection, cdunt adalah document dari tblmunit collection
    });
    } else {
      // let data = [];
      const dataOwnership = await Ownership.findById(req.params.id);
      let dataLease = await Lease.findById(req.params.id)
      .populate({
        path: "unit",
        model: "Unit",
        select: "-__v",
        populate: [
        {
          path: "unttp",
          model: "UnitType",
          select: "-__v",
        },
        {
          path: "untrt",
          model: "UnitRate",
          select: "-__v",
        },
      ],
      });
      res.status(200).json({
      status: "success",
      data: dataLease,
    });
    }
    } catch (err) {
      console.error(err);
      return errorHandler(err);
    }
  };


  exports.listUnitByTenant = async (req, res, next) => {
    try {
      const dataUser = await User.findById(req.params.id);
      const dataTenant = await Tenant.findOne({ _id: dataUser.tenant });
      let dataUnit = await Ownership.find({ cstmr: dataTenant._id })
        .populate("cstmr", "-__v")
        .populate({
          path: "unit",
          model: "Unit",
          select: "-__v",
          populate: [
            {
              path: "flr",
              model: "Floor",
              select: "-__v",
              populate: {
                path: "blk",
                model: "Block",
                select: "-__v",
                populate: {
                  path: "grpid",
                  model: "BlockGroup",
                  select: "-__v",
                },
              },
            },
            {
              path: "unttp",
              model: "UnitType",
              select: "-__v",
            },
            {
              path: "untrt",
              model: "UnitRate",
              select: "-__v",
            },
          ],
        });
  
      if (dataUnit.length === 0) {
        dataUnit = await Lease.find({ cstmr: dataTenant._id })
          .populate("cstmr", "-__v")
          .populate({
            path: "unit",
            model: "Unit",
            select: "-__v",
            populate: [
              {
                path: "flr",
                model: "Floor",
                select: "-__v",
                populate: {
                  path: "blk",
                  model: "Block",
                  select: "-__v",
                  populate: {
                    path: "grpid",
                    model: "BlockGroup",
                    select: "-__v",
                  },
                },
              },
              {
                path: "unttp",
                model: "UnitType",
                select: "-__v",
              },
              {
                path: "untrt",
                model: "UnitRate",
                select: "-__v",
              },
            ],
          });
      }
      res.status(200).json({
        status: "success",
        data: dataUnit,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        status: "error",
        message: "Something Went Wrong",
      });
    }
  };
  