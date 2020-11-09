const services = require("./service");
const errorHandler = require("../../controllers/errorController");

const {addParking } = require("./service");


module.exports = {

  addParking : async function (req, res, next) {
    const parking = await addParking(req.body);
      if (parking) {
        return res.status(200).json({ "status": "success", "data": parking });
      }else{
      return res.status(500).json({ "status": "fail", "data": "Internal Server Error" });
      }
  },  

  listAddParking: async (req, res, next) => {
    try {
      const str = JSON.parse(req.query.param);
      let query = {};
      if (str.filter !== null){
        query = { customer: str.filter.customer };
      }
      const allData = await services.listAdditionPark({}, 1, 0);
      const parking = await services.listAdditionPark(query, str.pageNumber, str.limit);
      if (parking) {
        return res.status(200).json({
          status: "success",
          data: parking,
          totalCount: allData.length,
        });
      }
      return res
        .status(500)
        .json({ status: "fail", data: "internal server error" });
    } catch (err) {
      return errorHandler(err);
    }
  },
  listParking: async function(req, res, next){
    try {
        const str = JSON.parse(req.query.param);
        let query = {};
        if (str.filter !== null){
            query={nmplot: str.filter.nmplot}
        };
        const allData = await services.listParkingLot({}, 1, 0);
        const parking = await services.listParkingLot(query, str.pageNumber, str.limit);
        if(parking){
            return res.status(200).json({"status": "success", "data": parking, "totalCount": allData.length});
        }else{
            return res.status(500).json({"status": "success", "data": "internal server error"});
        }
    }catch (e) {
        return res.status(500).json({"status": "error", "data": e});
    }
},
  getAddParking: async (req, res, next) => {
    try {
      const parking = await services.findAddPark(req.params.id);
      if (parking)
        return res.status(200).json({ status: "success", data: parking });

      return res
        .status(500)
        .json({ status: "fail", data: "Internal Server Error" });
    } catch (e) {
      return errorHandler(e);
    }
  },
  editAddParking: async (req, res, next) => {
    try {
      const parking = await services.editAddPark(req.params.id, req.body);
      if (parking)
        return res.status(200).json({ status: "success", data: parking });

      return res
        .status(500)
        .json({ status: "fail", data: "internal server error" });
    } catch (e) {
      return errorHandler(e);
    }
  },
  deleteAddParking: async (req, res, next) => {
    try {
      const parking = await services.deleteParkingLot(req.params.id);
      if (parking)
        return res.status(200).json({ status: "success", data: parking });

      return res
        .status(500)
        .json({ status: "fail", data: "internal server error" });
    } catch (e) {
      return errorHandler(e);
    }
  },
};
