const Category = require("../models/category");
const Game = require("../models/game");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

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
    Game.find({ category: req.params.id }, "name description").exec(),
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
exports.category_create_get = (req, res, next) => {
  res.render("layout", {
    content: "category_form",
    title: "Create Category",
  });
};

// Display Category create form on POST.
exports.category_create_post = [
  // Validate and sanitize the name field.
  body("name", "Category name must contain at least 3 characters.")
    .trim()
    .isLength({ min: 3 })
    .escape(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract validation errors from a request.
    const errors = validationResult(req);

    // Create a category object with escaped and trimmed data.
    const category = new Category({ name: req.body.name });

    if (!errors.isEmpty()) {
      // There are errors, Render the form again with sanitized values/error messages.
      res.render("layout", {
        content: "category_form",
        title: "Create Category",
        category: category,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.
      // Check if Category with same name exists.
      const categoryExists = await Category.findOne({
        name: req.body.name,
      }).exec();
      if (categoryExists) {
        // Category exists. redirect to its detail page.
        res.redirect(categoryExists.url);
      } else {
        await category.save();
        // New category saved. Redirect to category detail page.
        res.redirect(category.url);
      }
    }
  }),
];

// Display Category delete form on GET.
exports.category_delete_get = asyncHandler(async (req, res, next) => {
  // Get details of category and all their games in parallel.
  const [category, gamesInCategory] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Game.find({ category: req.params.id }, "name category").exec(),
  ]);

  if (category === null) {
    // No results.
    res.redirect("/inventory/categories");
  }

  res.render("layout", {
    content: "category_delete",
    title: "Delete Category",
    category: category,
    category_games: gamesInCategory,
  });
});

// Display Category delete form on POST.
exports.category_delete_post = asyncHandler(async (req, res, next) => {
  // Get details of category and all their games in parallel.
  const [category, gamesInCategory] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Game.find({ category: req.params.id }, "name description").exec(),
  ]);

  if (gamesInCategory.length > 0) {
    // Category has books. Render in same way as for GET route.
    res.render("layout", {
      content: "category_delete",
      title: "Delete Category",
      category: category,
      category_games: gamesInCategory,
    });
    return;
  } else {
    // Category has no games. Delete game and redirect to the list of categories.
    await Category.findByIdAndDelete(req.body.categoryid);
    res.redirect("/inventory/categories");
  }
});

// Display Category update form on GET.
exports.category_update_get = asyncHandler(async (req, res, next) => {
  // Get category for form.
  const category = await Category.findById(req.params.id).exec();

  if (category === null) {
    // No results.
    const err = new Error("Category not found.");
    err.status = 404;
    return next(err);
  }

  res.render("layout", {
    content: "category_form",
    title: "Update Category",
    category: category,
  });
});

// Display Category update form on POST.
exports.category_update_post = [
  // Validate and sanitize fields.
  body("name", "Category name must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a category object with escaped and trimmed data and old id.
    const category = new Category({
      name: req.body.name,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values and error messages.

      res.render("layout", {
        content: "category_form",
        title: "Update Category",
        category: category,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid. Update the record.
      const updatedCategory = await Category.findByIdAndUpdate(
        req.params.id,
        category
      );
      res.redirect(updatedCategory.url);
    }
  }),
];
