const revenue = require("./model");
const services = require("../services/handlerFactory");
const catchAsync = require("../utils/catchAsync");

function pad(num, size) {
  var s = num + "";
  while (s.length < size) s = "0" + s;
  return s;
}
exports.generate = catchAsync(async (req, res, next) => {
  const countRevenue = await revenue.countDocuments();
  const newNumber = "RVN-" + pad(countRevenue + 1, 5);

  res.status(200).json({
    status: "success",
    data: newNumber,
  });
});
exports.create = services.createOne(revenue);
exports.getAll = catchAsync(async (req, res, next) => {
  const str = JSON.parse(req.query.param);
  const page = parseInt(str.pageNumber);
  const limit = parseInt(str.limit);
  const skip = (page - 1) * limit;

  let query = {};
  let data;

  if (str.filter !== null) query = { revenueCode: str.filter.revenueCode };

  if (Object.keys(query).length === 0) {
    data = await revenue
      .find()
      .populate({
        path: "contract",
        select: "-__v",
        populate: { path: "unit", select: "-__v" },
      })
      .populate("revenueRental", "-__v")
      .skip(skip)
      .limit(limit)
      .sort({ $natural: -1 });
  } else {
    data = await revenue
      .find()
      .or([{ revenueCode: { $regex: str.filter.revenueCode } }])
      .populate({
        path: "contract",
        select: "-__v",
        populate: { path: "unit", select: "-__v" },
      })
      .populate("revenueRental", "-__v")
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
exports.getOne = services.getOne(revenue,[ 
  {
    path: "contract",
    select: "-__v",
    populate: 
    {
      path: "unit",
      select: "-__v"
    },
  },
]);

exports.update = services.updateOne(revenue);
exports.delete = services.deleteOne(revenue);
