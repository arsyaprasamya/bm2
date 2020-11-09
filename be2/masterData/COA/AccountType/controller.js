const mongoose = require("mongoose");
const Acctype = require("./model");
const servicesFactory = require("../../../services/handlerFactory");
const catchAsync = require("../../../utils/catchAsync");
const Mainacct = require("../account/model");
const Sequence = require("../../../models/sequence");

exports.create = catchAsync(async (req, res, next) => {
  const date = new Date();
  const sequence = await Sequence.findOne({
    menu: "accttype",
    year: date.getFullYear(),
  });

  let seq = sequence.sequence+"";
  // let newSeq = "";
  while (seq.length < 3) {
    seq =  "0" + seq;
  }

  req.body.acctypeno = seq;
  req.body.createdDate = date;

  const doc = await Acctype.create(req.body);

  const updateSequence = await Sequence.findByIdAndUpdate(
    { _id: sequence._id },
    { sequence: sequence.sequence + 1 }
  );

  res.status(201).json({
    status: "success",
    data: doc,
  });
});

exports.getAll = catchAsync(async (req, res, next) => {
  const str = JSON.parse(req.query.param);
  const page = parseInt(str.pageNumber);
  const limit = parseInt(str.limit);
  const skip = (page - 1) * limit;

  // let query = {};
  let data;

  // if (str.filter.codeBank !== null || str.filter.codeBank !== undefined)
  //   query = { codeBank: str.filter.codeBank };

  if (str.filter === null) {
    //Object.keys(query).length === 0 ||
    data = await Acctype.find().skip(skip).limit(limit).sort({ $natural: -1 });
  } else {
    data = await Acctype.find()
      .or([
        { acctypeno: { $regex: str.filter.acctypeno } },
        { acctype: { $regex: str.filter.acctype } },
      ])
      .skip(skip)
      .limit(limit)
      .sort({ $natural: -1 });
  }
  const allData = await Acctype.find();

  res.status(200).json({
    status: "success",
    totalCount: allData.length,
    data,
  });
});

exports.getById = servicesFactory.getOne(Acctype, {
  path: "createdBy",
  select: "first_name",
});
exports.update = servicesFactory.updateOne(Acctype);

exports.delete = catchAsync(async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  const deleteMainAcct = await Mainacct.deleteOne({
    acctType: req.params.id,
  }).session(session);

  if (!deleteMainAcct) {
    await session.abortTransaction();
  } else {
    const deleteAcctType = await Acctype.findByIdAndDelete(
      req.params.id
    ).session(session);
    if (deleteAcctType) {
      await session.commitTransaction();
    } else {
      await session.abortTransaction();
    }
  }
  session.endSession();

  res.status(204).json({
    status: "success",
    message: null,
  });
});
