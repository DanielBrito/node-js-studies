const Sequelize = require("sequelize");
const Sequelize = require("../database/sequelize");

module.exports = sequelize.define("album", {
  id:{
    field: "album_id",
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoincrement: true
  },
  title:{
    field: "title",
    type: Sequelize.STRING
  }
}, {
  timestamps: false
});