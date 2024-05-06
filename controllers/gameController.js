const Game = require("../models/game");
const Category = require("../models/category");
const asyncHandler = require("express-async-handler");

exports.index = asyncHandler(async (req, res, next) => {
  // Get details of games, categories in parallel.
  const [numGames, numCategories] = await Promise.all([
    Game.countDocuments({}).exec(),
    Category.countDocuments({}).exec(),
  ]);

  res.render("layout", {
    content: "index",
    title: "Inventory Application",
    game_count: numGames,
    category_count: numCategories,
  });
});

// Display list of all Categories.
exports.game_list = asyncHandler(async (req, res, next) => {
  const allGames = await Game.find({}, "name platform")
    .sort({ name: 1 })
    .exec();
  res.render("layout", {
    content: "game_list",
    title: "Game List",
    game_list: allGames,
  });
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
