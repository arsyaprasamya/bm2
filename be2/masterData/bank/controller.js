const Bank = require("./model");
const servicesFactory = require("../../services/handlerFactory");
const catchAsync = require("../../utils/catchAsync");

exports.create = servicesFactory.createOne(Bank);

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
    data = await Bank.find().skip(skip).limit(limit).sort({ $natural: -1 });
  } else {
    data = await Bank.find()
      .or([
        { codeBank: { $regex: str.filter.codeBank } },
      ])
      .skip(skip)
      .limit(limit)
      .sort({ $natural: -1 });
  }
  const allData = await Bank.find();

  res.status(200).json({
    status: "success",
    totalCount: allData.length,
    data,
  });
});

exports.getById = servicesFactory.getOne(Bank, {
  path: "createdBy",
  select: "first_name",
});
exports.update = servicesFactory.updateOne(Bank);
exports.delete = servicesFactory.deleteOne(Bank);
