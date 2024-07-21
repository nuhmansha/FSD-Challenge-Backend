const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/jwtToken");
const taskcontroller = require("../controller/taskcontroller");

router.get("/tasks", authMiddleware, taskcontroller.getTasks);
router.post("/addtasks", authMiddleware, taskcontroller.createTask);
router.put("/tasks/:taskId", authMiddleware, taskcontroller.updateTaskStatus);
router.delete("/taskdelete/:taskId", authMiddleware, taskcontroller.deleteTask);

module.exports = router;
