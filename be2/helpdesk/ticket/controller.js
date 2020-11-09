const mongoose = require("mongoose");
const multer = require("multer");
const sharp = require("sharp");
const ejs = require("ejs");
const path = require("path");
const pdf = require("html-pdf");
const fs = require("fs");
const nodemailer = require("nodemailer");

const AppError = require("../../utils/appError");
const Ticket = require("./model");
const Do = require("../deliveryOrder/model");
const Unit = require("../../unit/model").Unit;
const Sequence = require("../../models/sequence");
const Ownership = require("../../contract/owner/model").Ownership;
const Lease = require("../../contract/tenant/model").Tenant;
const User = require("../../models/user");
// const Engineer = require("d:/GITLAB/backend/masterData/engineer/model");

const errorHandler = require("../../controllers/errorController");
const { Tenant } = require("../../contract/tenant/model");

function pad(num, size) {
  var s = num + "";
  while (s.length < size) s = "0" + s;
  return s;
}

const generateCodeDO = async () => {
  try {
    const session = await mongoose.startSession();
    session.startTransaction();

    const dates = new Date();
    const month = ("0" + (dates.getMonth() + 1)).slice(-2);
    const date = ("0" + dates.getDate()).slice(-2);
    const year = dates.getFullYear().toString().substr(-2);

    const sequences = await Sequence.find({
      menu: "do",
      year: dates.getFullYear(),
    }).session(session);

    const newNumber = pad(sequences[0].sequence, 5);
    const code = "DO-" + date + month + year + "-" + newNumber;

    const updateSequence = await Sequence.findByIdAndUpdate(
      { _id: sequences[0]._id },
      { sequence: sequences[0].sequence + 1 },
      { session }
    );
    if (updateSequence) {
      await session.commitTransaction();
      session.endSession();
      return code;
    } else {
      await session.abortTransaction();
      session.endSession();
      return "error";
    }
  } catch (error) {
    console.error(error);
    return errorHandler(error);
  }
};

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  console.log(file);
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only images.", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.generateCodeTicket = async (req, res, next) => {
  try {
    const dates = new Date();
    const month = ("0" + (dates.getMonth() + 1)).slice(-2);
    const date = ("0" + dates.getDate()).slice(-2);
    const year = dates.getFullYear().toString().substr(-2);

    const sequences = await Sequence.find({
      menu: "ticket",
      year: dates.getFullYear(),
    });

    const newNumber = pad(sequences[0].sequence, 5);
    const code = "TC-" + date + month + year + "-" + newNumber;

    res.status(200).json({
      status: "success",
      data: code,
    });
  } catch (error) {
    console.error(error);
    return errorHandler(error);
  }
};

exports.uploadTicketPhoto = upload.array("attachment", 5);

exports.resizeTicketPhoto = async (req, res, next) => {
  try {
    console.log(req.files)
    if (!req.files) return next();
    // console.log(req.files)
    req.body.attachment = [];
    req.files.map(async (file, index) => {
      const fileName = `${req.body.ticketId}-${index + 1}.jpeg`;
      req.body.attachment.push(fileName);
      await sharp(req.files[index].buffer)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`upload/ticket/${fileName}`);
    });

    next();
  } catch (e) {
    console.error(e);
    return errorHandler(e);
  }
};

exports.createTicket = async (req, res, next) => {
  try {
    const dates = new Date();
    const createTicket = await Ticket.create(req.body);

    if (createTicket) {
      const sequences = await Sequence.find({
        menu: "ticket",
        year: dates.getFullYear(),
      });

      const updateSequence = await Sequence.findByIdAndUpdate(
        { _id: sequences[0]._id },
        { sequence: sequences[0].sequence + 1 }
      );

      if (updateSequence) {
        res.status(200).json({
          status: "success",
          data: createTicket,
        });
      }
    } else {
      res.status(500).json({
        status: "error",
        data: "Something Went Wrong",
      });
    }
  } catch (error) {
    console.error(error);
    return errorHandler(error);
  }
};

//create Ticket buat DO mobile
exports.createTicketMobile = async (req, res, next) => {
  try {
    const dates = new Date();
    const createTicket = await Ticket.create(req.body);

    if (createTicket) {
      const sequences = await Sequence.find({
        menu: "ticket",
        year: dates.getFullYear(),
      });

      const updateSequence = await Sequence.findByIdAndUpdate(
        { _id: sequences[0]._id },
        { sequence: sequences[0].sequence + 1 }
      );

      if (updateSequence) {
        res.status(200).json({
          status: "success",
          data: createTicket,
        });
      }
    } else {
      res.status(500).json({
        status: "error",
        data: "Something Went Wrong",
      });
    }
  } catch (error) {
    console.error(error);
    return errorHandler(error);
  }
};

