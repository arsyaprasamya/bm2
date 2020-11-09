const Role = require('../models/role');
const services = require('../services/handlerFactory');

exports.create = services.createOne(Role);
exports.getAll = services.getAll(Role);
exports.getById = services.getOne(Role);
exports.update = services.updateOne(Role);
exports.delete = services.deleteOne(Role);

