const fiscalAsset = require("./model");
const servicesFactory = require("../../../services/handlerFactory");
// const catchAsync = require('../../../utils/catchAsync');

exports.create = servicesFactory.createOne(fiscalAsset);

exports.getAll = async (req, res, next) => {
  const page = parseInt(req.query.pageNumber);
  const limit = parseInt(req.query.limit);
  const skip = (page - 1) * limit;

  let data;

  if (
    req.query.search === null ||
    req.query.search === undefined ||
    req.query.search === ""
  ) {
    data = await fiscalAsset
      .find()
      .skip(skip)
      .limit(limit)
      .sort({ $natural: -1 });
  } else {
    data = await fiscalAsset
      .find()
      .or([
        { fiscalName: { $regex: req.query.search } },
        { fiscalDepMethod: { $regex: req.query.search } },
      ])
      .skip(skip)
      .limit(limit)
      .sort({ $natural: -1 });
  }
  const allData = await fiscalAsset.find();

  res.status(200).json({
    status: "success",
    totalCount: allData.length,
    data,
  });
};

exports.getById = servicesFactory.getOne(fiscalAsset, {
  path: "createdBy",
  select: "first_name",
});
exports.update = servicesFactory.updateOne(fiscalAsset);
exports.delete = servicesFactory.deleteOne(fiscalAsset);