exports.getTicketById = async (req, res, next) => {
  try {
    let dataTicket = await Ticket.findById(req.params.id)
      .lean()
      .populate("subDefect", "-__v")
      .populate("engineerId", "-__v");

    let contract;
    contract = await Ownership.findById(dataTicket.contract).populate(
      "unit",
      "-__v"
    );
    if (!contract) {
      contract = await Lease.findById(dataTicket.contract).populate(
        "unit",
        "-__v"
      );
    }

    dataTicket.unit = contract.unit.cdunt;
    dataTicket.contactName = contract.contact_name;
    dataTicket.contactPhone = contract.contact_phone;
    dataTicket.contactEmail = contract.contact_email;

    res.status(200).json({
      status: "success",
      data: dataTicket,
    });
  } catch (err) {
    console.error(err);
    return errorHandler(err);
  }
};

//Get Ticket By Id Mobile
exports.getTicketByIdMobile = async (req, res, next) => {
  try {
    let dataTicket = await Ticket.findById(req.params.id)
      .lean()
      .populate("subDefect", "-__v")
      .populate("engineerId", "-__v")
      .populate("contract", "-__v");

    let contract;
    contract = await Ownership.findById(dataTicket.contract).populate(
      "unit",
      "-__v"
    );
    if (!contract) {
      contract = await Lease.findById(dataTicket.contract).populate(
        "unit",
        "-__v"
      );
    }

    res.status(200).json({
      status: "success",
      data: dataTicket,
    });
  } catch (err) {
    console.error(err);
    return errorHandler(err);
  }
};

