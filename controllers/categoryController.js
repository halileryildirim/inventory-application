const Category = require("../models/category");
const Game = require("../models/game");
const asyncHandler = require("express-async-handler");

// Display list of all Categories.
exports.category_list = asyncHandler(async (req, res, next) => {
  // Get list of all categoriesş
  const allCategories = await Category.find({}, "name")
    .sort({ name: 1 })
    .exec();

  res.render("layout", {
    content: "category_list",
    title: "Category List",
    category_list: allCategories,
  });
});

// Display detail for a single Category.
exports.category_detail = asyncHandler(async (req, res, next) => {
  // Get details of category and all associated games in parallel
  const [category, gamesInCategory] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Game.find({ category: req.param.id }, "name").exec(),
  ]);

  if (category === null) {
    // No results
    const err = new Error("Category not found.");
    err.status = 404;
    return next(err);
  }

  res.render("layout", {
    content: "category_detail",
    title: "Category Detail",
    category: category,
    category_games: gamesInCategory,
  });
});

// Display Category create form on GET.
exports.category_create_get = asyncHandler(async (req, res, next) => {
  res.send("TBA: Category create GET");
});

// Display Category create form on POST.
exports.category_create_post = asyncHandler(async (req, res, next) => {
  res.send("TBA: Category create POST");
});

// Display Category delete form on GET.
exports.category_delete_get = asyncHandler(async (req, res, next) => {
  res.send("TBA: Category delete GET");
});

// Display Category delete form on POST.
exports.category_delete_post = asyncHandler(async (req, res, next) => {
  res.send("TBA: Category delete POST");
});

// Display Category update form on GET.
exports.category_update_get = asyncHandler(async (req, res, next) => {
  res.send("TBA: Category update GET");
});

// Display Category update form on POST.
exports.category_update_post = asyncHandler(async (req, res, next) => {
  res.send("TBA: Category update POST");
});
