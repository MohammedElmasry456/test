class ApiFeatures {
  constructor(reqQuery, mongooseQuery) {
    this.reqQuery = reqQuery;
    this.mongooseQuery = mongooseQuery;
  }

  filter() {
    const queryObj = { ...this.reqQuery };
    const exluded = ["limit", "fields", "page", "sort", "keyword"];
    exluded.forEach((e) => delete queryObj[e]);
    let queryObjStr = JSON.stringify(queryObj);
    queryObjStr = queryObjStr.replace(/\b(gte|gt|lte|lt)\b/g, (e) => `$${e}`);
    this.mongooseQuery = this.mongooseQuery.find(JSON.parse(queryObjStr));
    return this;
  }

  sort() {
    if (this.reqQuery.sort) {
      const sortBy = this.reqQuery.sort.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.sort(sortBy);
    } else {
      this.mongooseQuery = this.mongooseQuery.sort("-createdAt");
    }
    return this;
  }

  limitField() {
    if (this.reqQuery.fields) {
      const fields = this.reqQuery.fields.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.select(fields);
      if (fields.includes("category")) {
        this.mongooseQuery = this.mongooseQuery.populate({
          path: "category",
          select: "name -_id",
        });
      }
    } else {
      this.mongooseQuery = this.mongooseQuery.select("-__v");
    }
    return this;
  }

  search(modelName) {
    if (this.reqQuery.keyword) {
      let query = {};
      if (modelName === "products") {
        query.$or = [
          { title: { $regex: this.reqQuery.keyword, $options: "i" } },
          { description: { $regex: this.reqQuery.keyword, $options: "i" } },
        ];
      } else {
        query = { name: { $regex: this.reqQuery.keyword, $options: "i" } };
      }
      this.mongooseQuery = this.mongooseQuery.find(query);
    }
    return this;
  }

  paginate(countDoc) {
    const page = this.reqQuery.page * 1 || 1;
    const limit = this.reqQuery.limit * 1 || 5;
    const skip = (page - 1) * limit;
    const endedIndex = page * limit;
    const pagination = {};
    pagination.totalPages = Math.ceil(countDoc / limit);
    pagination.limit = limit;
    pagination.currentPage = page;
    if (endedIndex < countDoc) {
      pagination.next = page + 1;
    }
    if (skip > 0) {
      pagination.previous = page - 1;
    }

    this.paginationResult = pagination;
    this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);
    return this;
  }

  async count() {
    const clone = this.mongooseQuery.clone();
    const count = await clone.countDocuments();
    this.count = count;
  }
}

module.exports = ApiFeatures;
