const {
  listOwnership,
  addOwnership,
  editOwnership,
  deleteOwnership,
  getOwnership,
  getContractNumber,
  findOwnershipByParent,
} = require("./service");
const { findLeaseByParent } = require("../tenant/service");
// const User = require("../../models/user");
// const Tenant = require("../../customer/model").Customer;
// const Ownership = require("./model").Ownership;

module.exports = {
  ownerList: async function (req, res, next) {
    try {
      const str = JSON.parse(req.query.param);
      const allData = await listOwnership({}, 1, 0);
      let query = {};
      if (str.filter !== null)
        query = { contract_number: str.filter.contract_number };
      const owner = await listOwnership(query, str.pageNumber, str.limit);
      if (owner) {
        res
          .status(200)
          .json({ status: "success", data: owner, totalCount: allData.length });
      } else {
        res
          .status(500)
          .json({ status: "error", data: "internal server error" });
      }
    } catch (e) {
      res.status(500).json({ status: "error", data: e });
    }
  },
  findOwnershipByParent: async function (req, res, next) {
    try {
      const costumerTenantUnit = await findLeaseByParent(req.params.id);
      if (costumerTenantUnit.length == 0) {
        const costumerOwnerUnit = await findOwnershipByParent(req.params.id);
        if (costumerOwnerUnit) {
          return res
            .status(200)
            .json({ status: "status", data: costumerOwnerUnit });
        } else {
          return res
            .status(500)
            .json({ status: "error", data: "internal server error" });
        }
      } else if (costumerTenantUnit) {
        const costumerTenantUnit = await findLeaseByParent(req.params.id);
        return res
          .status(200)
          .json({ status: "success", data: costumerTenantUnit });
      } else {
        return res
          .status(500)
          .json({ status: "error", data: "internal server error" });
      }
    } catch (e) {
      return res
        .status(500)
        .json({ status: "error", data: "internal server error" });
    }
  },
  ownerNumber: async function (req, res, next) {
    try {
      const number = await getContractNumber(req.params.id);
      if (number) {
        res.status(200).json({ status: "success", data: number });
      } else {
        res
          .status(500)
          .json({ status: "error", data: "internal server error" });
      }
    } catch (e) {
      res.status(500).json({ status: "error", data: e });
    }
  },
  ownerGet: async function (req, res, next) {
    try {
      const owner = await getOwnership(req.params.id);
      if (owner) {
        res.status(200).json({ status: "success", data: owner });
      } else {
        res
          .status(500)
          .json({ status: "error", data: "internal server error" });
      }
    } catch (e) {
      res.status(500).json({ status: "error", data: e });
    }
  },
  ownerAdd: async function (req, res, next) {
    try {
      const owner = await addOwnership(req.body);
      if (owner) {
        res.status(200).json({ status: "success", data: owner });
      } else {
        res
          .status(500)
          .json({ status: "error", data: "internal server error" });
      }
    } catch (e) {
      console.log(e);
    }
  },
  ownerUpdate: async function (req, res, next) {
    try {
      const owner = await editOwnership(req.params.id, req.body);
      if (owner) {
        res.status(200).json({ status: "success", data: owner });
      } else {
        res
          .status(500)
          .json({ status: "error", data: "internal server error" });
      }
    } catch (e) {
      console.log(e);
    }
  },
  ownerDelete: async function (req, res, next) {
    try {
      const owner = await deleteOwnership(req.params.id);
      if (owner) {
        res.status(200).json({ status: "success", data: owner });
      } else {
        res
          .status(500)
          .json({ status: "error", data: "internal server error" });
      }
    } catch (e) {
      console.log(e);
    }
  },
};
