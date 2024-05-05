const Game = require("../models/game");
const asyncHandler = require("express-async-handler");

exports.index = asyncHandler(async (req, res, next) => {
  res.send("TBA: Site Home Page ");
});

// Display list of all Categories.
exports.game_list = asyncHandler(async (req, res, next) => {
  res.send("TBA: Game List");
});

// Display detail for a single Game.
exports.game_detail = asyncHandler(async (req, res, next) => {
  res.send(`TBA Game: ${req.params.id}`);
});

// Display Game create form on GET.
exports.game_create_get = asyncHandler(async (req, res, next) => {
  res.send("TBA: Game create GET");
});

// Display Game create form on POST.
exports.game_create_post = asyncHandler(async (req, res, next) => {
  res.send("TBA: Game create POST");
});

// Display Game delete form on GET.
exports.game_delete_get = asyncHandler(async (req, res, next) => {
  res.send("TBA: Game delete GET");
});

// Display Game delete form on POST.
exports.game_delete_post = asyncHandler(async (req, res, next) => {
  res.send("TBA: Game delete POST");
});

// Display Game update form on GET.
exports.game_update_get = asyncHandler(async (req, res, next) => {
  res.send("TBA: Game update GET");
});

// Display Game update form on POST.
exports.game_update_post = asyncHandler(async (req, res, next) => {
  res.send("TBA: Game update POST");
});
