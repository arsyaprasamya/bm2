const App = require('../models/application');
const services = require('../services/handlerFactory');

exports.create = services.createOne(App);
exports.getAll = services.getAll(App);
exports.getById = services.getOne(App);
exports.update = services.updateOne(App);