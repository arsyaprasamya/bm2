const Uom = require('./model');
const servicesFactory = require('../../../services/handlerFactory');
const catchAsync = require('../../../utils/catchAsync');

exports.create = servicesFactory.createOne(Uom);
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
    data = await Uom.find().skip(skip).limit(limit).sort({ $natural: -1 });
  } else {
    data = await Uom.find()
      .or([
        { uom: { $regex: str.filter.uom } }
      ])
      .skip(skip)
      .limit(limit)
      .sort({ $natural: -1 });
  }
  const allData = await Uom.find();

  res.status(200).json({
    status: "success",
    totalCount: allData.length,
    data,
  });
});
exports.getById = servicesFactory.getOne(Uom, {
  path:'createdBy',
  select: 'first_name'
});
exports.update = servicesFactory.updateOne(Uom);
exports.delete = servicesFactory.deleteOne(Uom);