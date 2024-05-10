const Game = require("../models/game");
const Category = require("../models/category");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

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
  // Get list of all games with name and release year.
  const allGames = await Game.find({}, "name release_year")
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
  const game = await Game.findById(req.params.id).populate("category").exec();

  if (game === null) {
    // No results
    const err = new Error("Game not found.");
    err.status = 404;
    return next(err);
  }

  res.render("layout", {
    content: "game_detail",
    title: "Game Detail",
    game: game,
  });
});

// Display Game create form on GET.
exports.game_create_get = asyncHandler(async (req, res, next) => {
  const allCategories = await Category.find().sort({ name: 1 }).exec();

  res.render("layout", {
    content: "game_form",
    title: "Create Games",
    categories: allCategories,
  });
});

// Display Game create form on POST.
exports.game_create_post = [
  // Convert the categories into an array.
  (req, res, next) => {
    if (!Array.isArray(req.body.category)) {
      req.body.category =
        typeof req.body.category === "undefined" ? [] : [req.body.category];
    }
    next();
  },

  // Validate and sanitize fields.
  body("name", "Name must not be empty").trim().isLength({ min: 1 }).escape(),
  body("description", "Description must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("release_year", "Invalid Date")
    .optional({ values: "falsy" })
    .isISO8601()
    .toDate(),
  body("platform").escape(),
  body("category.*").escape(),

  //Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a Game object with escaped and trimmed data.
    const game = new Game({
      name: req.body.name,
      description: req.body.description,
      release_year: req.body.release_year,
      platform: req.body.platform,
      category: req.body.category,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values / error messages.

      // Get all categories for form.
      const allCategories = await Category.find().sort({ name: 1 }).exec();

      // Mark selected categories as checked.
      for (const category of allCategories) {
        if (game.category.includes(category._id)) {
          category.checked = "true";
        }
      }
      res.render("layout", {
        content: "game_form",
        title: "Create Game",
        categories: allCategories,
        errors: errors.array(),
      });
    } else {
      // Data from form is valid. Save Game.
      await game.save();
      res.redirect(game.url);
    }
  }),
];

// Display Game delete form on GET.
exports.game_delete_get = asyncHandler(async (req, res, next) => {
  //Get details of game.
  const game = await Game.findById(req.params.id).exec();

  if (game === null) {
    // No results.
    res.redirect("/inventory/games");
  }
  res.render("layout", {
    content: "game_delete",
    title: "Delete Game",
    game: game,
  });
});

// Display Game delete form on POST.
exports.game_delete_post = asyncHandler(async (req, res, next) => {
  // Get details of game.
  const game = await Game.findById(req.params.id).exec();

  // Delete game and redirect to the list of games.
  await Game.findByIdAndDelete(req.body.gameid);
  res.redirect("/inventory/games");
});

// Display Game update form on GET.
exports.game_update_get = asyncHandler(async (req, res, next) => {
  res.send("TBA: Game update GET");
});

// Display Game update form on POST.
exports.game_update_post = asyncHandler(async (req, res, next) => {
  res.send("TBA: Game update POST");
});
