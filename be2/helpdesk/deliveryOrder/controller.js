const mongoose = require("mongoose");
const multer = require("multer");
const sharp = require("sharp");
const AppError = require("../../utils/appError");
const Ticket = require("../ticket/model");
const Do = require("./model");
const errorHandler = require("../../controllers/errorController");
const user = require("../../models/user");
const { data } = require("jquery");

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
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

exports.getAllDo = async (req, res, next) => {
  try {
    const skip = (req.query.pageNumber - 1) * req.query.limit;

    let query = {};
    let data;
    if (req.query.status !== "all" && req.query.status !== undefined)
      query = { status: req.query.status };

    if (req.query.search === undefined) {
      data = await Do.find(query)
        .skip(skip)
        .limit(parseInt(req.query.limit))
        .populate({
          path: "ticket",
          select: "-__v",
          populate: { path: "subDefect", select: "-__v" },
        })
        .sort({ $natural: -1 });
    } else {
      const dataTicket = await Ticket.find({
        ticketId: { $regex: req.query.search },
      });
      const idTicket = [];
      dataTicket.forEach((e) => {
        idTicket.push({ ticket: e._id });
      });
      data = await Do.find()
        .or([
          { doId: { $regex: req.query.search } },
          { status: { $regex: req.query.search } },
        ])
        .or(idTicket)
        .skip(skip)
        .limit(parseInt(req.query.limit))
        .populate({
          path: "ticket",
          select: "-__v",
          populate: { path: "subDefect", select: "-__v" },
        })
        .sort({ $natural: -1 });
    }

    const allData = await Do.find();

    res.status(200).json({
      status: "success",
      totalCount: allData.length,
      data,
    });
  } catch (e) {
    console.error(error);
    return errorHandler(error);
  }
};
// list All Do Mobile
exports.getAllDoMobile = async (req, res, next) => { // buat fungsi dengan nama getAllDoMobile dengan metode async lalu sepsifik request, respon yang akan ditampilkan 
  try {
    const skip = (req.query.pageNumber - 1) * req.query.limit; // buat variabel skip dimana terdapat parameter request, query kemdian pageNumber -1 yang artinya pada page 1 terdapat hasil request query tersebut

    let query = {}; // buat variabel query
    let data; // buat variabel data
    if (req.query.status !== "all" && req.query.status !== undefined) // jika pada variable rquset, query status tidak sama dengan dan spesifik all yg artinya semua request, query dan status tidak kosong atau isi != (tidak sama dengan berarti nilainya ada )
      query = { status: req.query.status }; // maka akan menjalankan variabel query yang isinya variabel status yang didapat dari variabel request, quary dan status

    if (req.query.search === undefined) { // jika pada variabel request, query dan sarch nilainya undifined(tidak ada/tidak detemukan)
      data = await Do.find(query) //variabel data akan dijalankan dimana isinya di dapat dari schema DO kemudian menggunkana query mongoose find dengan sepsifik yg dicari yaitu query
        .skip(skip) // kemduian skip untuk pindah halaman
        .limit(parseInt(req.query.limit)) // kemudian limit untuk membatasi dimana yg dibatasi itu hasil pembelahan(parse) dalam variabel request,query, dan limit
        .populate({ // populate untuk menampilkan isi data yg masih bersifak ObjectId (nomor2 gajelas)
          path: "ticket", // populate pada index ticket
          select: "-__v", // version
          populate: { path: "subDefect", select: "-__v" }, // populate 
        })
        .sort({ $natural: -1 }); //kemudian sort dengan menggunakan $natural -1 artinya data yang akan keluar akan menggunakan metode FIFO
    } else {
      

    const allData = await Do.find(); // membuat variabel data dimana isinya didapat dari Schema DO menggunakan query mongoose find 

    res.status(200).json({ //respon yang akan tampil apabila sukses didapat dari query mongoose status(200). json
      status: "success",  //status yang akan tampil apabila data yg dijalankan sukses/berhasil keluar
      totalCount: allData.length, // jumlah data yang akan tampil dimana isinya di hitung dari length pada variabel allData
      data,
    });
  }
  } catch (e) {
    console.error(error);
    return errorHandler(error);
  }
};

exports.getDoById = async (req, res, next) => {
  try {
    const dataDo = await Do.findById(req.params.id).populate({
      path: "ticket",
      select: "-__v",
      populate: { path: "subDefect", select: "-__v" },
    });
    res.status(200).json({
      status: "success",
      data: dataDo,
    });
  } catch (error) {
    console.error(error);
    return errorHandler(error);
  }
};

// get Do by Id Mobile
exports.getDoByIdMobile = async (req, res, next) => { //buat fungsi dengan nama getDoByIdMobile menggunakan metode async dengann sepsifik yang akan di tampilkan yaitu request dan response
  try {
    const dataDo = await Do.findById(req.params.id).populate({path:"ticket", model:"ticket", select:"-__v",
    populate: {
      path:"subDefect",
      select:"-__v",
        populate: {
          path:"defect",
          select:"-__v",
            populate: {
              path: "category",
              select:"-__v"
            }
        },
      },
})
    res.status(200).json({ // respon apabila data yang keluar sukses maka akan tampil status dari json 
      status: "success", // kalimat apabila data yang dijalankan sukses
      data: dataDo, // keluaran data yg sukses 
    });
  } catch (error) {
    console.error(error);
    return errorHandler(error);
  }
};

