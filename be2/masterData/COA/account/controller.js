const Acct = require("./model");
const servicesFactory = require("../../../services/handlerFactory");
const catchAsync = require("../../../utils/catchAsync");

exports.create = servicesFactory.createOne(Acct);
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
    data = await Acct.find().skip(skip).limit(limit).populate('acctType', '-__v').sort({ $natural: -1 });
  } else {
    data = await Acct.find()
      .or([
        { acctNo: { $regex: str.filter.acctNo } },
        { acctName: { $regex: str.filter.acctName } },
      ])
      .skip(skip)
      .limit(limit)
      .populate('acctType', '-__v')
      .sort({ $natural: -1 });
  }
  const allData = await Acct.find();

  res.status(200).json({
    status: "success",
    totalCount: allData.length,
    data,
  });
});

// servicesFactory.getAll(Acct, {
//   path:'acctType',
//   select: 'acctypeno acctype'
// });
exports.getById = servicesFactory.getOne(Acct, [ 
{
  path: "acctType",
  select: "-__v",
},
{
  path: "parents",
  select: "-__v",
},
]);

exports.getByAccountType = catchAsync(async (req, res, next) => {
  const data = await Acct.find({ acctType: req.params.id })
    .skip(skip)
    .limit(limit)
    .sort({ $natural: -1 });

  res.status(200).json({
    status: "success",
    data,
  });
});
exports.update = servicesFactory.updateOne(Acct);
exports.delete = servicesFactory.deleteOne(Acct);
