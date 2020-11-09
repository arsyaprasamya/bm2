const mongoose = require('mongoose');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// const search = catchAsync(async (Model, filter) => {
//   const data = await Model.find().or(filter).skip().limit().sort();
// });

exports.createOne = Model => catchAsync(async (req, res, next)=>{

  if(!req.body.ipadd) req.body.ipadd = req.ip;

  const date = new Date();
  date.setHours(date.getHours() +7);
  req.body.createdDate = date;

  const doc = await Model.create(req.body);

  res.status(201).json({
    status : 'success',
    data: doc
  });
});

exports.getOne = (Model, popOptions) =>catchAsync(async (req, res, next)=>{
  let query = Model.findById(req.params.id);
  if(popOptions) query = query.populate(popOptions);

  const doc = await query;

  if(!doc){
    return next(new AppError('No document found with that ID', 404));
  }

  res.status(200).json({
      status: 'success',
      data: doc  
  });
});

exports.getAll = (Model, popOptions) => catchAsync(async (req, res, next)=>{
  let page = 1;
  let limit = 10;
  if(req.query.param){
    const str = JSON.parse(req.query.param);
    page = parseInt(str.pageNumber);
    limit = parseInt(str.limit);
  }
  const Crit = req.body?req.body:{};
  const skip = (page - 1)*limit;
  let query = Model.find(Crit).skip(skip).limit(limit).sort({$natural:-1});
  if(popOptions) query = query.populate(popOptions);

  const data = await query;

  res.status(200).json({
    status: 'success',
    totalCount: data.length,
    data
  });
});

exports.updateOne = Model => catchAsync(async (req, res, next)=>{
  const date = new Date();
  date.setHours(date.getHours() +7);
  req.body.updateDate = date;
  const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if(!doc){
    return next(new AppError('No document found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data : doc
  });
});

exports.deleteOne = Model => catchAsync(async (req, res, next)=>{
  const doc = await Model.findByIdAndDelete(req.params.id);
  
  if(!doc){
    return next(new AppError('No document found with that ID', 404));
  }
  
  res.status(204).json({
    status: 'success',
    message : null
  });
});