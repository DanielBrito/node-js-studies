const Sequelize = require("sequelize");
const sequelize = require("../database/sequelize");

module.exports = sequelize.define(
  "artist",
  {
    id: {
      field: "artist_id",
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoincrement: true,
    },
    name: {
      field: "name",
      type: Sequelize.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: "Name is required",
        },
        isAlpha: {
          args: true,
          msg: "Name must only contain letters",
        },
        len: {
          args: [2, 10],
          msg: "Name must contain between 2 and 10 characters",
        },
      },
    },
  },
  {
    timestamps: false,
  }
);
