const express = require("express");
const router = express.Router();

const jwtValidator = require("../jwtValidation");
const db = require("../database/db");

router.get("/getTasks", jwtValidator.validateJWT, (req, res) => {
  let userData = req.body.user;
  let query = "SELECT * FROM tasks WHERE user_id = ($1) ORDER BY sort_order";

  db.query(query, [userData.id], (error, response) => {
    if (error) { 
      console.log("error: ", error);
    } else {
      res.status(200).json({ tasks: response.rows });
    }
  });
});

router.post("/addTask", jwtValidator.validateJWT, (req, res) => {
  let { name, sortOrder } = req.body;
  let userId = req.body.user.id;
  let query = "INSERT INTO tasks (user_id, name, sort_order, completed) VALUES ($1, $2, $3, $4)";

  db.query(query, [userId, name, sortOrder, false ], (error, dbResponse) => {
    if (error) {
      console.log("error: ", error);
    } else {
      res.status(200).json({ message: "success" });
    }
  });
});

router.post("/deleteTask", jwtValidator.validateJWT, (req, res) => {
  let query = "DELETE FROM tasks WHERE task_id = ($1)";

  db.query(query, [req.body.task_id], (error, dbResponse) => {
    if (error) {
      console.log("error: ", error);
    } else {
      res.status(200).json({ message: "success" });
    }
  });
});

router.put("/toggleCompletion", jwtValidator.validateJWT, (req, res) => {
  let { task_id, completed } = req.body;
  let query = "UPDATE tasks SET completed=($1) WHERE task_id=($2)";

  db.query(query, [completed, task_id], (error, dbResponse) => {
    if (error) {
      console.log("error: ", error);
    } else {
      res.status(200).json({ message: "success" });
    }
  });
});

router.put("/updateTask", jwtValidator.validateJWT, (req, res) => {
  let { task_id, name } = req.body;
  let query = "UPDATE tasks SET name=($1) WHERE task_id=($2)";

  db.query(query, [name, task_id], (error, dbResponse) => {
    if (error) {
      console.log("error: ", error);
    } else {
      res.status(200).json({ message: "success" });
    }
  });
});

router.put("/updateSortOrder", jwtValidator.validateJWT, (req, res) => {
  let tasks = req.body;
  let errorOccured = false;

  for(let i = 0; i < tasks.length; i++) {
    let query = `UPDATE tasks SET sort_order = ${tasks[i].sort_order} WHERE task_id = ${tasks[i].task_id}`;
    db.query(query, null, (error, dbResponse) => {
      if (error) {
        console.log("error: ", error);
        errorOccured = true;
      } else {
        console.log("success for ", tasks[i].name);
      }
    });
  }

  if (!errorOccured) {
    res.status(200).json({ message: "success" });
  }
});

module.exports = router;