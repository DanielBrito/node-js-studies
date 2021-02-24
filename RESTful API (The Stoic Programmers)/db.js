const Pool = require("pg").Pool;

const pool = new Pool({
  user: "danielbrito",
  password: "root123",
  database: "todo_db",
  host: "localhost",
  port: 5432
})

module.exports = pool;