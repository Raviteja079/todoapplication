const express = require("express");
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const path = require("path");

const dbPath = path.join(__dirname, "todoApplication.db");

const app = express();
app.use(express.json());
let db = null;
const initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("server running");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDbAndServer();

// api 1
app.get("/todos/", async (request, response) => {
  const { status } = request.query;
  const { priority } = request.query;
  const { search_q } = request.query;
  if (status !== undefined && priority !== undefined) {
    const getPlayersQuery = `
        SELECT *
        FROM 
            todo
        WHERE 
            status LIKE '%${status}%' AND
            priority LIKE '%${priority}%';`;
    const todoResponse = await db.all(getPlayersQuery);
    response.send(todoResponse);
  } else if (priority !== undefined) {
    const getPlayersQuery = `
        SELECT *
        FROM 
            todo
        WHERE 
            priority LIKE '%${priority}%';`;
    const todoResponse = await db.all(getPlayersQuery);
    response.send(todoResponse);
  } else if (status !== undefined) {
    const getPlayersQuery = `
        SELECT *
        FROM 
            todo
        WHERE 
            status LIKE '%${status}%';`;
    const todoResponse = await db.all(getPlayersQuery);
    response.send(todoResponse);
  } else if (search_q !== undefined) {
    const getPlayersQuery = `
        SELECT *
        FROM 
            todo
        WHERE 
            todo LIKE '%${search_q}%';`;
    const todoResponse = await db.all(getPlayersQuery);
    response.send(todoResponse);
  }
});

//api 2
app.get("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const getPlayersQuery = `
        SELECT *
        FROM 
            todo
        WHERE 
            id = ${todoId};`;
  const todoResponse = await db.get(getPlayersQuery);
  response.send(todoResponse);
});

//api 3
app.post("/todos/", async (request, response) => {
  const postQuery = `
    INSERT INTO todo(id,todo,priority,status)
    VALUES(5,"MockInterview", "HIGH", "TO DO");`;
  const postResponse = await db.run(postQuery);
  response.send("Todo Successfully Added");
});

//api 4
app.put("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const { status } = request.body;
  const { priority } = request.body;
  const { todo } = request.body;
  const updateQuery = `
    UPDATE
        todo
    SET
       status = '${status}',
       priority = '${priority}',
       todo = '${todo}'

    WHERE 
        id = ${todoId}; `;
  if (priority !== undefined) {
    const updateResponse = await db.run(updateQuery);
    response.send("Priority Updated");
  } else if (todo !== undefined) {
    const updateResponse = await db.run(updateQuery);
    response.send("Todo Updated");
  } else if (status !== undefined) {
    const updateResponse = await db.run(updateQuery);
    response.send("Status Updated");
  }
});

//api 5
app.delete("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const deleteQuery = `
    DELETE
    FROM
        todo
    WHERE 
        id = ${todoId};`;
  const deleteResponse = await db.run(deleteQuery);
  response.send("Todo Deleted");
});

module.exports = app;
