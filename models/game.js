const mongoose = require("mongoose");

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

// Export model
module.exports = mongoose.model("Game", GameSchema);