exports.getAllTicket = async (req, res, next) => {
  try {
    const skip = (req.query.pageNumber - 1) * req.query.limit;

    let query = {};
    let data;
    if (req.query.status !== "all" && req.query.status !== undefined)
      query = { status: req.query.status };

    if (req.query.search === undefined) {
      data = await Ticket.find(query)
        .skip(skip)
        .limit(parseInt(req.query.limit))
        .populate("subDefect", "-__v")
        .sort({ $natural: -1 });
    } else {
      // const dataUnit = await Unit.find({ cdunt: { $regex: req.query.search } });
      // const idContract = [];

      // dataUnit.forEach(async (e) => {
      //   const dataOwnership = await Ownership.findOne({ unit: e._id }).populate(
      //     "unit",
      //     "-__v"
      //   );
      //   const dataLease = await Lease.findOne({ unit: e._id }).populate(
      //     "unit",
      //     "-__v"
      //   );

      //   if (dataOwnership.unit.cdunt !== dataLease.unit.cdunt) {
      //     idContract.push({ contract: dataOwnership._id });
      //   } else {
      //     idContract.push({ contract: dataLease._id });
      //   }
      // });

      data = await Ticket.find()
        .or([
          { ticketId: { $regex: req.query.search } },
          { subject: { $regex: req.query.search } },
        ])
        // .or(idContract)
        .skip(skip)
        .limit(parseInt(req.query.limit))
        .populate("subDefect", "-__v")
        .sort({ $natural: -1 });
    }

    // data.forEach(async (el) => {
    //   let contract;
    //   contract = await Ownership.findOne({
    //     _id: el.contract,
    //   }).populate("unit", "-__v");

    //   if (!contract) {
    //     contract = await Lease.findOne({
    //       _id: el.contract,
    //     }).populate("unit", "-__v");
    //   }

    //   el.contract = contract;
    // });

    const allData = await Ticket.find();

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

exports.getTicketByUser = async (req, res, next) => {
  try {
    const dataUser = await User.findById(req.params.id);
    let dataContract;
    dataContract = await Ownership.findOne({ cstmr: dataUserLogin.tenant });
    
    if (!dataContract) {
      dataContract = await Lease.findOne({ cstmr: dataUserLogin.tenant });
    }

    const data = await Ticket.find({ contract: dataContract._id })
      .populate("subDefect", "-__v")
      .lean();

    res.status(200).json({
      status: "success",
      data,
    });
  } catch (err) {
    console.error(err);
    return errorHandler(err);
  }
};

//Get All Tiket by User Mobile
exports.getAllTicketMobile = async (req, res, next) => {
  try {
    const skip = (req.query.pageNumber - 1) * req.query.limit;

    let query = {};
    let data;
    if (req.query.status !== "all" && req.query.status !== undefined)
      query = { status: req.query.status };
      
    if (req.query.search === undefined) {
      data = await Ticket.find(query)
        .skip(skip)
        .limit(parseInt(req.query.limit))
        .populate("subDefect", "-__v")
        .populate("engineerId", "-__v")
        .sort({ $natural: -1 });
    } else {
      // const dataUnit = await Unit.find({ cdunt: { $regex: req.query.search } });
      // const idContract = [];

      // dataUnit.forEach(async (e) => {
      //   const dataOwnership = await Ownership.findOne({ unit: e._id }).populate(
      //     "unit",
      //     "-__v"
      //   );
      //   const dataLease = await Lease.findOne({ unit: e._id }).populate(
      //     "unit",
      //     "-__v"
      //   );

      //   if (dataOwnership.unit.cdunt !== dataLease.unit.cdunt) {
      //     idContract.push({ contract: dataOwnership._id });
      //   } else {
      //     idContract.push({ contract: dataLease._id });
      //   }
      // });

      data = await Ticket.find()
        .or([
          { ticketId: { $regex: req.query.search } },
          { subject: { $regex: req.query.search } },
        ])
        // .or(idContract)
        .skip(skip)
        .limit(parseInt(req.query.limit))
        .populate("subDefect", "-__v")
        .sort({ $natural: -1 });
    }

    // data.forEach(async (el) => {
    //   let contract;
    //   contract = await Ownership.findOne({
    //     _id: el.contract,
    //   }).populate("unit", "-__v");

    //   if (!contract) {
    //     contract = await Lease.findOne({
    //       _id: el.contract,
    //     }).populate("unit", "-__v");
    //   }

    //   el.contract = contract;
    // });

    const allData = await Ticket.find();

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

exports.getTicketByUser = async (req, res, next) => {
  try {
    const dataUser = await User.findById(req.params.id);
    let dataContract;
    dataContract = await Ownership.findOne({ cstmr: dataUserLogin.tenant });
    if (!dataContract) {
      dataContract = await Lease.findOne({ cstmr: dataUserLogin.tenant });
    }

    const data = await Ticket.find({ contract: dataContract._id })
      .populate("subDefect", "-__v")
      .lean();

    res.status(200).json({
      status: "success",
      data,
    });
  } catch (err) {
    console.error(err);
    return errorHandler(err);
  }
};

//coba dulu 
exports.getTicketByUserMobile = async (req, res, next) => {
  try {
    const dataUser = await User.findById(req.params.id);
    // let data;
    dataContract = await Ownership.findOne({ createdBy: dataUser.tenant });
    if (!dataContract) {
      dataContract = await Lease.findOne({ createdBy: dataUser._id });
    }
    //  const dataContract = await Ticket.findOne({ createdBy: dataUser._Id });
    // //  console.log(dataUser);
    let data = await Ticket.findOne({ createdBy: dataUser._id })
      .lean()
      .populate({path: "engineerId", select:"-__v"})
      .populate({path:"createdBy", model:"User", select:"-__v"})
      .populate("subDefect", "-__v")
      .populate({
        path: "ticket",
        model: "Ticket",  
        select: "-__v",
        populate: {
          path: "createdBy",
          select: "-__v"
        },
        
          


      });
      
   
    console.log(data)
    res.status(200).json({
      status: "success",
      data: data
      
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "error",
      message: "Something Went Wrong",
    });
  }
};

// tiket by user Engineer ID
exports.getTicketByEngineerMobile = async (req, res, next) => {
  try {
    const dataUser = await User.findById(req.params.id);
    console.log(dataUser)
    let data = await Ticket.find({ engineerId: dataUser.engineer })
      .lean()
      .populate({path: "engineerId",model:"Engineer", select:"-__v"})
      .populate({path:"createdBy", model:"User", select:"-__v"})
      .populate({path: "contract", select:"-__v",
                    populate: {
                      path: "unit",
                      model: "Unit",
                      select: "-__v"
                    },
                  })
      .populate("subDefect", "-__v")
      .populate({
        path: "ticket",
        model: "Ticket",  
        select: "-__v",
        populate: {
          path: "engineerId",
          select: "-__v"
        },
      });
      
    console.log(data)
    res.status(200).json({
      status: "success",
      data: data
      
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "error",
      message: "Something Went Wrong",
    });
  }
};

//bikin populate
// exports.getTicketByUserMobile = async (req, res, next) => {
//   try {
//     const dataUser = await User.findById(req.params.id);
//     const dataContract = await Ownership.findOne({ createdBy: dataUser._id });
//     let data = await Ticket.find({ cstmr: dataContract.contract })
//       .populate("cstmr", "-__v")
//       .populate({
//         path: "unit",
//         model: "Unit",
//         select: "-__v",
//         populate: [
//           {
//             path: "flr",
//             model: "Floor",
//             select: "-__v",
//             populate: {
//               path: "blk",
//               model: "Block",
//               select: "-__v",
//               populate: {
//                 path: "grpid",
//                 model: "BlockGroup",
//                 select: "-__v",
//               },
//             },
//           },
//           {
//             path: "unttp",
//             model: "UnitType",
//             select: "-__v",
//           },
//           {
//             path: "untrt",
//             model: "UnitRate",
//             select: "-__v",
//           },
//         ],
//       });

//     if (data.length === 0) {
//       let data = await Ownership.find({ cstmr: dataContract._id })
//         .populate("cstmr", "-__v")
//         .populate({
//           path: "unit",
//           model: "Unit",
//           select: "-__v",
//           populate: [
//             {
//               path: "flr",
//               model: "Floor",
//               select: "-__v",
//               populate: {
//                 path: "blk",
//                 model: "Block",
//                 select: "-__v",
//                 populate: {
//                   path: "grpid",
//                   model: "BlockGroup",
//                   select: "-__v",
//                 },
//               },
//             },
//             {
//               path: "unttp",
//               model: "UnitType",
//               select: "-__v",
//             },
//             {
//               path: "untrt",
//               model: "UnitRate",
//               select: "-__v",
//             },
//           ],
//         });
//     }
//     res.status(200).json({
//       status: "success",
//       data: data,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({
//       status: "error",
//       message: "Something Went Wrong",
//     });
//   }
// };
exports.updateTicket = async (req, res, next) => {
  try {
    const session = await mongoose.startSession();
    session.startTransaction();

    const updateTicket = await Ticket.findByIdAndUpdate(
      req.params.id,
      req.body
    ).session(session);

    if (updateTicket) {
      if (req.body.status.toLowerCase() === "scheduled") {
        const codeDO = await generateCodeDO();
        if (codeDO === "error") {
          session.abortTransaction();
          session.endSession();
          next(new AppError("Generate Code DO Error", 500));
        }

        const dataDO = {
          doId: codeDO,
          ticket: req.params.id,
          status: req.body.status,
          createdBy: req.body.createdBy,
          createdDate: Date.now(),
        };

        const createDo = await Do.create(dataDO);
        if (createDo) {
          await session.commitTransaction();
        } else {
          await session.abortTransaction();
          session.endSession();
          next(new AppError("Create DO Error", 500));
        }
      } else {
        await session.commitTransaction();
      }
    } else {
      await session.abortTransaction();
      session.endSession();
      next(new AppError("Update Ticket Error", 500));
    }
    session.endSession();
    res.status(200).json({
      status: "success",
      message: "Update ticket success!",
    });
  } catch (error) {
    console.error(error);
    return errorHandler(error);
  }
};

exports.deleteTicket = async (req, res, next) => {
  try {
    const session = await mongoose.startSession();
    session.startTransaction();

    const deleteTicket = await Ticket.findByIdAndDelete(req.params.id).session(
      session
    );
    if (deleteTicket) {
      const dataDO = await Do.find({ ticketId: req.params.id });
      if (dataDO.length > 0) {
        const deleteDO = await Do.findByIdAndDelete(dataDO[0]._id).session(
          session
        );
        if (deleteDO) {
          await session.commitTransaction();
        } else {
          await session.abortTransaction();
          session.endSession();
          next(new AppError("Delete Ticket Error", 500));
        }
      } else {
        await session.commitTransaction();
      }
    } else {
      await session.abortTransaction();
      session.endSession();
      next(new AppError("Delete Ticket Error", 500));
    }
    session.endSession();
    res.status(204).json({
      status: "success",
      message: "Delete Ticket Success",
    });
  } catch (error) {
    console.error(error);
    return errorHandler(error);
  }
};

exports.getImages = async (req, res, next) => {
  try {
    const data = await Ticket.findById(req.params.id);
    let link = [];
    data.attachment.forEach((e) =>
      link.push(`${req.headers.host}/ticketImages/${e}`)
    );
    res.status(200).json({
      status: "success",
      data: link,
    });
  } catch (error) {
    console.error(error);
    return errorHandler(error);
  }
};

exports.getImagesMobile = async (req, res, next) => {
  try {
    const data = await Ticket.findById(req.params.id);
    let link = [];
    data.attachment.forEach((e) =>
      link.push(`${req.headers.host}/ticketImages/${e}`)
    );
    res.status(200).json({
      status: "success",
      data: link,
    });
  } catch (error) {
    console.error(error);
    return errorHandler(error);
  }
};
// exports.printPDFTicket = async (req, res, next) => {
//   try {
//     const getTicket = await Ticket.findById(req.params.id);
//     const date = Date.now();
//     ejs.renderFile(
//       path.join(__dirname, "./template", "ticket.template.ejs"),
//       {
//         Ticket: getTicket,
//       },
//       (err, data) => {
//         if (err) {
//           console.error(err);
//           res.status(500).json({
//             status: "fail",
//             message: "Something Went Wrong",
//           });
//         } else {
//           const options = {
//             format: "A4",
//             orientation: "portrait",
//             border: {
//               top: "1cm", // default is 0, units: mm, cm, in, px
//               right: "2cm",
//               bottom: "1cm",
//               left: "1cm",
//             },
//           };

//           pdf.create(data, options).toFile(``)
//         }
//       }
//     );
//   } catch (error) {}
// };
