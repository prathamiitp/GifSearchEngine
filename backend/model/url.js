const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const GifUrl = sequelize.define(
  "gifUrls",
  {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    url: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

GifUrl.sync();
GifUrl.removeAttribute('id');

module.exports = GifUrl;