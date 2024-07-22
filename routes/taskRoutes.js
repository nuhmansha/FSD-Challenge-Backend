const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/jwtToken");
const taskcontroller = require("../controller/taskcontroller");

router.get("/tasks", authMiddleware, taskcontroller.getTasks);
router.post("/addtasks", authMiddleware, taskcontroller.createTask);
router.put("/tasks/:taskId", authMiddleware, taskcontroller.updateTaskStatus);
router.delete("/taskdelete/:taskId", authMiddleware, taskcontroller.deleteTask);
router.put("/taskedit/:taskId", authMiddleware, taskcontroller.updateTask);
router.get("/tasks/:taskId", authMiddleware, taskcontroller.getTaskById);

module.exports = router;
