const AssetDepreciation = require("./model");
const errorHandler = require("../../controllers/errorController");
const services = require("../../services/handlerFactory");
const AssetManagement = require("../assetManagement/model");

exports.create = services.createOne(AssetDepreciation);

exports.getAll = async (req, res, next) => {
  try {
    const skip = (req.query.pageNumber - 1) * req.query.limit;
    let data;

    if (
      req.query.search === undefined ||
      req.query.search === null ||
      req.query.search === ""
    ) {
      data = await AssetDepreciation.find()
        .skip(skip)
        .limit(parseInt(req.query.limit))
        .populate({
          path: "assetManagement",
          select: "-__v",
          populate: { path: "assetType", select: "-__v" },
        })
        .populate("assetAccount", "-__v")
        .populate("expenditures", "__v")
        .populate("assetType", "-__v")
        .populate("accumulatedDepAcct", "-__v")
        .populate("depreciationExpAcct", "-__v")
        .sort({ $natural: -1 });
    } else {
      const assetName = await AssetManagement.find({
        assetName: { $regex: req.query.search },
      });
      const idAssetManagement = [];
      assetName.forEach((e) => {
        idAssetManagement.push({ assetManagement: e._id });
      });
      data = await AssetDepreciation.find()
        .or([{ aquicitionDate: { $regex: req.query.search } }])
        .or(idAssetManagement)
        .skip(skip)
        .limit(parseInt(req.query.limit))
        .populate({
          path: "assetManagement",
          select: "-__v",
          populate: { path: "assetType", select: "-__v" },
        })
        .populate("assetAccount", "-__v")
        .populate("assetType", "-__v")
        .populate("expenditures", "__v")
        .populate("accumulatedDepAcct", "-__v")
        .populate("depreciationExpAcct", "-__v")
        .sort({ $natural: -1 });
    }

    const allData = await AssetDepreciation.find();

    res.status(200).json({
      status: "success",
      totalCount: allData.length,
      data,
    });
  } catch (error) {
    console.error(error);
    return errorHandler(error);
  }
};

exports.getById = services.getOne(AssetDepreciation, [
  {
    path: "assetManagement",
    select: "-__v",
    populate: { path: "assetType", select: "-__v" },
  },
  {
    path: "assetAccount",
    select: "-__v",
  },
  {
    path: "accumulatedDepAcct",
    select: "-__v",
  },
  {
    path: "depreciationExpAcct",
    select: "-__v",
  },
  {
    path: "expenditures",
    select: "-__v",
  },
]);

exports.update = services.updateOne(AssetDepreciation);
exports.delete = services.deleteOne(AssetDepreciation);
