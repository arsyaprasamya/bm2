/**
 *
 * Master gas database services
 */

const Power = require("./model").Power;

module.exports = {
  addPower: async function (power) {
    try {
      const newPower = await new Power(power).save();
      if (newPower) {
        return newPower;
      } else {
        return false;
      }
    } catch (e) {
      console.log(e);
    }
  },

//add power by Mobile
addPowerMobile: async function (power) {
  try {
    const newPower = await new Power(power).save();
    if (newPower) {
      return newPower;
    } else {
      return false;
    }
  } catch (e) {
    console.log(e);
  }
},

listPower: async function (query, page = 1, limit = 1000) {
    try {
      const skip = (page - 1) * limit;
      let power;
      if (Object.keys(query).length === 0) {
        power = await Power.find()
          .skip(skip)
          .limit(limit)
          .populate({
            path: "unt",
            model: "Unit",
            select: "-__v",
            populate: {
              path: "flr",
              model: "Floor",
              select: "-__v",
              populate: {
                path: "blk",
                model: "Block",
                select: "-__v",
                populate: {
                  path: "grpid",
                  model: "BlockGroup",
                  select: "-__v",
                },
              },
            },
          })
          .populate("rte", "-__v")
          .select("-__v")
          .sort({ $natural: -1 });
      } else {
        power = await Power.find()
          .or([
            { 'nmmtr' : { $regex: `${query.nmmtr}` } },
          ])
          .skip(skip)
          .limit(limit)
          .populate({
            path: "unt",
            model: "Unit",
            select: "-__v",
            populate: {
              path: "flr",
              model: "Floor",
              select: "-__v",
              populate: {
                path: "blk",
                model: "Block",
                select: "-__v",
                populate: {
                  path: "grpid",
                  model: "BlockGroup",
                  select: "-__v",
                },
              },
            },
          })
          .populate("rte", "-__v")
          .select("-__v")
          .sort({ $natural: -1 });
      }
      if (power) {
        return power;
      } else {
        return false;
      }
    } catch (e) {
      console.log(e);
    }
  },
  findPowerById: async function (id) {
    try {
      const power = await Power.findById(id)
        .populate("rte", "-__v")
        .populate("unt", "-__v");
      if (power) {
        return power;
      } else {
        return false;
      }
    } catch (e) {
      console.log(e);
    }
  },
  updatePower: async function (id, power) {
    try {
      const updatePower = await Power.findByIdAndUpdate(id, power);
      if (updatePower) {
        return updatePower;
      } else {
        return false;
      }
    } catch (e) {
      console.log(e);
    }
  },
  deletePower: async function (id) {
    try {
      const power = await Power.findByIdAndRemove(id);
      if (power) {
        return power;
      } else {
        return false;
      }
    } catch (e) {
      console.log(e);
    }
  },
};
