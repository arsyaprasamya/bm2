const AppError = require("../../utils/appError");
const errorHandler = require("../../controllers/errorController");
const services = require("../../services/handlerFactory");
const AssetManagement = require("./model");
const Sequence = require("../../models/sequence");

function pad(num, size) {
  var s = num + "";
  while (s.length < size) s = "0" + s;
  return s;
}

exports.generateCodeAsset = async (req, res, next) => {
  try {
    const type = req.body.assetType.substring(0, 3).toUpperCase();
    const date = new Date().getFullYear();
    const getSequence = await Sequence.findOne({
      menu: "assetmanagement",
      year: 2020,
    });
    const newNumber = pad(getSequence.sequence, 4);

    const code = `${type}-${date}-${newNumber}`;

    res.status(200).json({
      status: "success",
      data: code,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "success",
      message: "Internal Server Error",
    });
  }
};

exports.create = async (req, res, next) => {
  try {
    const data = await AssetManagement.create(req.body);

    if (data) {
      const getSequence = await Sequence.findOne({
        menu: "assetmanagement",
        year: 2020,
      });

      const updateSequence = await Sequence.findByIdAndUpdate(getSequence._id, {
        sequence: getSequence.sequence + 1,
      });

      if (updateSequence) {
        res.status(200).json({
          status: "success",
          data,
        });
      } else {
        res.status(500).json({
          status: "fail",
          message: "Internal Server Error",
        });
      }
    } else {
      res.status(500).json({
        status: "fail",
        message: "Internal Server Error",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "fail",
      message: "Internal Server Error",
    });
  }
};

exports.getAssetByType = async (req, res, next) => {
  try {
    const data = await AssetManagement.find({ assetType: req.params.id });
    res.status(200).json({
      status: "success",
      data,
    });
  } catch (error) {
    console.error(error);
    return errorHandler(error);
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const skip = (req.query.pageNumber - 1) * req.query.limit;
    let data;

    if (
      req.query.search === undefined ||
      req.query.search === null ||
      req.query.search === ""
    ) {
      data = await AssetManagement.find()
        .skip(skip)
        .limit(parseInt(req.query.limit))
        .populate("assetType", "-__v")
        .populate("uom", "-__v")
        .sort({ $natural: -1 });
    } else {
      data = await AssetManagement.find()
        .or([
          { assetCode: { $regex: req.query.search } },
          { assetName: { $regex: req.query.search } },
        ])
        .skip(skip)
        .limit(parseInt(req.query.limit))
        .populate("assetType", "-__v")
        .populate("uom", "-__v")
        .sort({ $natural: -1 });
    }

    const allData = await AssetManagement.find();

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

exports.getById = services.getOne(AssetManagement, [
  {
    path: "assetType",
    select: "-__v",
  },
  { path: "uom", select: "-__v" },
]);

exports.update = services.updateOne(AssetManagement);
exports.delete = services.deleteOne(AssetManagement);