//get Do by Engineer ID Mobile

exports.getDoByIdUserMobile = async (req, res, next) => { 
  try {
    const dataUser = await user.findById(req.params.id);
    const engineer = dataUser.engineer
    console.log(dataUser)
     const dataDo = await Do.find({
      $and: [{ status: 'fixed'}, { engineerId: engineer }] //pengambilan dataTicket dari model Ticket dengan 2 spesifik dari 
      
    }) .populate({path:"ticket", model:"ticket", select:"-__v",
              populate: {
                path:"subDefect",
                select:"-__v",
                  populate: {
                    path:"defect",
                    select:"-__v",
                    populate: {
                      path: "category",
                      select:"-__v"
                    }
                  },
              },
        }) 
              
        .populate({path:"ticket", model:"ticket", select:"-__v",
        populate: {
          path:"contract",
          select:"-__v",
            populate: {
              path:"unit",
              select: "-__v"
            }
            
        },
  }) 


    res.status(200).json({  
      status: "success", 
      data: dataDo,  
    });
  } catch (error) {
    console.error(error);
    return errorHandler(error);
  }
};

exports.uploadDoPhoto = upload.array("attachment", 5);

exports.resizeDoPhoto = async (req, res, next) => {
  try {
    if (!req.files) return next();

    req.body.attachment = [];
    req.files.map(async (file, index) => {
      const fileName = `${req.body.doId}-${index + 1}.jpeg`;
      req.body.attachment.push(fileName);
      await sharp(file.buffer)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`upload/do/${fileName}`);
    });

    next();
  } catch (e) {
    console.error(e);
    return errorHandler(e);
  }
};

exports.updateDo = async (req, res, next) => {
  try {
    const session = await mongoose.startSession();
    session.startTransaction();

    const updateDo = await Do.findByIdAndUpdate(
      req.params.id,
      req.body
    ).session(session);

    if (updateDo) {
      const dataTicket = {
        status: req.body.status,
        updatedBy: req.body.updatedBy,
        updatedDate: Date.now(),
      };

      const updateTicket = await Ticket.findOneAndUpdate(
        { ticketId: req.body.ticketId },
        dataTicket
      ).session(session);

      if (updateTicket) {
        await session.commitTransaction();
      } else {
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({
          status: "fail",
          message: "Something Went Wrong!",
        });
      }
    } else {
      await session.abortTransaction();
      session.endSession();
      res.status(500).json({
        status: "fail",
        message: "Something Went Wrong!",
      });
    }
    session.endSession();
    res.status(200).json({
      status: "success",
      message: "Update DO success!",
    });
  } catch (error) {
    console.error(error);
    return errorHandler(error);
  }
};

//Udate Do Mobile
exports.updateDoMobile = async (req, res, next) => {
  try {
    const session = await mongoose.startSession();
    session.startTransaction();

    const updateDo = await Do.findByIdAndUpdate(
      req.params.id,
      req.body
    ).session(session);

    if (updateDo) {
      const dataTicket = {
        status: req.body.status,
        updatedBy: req.body.updatedBy,
        // updatedDate: Date.now(),
      };

      const updateTicket = Ticket.findOneAndUpdate(
        { ticketId: req.body.ticketId },
        dataTicket,
        {new: true}
      ).session(session);

      if (updateTicket) {
        await session.commitTransaction();
        session.endSession();
        res.status(200).json({
          status: "success",
          message: "Update DO success!",
        });
      } else {
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({
          status: "fail",
          message: "Something Went Wrong!",
        });
      }
    } else {
      await session.abortTransaction();
      session.endSession();
      res.status(500).json({
        status: "fail",
        message: "Something Went Wrong!",
      });
    }
  } catch (error) {
    console.error(error);
    return errorHandler(error);
  }
};

exports.deleteDo = async (req, res, next) => {
  try {
    const session = await mongoose.startSession();
    session.startTransaction();

    const deleteDo = await Do.findByIdAndDelete(req.params.id).session(session);
    if (deleteTicket) {
      session.commitTransaction();
    } else {
      session.abortTransaction();
      session.endSession();
      res.status(500).json({
        status: "fail",
        message: "Something Went Wrong!",
      });
    }
    session.endSession();
    res.status(204).json({
      status: "success",
      message: "Delete DO Success",
    });
  } catch (error) {
    console.error(error);
    return errorHandler(error);
  }
};

exports.getImages = async (req, res, next) => {
  try {
    const data = await Do.findById(req.params.id);
    let link = [];
    data.attachment.forEach((e) =>
      link.push(`${req.headers.host}/doImages/${e}`)
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
