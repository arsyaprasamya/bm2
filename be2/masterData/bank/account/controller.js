const AcctBank = require("./model");
const servicesFactory = require("../../../services/handlerFactory");
const catchAsync = require('../../../utils/catchAsync');

exports.create = servicesFactory.createOne(AcctBank);
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
    data = await AcctBank.find().populate('bank', 'bank branch').skip(skip).limit(limit).sort({ $natural: -1 });
  } else {
    data = await AcctBank.find()
      .or([{ acctName: { $regex: str.filter.acctName } }])
      .populate('bank', 'bank branch')
      .skip(skip)
      .limit(limit)
      .sort({ $natural: -1 });
  }
  const allData = await AcctBank.find();

  res.status(200).json({
    status: "success",
    totalCount: allData.length,
    data,
  });
});

exports.getById = servicesFactory.getOne(AcctBank, {
  path: "bank",
  select: "bank branch",
});
exports.update = servicesFactory.updateOne(AcctBank);
exports.delete = servicesFactory.deleteOne(AcctBank);
