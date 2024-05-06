const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const Schema = mongoose.Schema;

const GameSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  release_year: { type: Date, required: true },
  platform: {
    type: String,
    required: true,
    enum: ["PC", "Xbox", "PlayStation", "Switch"],
    default: "PC",
  },
  category: [{ type: Schema.Types.ObjectId, ref: "Category" }],
});

// Virtual for game's URL
GameSchema.virtual("url").get(function () {
  // Not using arrow function for "this" object usage.
  return `/inventory/game/${this._id}`;
});

// Virtual for game's date format
GameSchema.virtual("release_year_formatted").get(function () {
  return DateTime.fromJSDate(this.release_year).toFormat("y"); //fix this
});

// Export model
module.exports = mongoose.model("Game", GameSchema);
