#! /usr/bin/env node

console.log(
  "This script populates some test games and categories to database."
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const Game = require("./models/game");
const Category = require("./models/category");

const games = [];
const categories = [];

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB);
  console.log("Debug: Should be connected?");
  await createCategories();
  await createGames();
  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}

// Pass the index to the ...Create functions so that,
// category[0] will always be Action category regardless of the order.
// in which the elements of all promise.all's argument complete.

async function categoryCreate(index, name) {
  const category = new Category({ name: name });
  await category.save();
  categories[index] = category;
  console.log(`Added category: ${name}`);
}

async function gameCreate(
  index,
  name,
  description,
  release_year,
  platform,
  category
) {
  const gameDetail = {
    name: name,
    description: description,
  };
  if (release_year != false) gameDetail.release_year = release_year;
  if (platform != false) gameDetail.platform = platform;
  if (category != false) gameDetail.category = category;

  const game = new Game(gameDetail);
  await game.save();
  games[index] = game;
  console.log(`Added game: ${name}`);
}

async function createCategories() {
  console.log("Adding Categories");
  await Promise.all([
    categoryCreate(0, "Action"),
    categoryCreate(1, "Adventure"),
    categoryCreate(2, "Platformer"),
  ]);
}

async function createGames() {
  console.log("Adding Games");
  await Promise.all([
    gameCreate(
      0,
      "The Amazing Spider-Man",
      "Peter parker is bitten by a radioactive bla bla you're spiderman in this game and swinging in NYC is fun.",
      "2019-01-01",
      "PlayStation",
      [categories[0], categories[1]]
    ),
    gameCreate(
      1,
      "The Amazing Spider-Man 2",
      "You're still spider-man  BUT also Miles Morales spider-man and swinging is alot better in this game.",
      "2023-01-01",
      "PlayStation",
      [categories[0], categories[1]]
    ),
    gameCreate(
      2,
      "Terraria",
      "You're a 2D pixelated character that starts his adventure starts from killing slimes and ends with killing a literal god.",
      "2012-01-01",
      "PC",
      [categories[0], categories[1]]
    ),
    gameCreate(
      3,
      "Fallout 4",
      "Vault dweller sleeps in cryopod for years, and wakes up to avenge his wife and get his baby back. FNV is still better tho.",
      "2015-01-01",
      "Xbox",
      categories[1]
    ),
    gameCreate(
      4,
      "Super Mario Bros",
      "Mario tries to save Peach from evil spiked dragon for the 9976th time.",
      "2020-01-01",
      "Switch",
      categories[2]
    ),
  ]);
}
