const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const ApiFeatures = require("../utils/apiFeatures");
const reviewModel = require("../models/reviewModel");

exports.deleteOne = (model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const document = await model.findByIdAndDelete(id);
    if (!document) {
      return next(new ApiError(`not document for this id ${id}`, 404));
    }
    if (model === reviewModel) {
      await document.constructor.calcAvgAndQuantity(document.product);
    }
    res.status(204).send();
  });

exports.createOne = (model) =>
  asyncHandler(async (req, res) => {
    const newdoc = await model.create(req.body);
    res.status(201).json({ data: newdoc });
  });

exports.updateOne = (model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const document = await model.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!document) {
      return next(new ApiError(`not document for this id ${id}`, 404));
    }
    if (model === reviewModel) {
      await document.constructor.calcAvgAndQuantity(document.product);
    }
    res.status(200).json({ data: document });
  });

exports.getOne = (model, options) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    let query = model.findById(id);
    if (options) {
      query = query.populate(options);
    }
    const document = await query;
    if (!document) {
      return next(new ApiError(`not document for this id ${id}`, 404));
    }
    res.status(200).json({ data: document });
  });

exports.getAll = (model) =>
  asyncHandler(async (req, res) => {
    let filters = {};
    if (req.filter_) {
      filters = req.filter_;
    }
    const ApiFeature = new ApiFeatures(req.query, model.find(filters))
      .filter()
      .sort()
      .limitField()
      .search();

    await ApiFeature.count();
    ApiFeature.paginate(ApiFeature.count);

    const { mongooseQuery, paginationResult } = ApiFeature;
    const documents = await mongooseQuery;
    res.status(200).json({
      results: documents.length,
      paginationResult,
      data: documents,
    });
  });
