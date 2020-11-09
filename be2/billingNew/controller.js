const mongoose = require("mongoose");
const Billing = require("./model");
const Ownership = require("../contract/owner/model").Ownership;
const Lease = require("../contract/tenant/model").Tenant;
const Power = require("../power/transaksi/model").TransaksiPower;
const Water = require("../water/transaksi/model").TransaksiWater;

const month = new Date(Date.now()).getMonth();
const year = new Date(Date.now()).getFullYear();
const fromDate = new Date(year, month, 2);
const toDate = new Date(fromDate.getFullYear(), fromDate.getMonth() + 1, 0);

const generateBillingNumber = async (typeBill) => {
  try {
    const condition = { createdDate: { $gte: fromDate, $lte: toDate } };
    const billing = await Billing.find(condition);
    const number = billing.length + 1;

    return `${typeBill}/${year}/${("0" + (month + 1)).slice(-2)}/${(
      "000000" + number
    ).slice(-5)}`;
  } catch (error) {
    console.error(error);
    return false;
  }
};

exports.generateBillNum = async (req, res, next) => {
  try {
    const billnum = await generateBillingNumber(req.query.typeBill);
    if (billnum) {
      res.status(200).json({
        status: "success",
        data: bil8lnum,
      });
    } else {
      res.status(500).json({
        status: "fail",
        message: "internal server error",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "fail",
      message: "internal server error",
    });
  }
};

exports.getBillingContract = async (req, res, next) => {
  try {
    const dataOwnership = await Ownership.find();
    let dataLease = await Lease.find();

    dataOwnership.forEach((el, index) => {
      if (el.unit.cdunt !== dataLease[index].unit.cdunt) {
        dataLease.push(el);
      }
    });

    for (let i = 0; i < dataLease.length; i++) {
      const dataPowerCons = await Power.findOne({
        contract: dataLease[i]._id,
        isPaid: false,
        checker: true,
        cratedDate: { $gte: fromDate, $lte: toDate },
      });
      const dataWaterCons = await Water.findOne({
        contract: dataLease[i]._id,
        isPaid: false,
        checker: true,
        cratedDate: { $gte: fromDate, $lte: toDate },
      });

      if (dataPowerCons && dataWaterCons) {
        dataLease[i].powerConsumption = dataPowerCons;
        dataLease[i].waterConsumption = dataWaterCons;
      } else {
        delete dataLease[i];
      }
    }

    res.status(200).json({
      status: "success",
      data: dataLease,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "fail",
      message: "Internal Server Error",
    });
  }
};

exports.autoCreateBilling = async (req, res, next) => {
  try {
    const session = await mongoose.startSession();
    session.startTransaction();

    let billing = {};
    let flag = false;

    const dataOwnership = await Ownership.find().session(session);
    let dataLease = await Lease.find().session(session);

    dataOwnership.forEach((el, index) => {
      if (el.unit.cdunt !== dataLease[index].unit.cdunt) {
        dataLease.push(el);
      }
    });

    for (let i = 0; i < dataLease.length; i++) {
      const dataPowerCons = await Power.findOne({
        contract: dataLease[i]._id,
        isPaid: false,
        checker: true,
        cratedDate: { $gte: fromDate, $lte: toDate },
      }).session(session);
      const dataWaterCons = await Water.findOne({
        contract: dataLease[i]._id,
        isPaid: false,
        checker: true,
        cratedDate: { $gte: fromDate, $lte: toDate },
      }).session(session);

      if (dataPowerCons && dataWaterCons) {
        billing.billing = {
          serviceCharge: {
            amount: dataContract[i].untrt.service_rate * dataContract[i].untsqr,
          },
          sinkingfund: {
            amountsink:
              dataContract[i].untrt.sinking_fund * dataContract[i].untsqr,
          },
          ipl: {
            amountipl:
              dataContract[i].untrt.service_rate * dataContract[i].untsqr +
              dataContract[i].untrt.sinking_fund * dataContract[i].untsqr,
          },
          electricity: {
            electricTrans: dataPowerCons._id,
          },
          water: {
            waterTrans: dataWaterCons._id,
          },
        };

        billing.billingNumber = generateBillingNumber("IPL");
        billing.contract = dataLease[i]._id;
        billing.billingDate = req.body.billingDate;
        billing.dueDate = req.body.dueDate;
        billing.createdBy = req.body.createdBy;

        const data = await Billing.create([billing], { session });

        if (data) {
          const updatePowerCons = await Power.findByIdAndUpdate(
            dataPowerCons._id,
            { isPaid: true }
          ).session(session);
          const updateWaterCons = await Water.findByIdAndUpdate(
            dataWaterCons._id,
            { isPaid: true }
          ).session(session);

          if (updatePowerCons && updateWaterCons) {
            flag = true;
          } else {
            flag = false;
            break;
          }
        } else {
          flag = false;
          break;
        }
      } else {
        delete dataLease[i];
      }
    }

    if (flag === false) {
      await session.abortTransaction();
      session.endSession();
      res.status(500).json({
        status: "fail",
        message: "Create Billing Failed",
      });
    } else {
      await session.commitTransaction();
      session.endSession();
      res.status(200).json({
        status: "success",
        message: "Create Billing Success",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "fail",
      message: "Internal Server Error",
    });
  }
};

exports.createBilling = async (req, res, next) => {
  try {
    let billing = {};
    let dataContract;

    dataContract = await Lease.findById(req.body.contract).populate(
      "unit",
      "-__v"
    );
    if (!dataContract) {
      dataContract = await Ownership.findById(req.body.contract).populate(
        "unit",
        "-__v"
      );
    }
    if (dataContract) {
      billing = {
        serviceCharge: {
          amount: dataContract.untrt.service_rate * dataContract.untsqr,
        },
        sinkingfund: {
          amountsink: dataContract.untrt.sinking_fund * dataContract.untsqr,
        },
        ipl: {
          amountipl:
            dataContract.untrt.service_rate * dataContract.untsqr +
            dataContract.untrt.sinking_fund * dataContract.untsqr,
        },
        electricity: {
          electricTrans: req.body.powerConsId,
        },
        water: {
          waterTrans: req.body.waterConsId,
        },
      };
      req.body.billing = billing;

      const data = await Billing.create(req.body);

      if (data) {
        res.status(200).json({
          status: "success",
          data,
        });
      } else {
        res.status(500).json({
          status: "fail",
          message: "Internal Server Error",
        });
      }
    } else {
      res.status(404).json({
        status: "fail",
        message: "Contract Not Found",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "fail",
      message: "Internal Server Error",
    });
  }
};

exports.getAllBilling = async (req, res, next) => {
  try {
    const skip = (req.query.pageNumber - 1) * req.query.limit;
    let data;
    if (req.query.search === undefined) {
      data = await Billing.find()
        .skip(skip)
        .limit(parseInt(req.query.limit))
        .sort({ $natural: -1 });
    } else {
      data = await Billing.find()
        .or([{ billingNumber: { $regex: req.query.search } }])
        .skip(skip)
        .limit(parseInt(req.query.limit))
        .sort({ $natural: -1 });
    }

    for (let i = 0; i < data.length; i++) {
      let dataContract;

      dataContract = await Lease.findById(data[i].contract).populate([
        {
          path: "unit",
          select: "-__v",
        },
        {
          path: "cstmr",
          select: "-__v",
        },
      ]);

      if (!dataContract) {
        dataContract = await Ownership.findById(data[i].contract).populate([
          {
            path: "unit",
            select: "-__v",
          },
          {
            path: "cstmr",
            select: "-__v",
          },
        ]);
      }

      if (dataContract) {
        data[i].detailContract = dataContract;
      }
    }

    res.status(200).json({ status: "success", data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "fail", message: "Internal Server Error" });
  }
};

exports.getBillingById = async (req, res, next) => {
  try {
    let data = await Billing.findById(req.params.id);

    let dataContract = await Lease.findById(data.contract).populate([
      {
        path: "unit",
        select: "-__v",
      },
      {
        path: "cstmr",
        select: "-__v",
      },
    ]);

    if (!dataContract) {
      dataContract = await Ownership.findById(data.contract).populate([
        {
          path: "unit",
          select: "-__v",
        },
        {
          path: "cstmr",
          select: "-__v",
        },
      ]);
    }

    if (dataContract) {
      data.detailContract = dataContract;
    }

    res.status(200).json({ status: "success", data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "fail", message: "Internal Server Error" });
  }
};

exports.updateBilling = async (req, res, next) => {
  try {
    const updateBilling = await Billing.findByIdAndUpdate(
      req.params.id,
      req.body
    );

    if (updateBilling) {
      res.status(200).json({ status: "success", data: updateBilling });
    } else {
      res
        .status(500)
        .json({ status: "fail", message: "Internal Server Error" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "fail", message: "Internal Server Error" });
  }
};

exports.deleteBilling = async (req, res, next) => {
  try {
    const deleteBilling = await Billing.findByIdAndDelete(req.params.id);

    if (deleteBilling) {
      res.status(200).json({ status: "success" });
    } else {
      res
        .status(500)
        .json({ status: "fail", message: "Internal Server Error" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "fail", message: "Internal Server Error" });
  }
};
