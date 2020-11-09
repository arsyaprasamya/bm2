const revenue = require("./model");
const services = require("../../services/handlerFactory");
const catchAsync = require("../../utils/catchAsync");

exports.create = services.createOne(revenue);
exports.getAll = catchAsync(async (req, res, next) => {
  const str = JSON.parse(req.query.param);
  const page = parseInt(str.pageNumber);
  const limit = parseInt(str.limit);
  const skip = (page - 1) * limit;

  let query = {};
  let data;

  if (str.filter !== null) query = { revenueName: str.filter.revenueName };

  if (Object.keys(query).length === 0) {
    data = await revenue.find().skip(skip).limit(limit).sort({ $natural: -1 });
  } else {
    data = await revenue
      .find()
      .or([{ revenueName: { $regex: str.filter.revenueName } }])
      .skip(skip)
      .limit(limit)
      .sort({ $natural: -1 });
  }
  const allData = await revenue.find();

  res.status(200).json({
    status: "success",
    totalCount: allData.length,
    data,
  });
});
exports.getOne = services.getOne(revenue);
exports.update = services.updateOne(revenue);
exports.delete = services.deleteOne(revenue);
