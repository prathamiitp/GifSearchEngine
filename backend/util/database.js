const Sequelize = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  dialect: 'mysql',
  logging: false,
});

module.exports = sequelize;