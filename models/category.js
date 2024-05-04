const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CategorySchema = new Schema({
  name: { type: String, required: true, minLength: 3, maxLength: 20 },
});

// Virtual for category's URL
CategorySchema.virtual("url").get(function () {
  // Not using arrow for this object.
  return `/inventory/category/${this._id}`;
});

// Export model
module.exports = mongoose.model("Category", CategorySchema);
