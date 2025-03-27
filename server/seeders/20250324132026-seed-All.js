"use strict";

const { hashPassword } = require("../helpers/bcrypt");
const seedHelper = require("../helpers/seedHelper");

const fs = require("fs").promises;
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    let rows = JSON.parse(await fs.readFile("./data/users.json", "utf8"));
    rows = rows.map((row) => {
      delete row.id;
      row.password = hashPassword(row.password);
      row.createdAt = new Date();
      row.updatedAt = new Date();
      return row;
    });
    await queryInterface.bulkInsert("Users", rows);

    // let { articles } = JSON.parse(
    //   await fs.readFile("./data/news.json", "utf8")
    // );

    const data = await seedHelper();

    rows = data.articles.results.map((result) => {
      return {
        title: result.title,
        body: result.body,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    });
    await queryInterface.bulkInsert("News", rows);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null, {});
    await queryInterface.bulkDelete("News", null, {});
  },
};
