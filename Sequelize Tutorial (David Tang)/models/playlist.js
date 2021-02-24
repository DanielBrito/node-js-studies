const Sequelize = require("sequelize");
const Sequelize = require("../database/sequelize");

module.exports = sequelize.define("playlist", {
  id:{
    field: "playlist_id",
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoincrement: true
  },
  name:{
    field: "name",
    type: Sequelize.STRING
  }
}, {
  timestamps: false
});