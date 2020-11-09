const fixedAsset = require("./model");
const fiscalAsset = require("../FiscalFixedAsset/model");
const servicesFactory = require("../../../services/handlerFactory");

exports.create = servicesFactory.createOne(fixedAsset);
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
    //Object.keys(query).length === 0 ||
    data = await fixedAsset
      .find()
      .populate("fiscalFixedType", "-__v")
      .skip(skip)
      .limit(limit)
      .sort({ $natural: -1 });
  } else {
    const dataFiscal = await fiscalAsset.find({
      fiscalName: { $regex: req.query.search },
    });
    const idFiscal = [];

    dataFiscal.forEach(element => {
      idFiscal.push({ fiscalFixedType: element._id });
    });

    data = await fixedAsset
      .find()
      .or([{ fixedAssetTypeName: { $regex: req.query.search } }])
      .or(idFiscal)
      .populate("fiscalFixedType", "-__v")
      .skip(skip)
      .limit(limit)
      .sort({ $natural: -1 });
  }
  const allData = await fixedAsset.find();

  res.status(200).json({
    status: "success",
    totalCount: allData.length,
    data,
  });
};

exports.getById = servicesFactory.getOne(fixedAsset, {
  path: "fiscalFixedType",
  select: "-__v",
});
exports.update = servicesFactory.updateOne(fixedAsset);

exports.delete = servicesFactory.deleteOne(fixedAsset);
