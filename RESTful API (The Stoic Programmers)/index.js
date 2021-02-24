const express = require("express");

const pool = require("./db");

const app = express();

// Allows access request.body as JSON data:
app.use(express.json());

app.get("/todos", async (req, res) => {
  try {
    const allTodos = await pool.query("SELECT * FROM todo");

    res.json(allTodos.rows);
  } 
  catch (error) {
    console.log(error.message);
  }
});

app.get("/todos/:id", async (req, res) => {
  const {id} = req.params;

  try {
    const todo = await pool.query("SELECT * FROM todo WHERE id = $1", [id]);

    res.json(todo.rows[0]);
  } 
  catch (error) {
    console.log(error.message);  
  }
});

app.post("/todos", async (req, res) => {
  try{
    const {description} = req.body;
    const newTodo = await pool.query("INSERT INTO todo(description) VALUES ($1) RETURNING *", 
      [description]);

    res.json(newTodo.rows[0]);
  }
  catch(err){
    console.log(err.message)
  }
});

app.put("/todos/:id", async (req, res) => {
  try {
    const {id} = req.params; // Used for WHERE clause
    const {description} = req.body; // Used for SET clause

    const updateTodo = await pool.query(
      "UPDATE todo SET description = $1 WHERE id = $2", 
      [description, id]);

    res.json("Entry successfully updated!");
  } 
  catch (error) {
    console.log(error.message);  
  }
})

app.delete("/todos/:id", async (req, res) => {
  try {
    const {id} = req.params;

    const deleteTodo = await pool.query("DELETE FROM todo WHERE id = $1", [id]);

    res.json("Entry successfully deleted!");
  } 
  catch (error) {
    console.log(error.message);  
  }
})

app.listen(8888, () => {
  console.log("Server is running on port 8888...");
})