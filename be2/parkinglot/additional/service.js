const AddParking = require("./model").Addplot;
const Block = require("../../block/model").Block;
const tenant = require("../../contract/tenant/model").tenant
const owner = require("../../contract/owner/model").Ownership;
const errorHandler = require("../../controllers/errorController");

module.exports = {
  // addParking: async data => {
  //   try {
  //     const addParking = await AddParking.create(data);
  //     if (addParking) {
  //       const block = await Block.findOneAndUpdate(
  //         { _id: data.blockPark },
  //         { $set: { availspace: data.avaliablespace } }
  //       );
  //       if (block) {
  //         return addParking;
  //       }
  //       return false;
  //     }
  //     return false;
  //   } catch (error) {
  //     errorHandler(error);
  //   }
  // },

  addParking: async function(body) {
    try {
      var addParking = await new AddParking(body).save();
      if (addParking) {
        return addParking;
      }else{
        return false;
      }
    } catch (error) {
      console.log(error);
    }
  },

  listAdditionPark: async (query, page = 1, limit = 1000) => {
    try {
      const skip = (page - 1) * limit;
      let parkinglot;
      if (Object.keys(query).length === 0) {
        parkinglot = await AddParking.find({})
          .skip(skip)
          .limit(limit)
          .populate("vehicle", "-__v")
          .populate("blockPark", "-__v")
          .sort({ $natural: -1 });
      } else {
        parkinglot = await AddParking.find()
          .or([{ 'customer': { $regex: `${query.customer}` } }])
          .skip(skip)
          .limit(limit)
          .select("-__v")
          .populate("vehicle", "-__v")
          .populate("blockPark", "-__v")
          .sort({ $natural: -1 });
      }
      if (parkinglot) {
        return parkinglot;
      } else {
        return false;
      }
    } catch (e) {
      errorHandler(e);
    }
  },
  findAddPark: async id => {
    try {
      const parkinglot = await AddParking.findById(id);
      if (parkinglot) {
        return parkinglot;
      } else {
        return false;
      }
    } catch (e) {
      errorHandler(e);
    }
  },
  editAddPark: async (id, data) => {
    try {
      const parkinglot = await AddParking.findByIdAndUpdate(id, data);
      if (parkinglot) {
        return parkinglot;
      } else {
        return false;
      }
    } catch (e) {
      errorHandler(e);
    }
  },
  deleteParkingLot: async id=> {
    try {
      const parkinglot = await AddParking.findByIdAndDelete(id);
      if (parkinglot) {
        return parkinglot;
      } else {
        return false;
      }
    } catch (e) {
      errorHandler(e);
    }
  }
};
