const Task = require("../models/task");

module.exports = {
  getTasks: async (req, res) => {
    try {
      const tasks = await Task.find({ user: req.user.id }); // Fetch tasks for the logged-in user
      res.json(tasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  createTask: async (req, res) => {
    try {
      const { title, description, status = "todo" } = req.body;

      if (!title || !description) {
        return res
          .status(400)
          .json({ error: "Title and description are required" });
      }

      const newTask = new Task({
        title,
        description,
        status,
        user: req.user.id, // Assuming user id is set in req.user by authentication middleware
      });

      await newTask.save();

      res.status(201).json(newTask);
    } catch (error) {
      console.error("Error creating task:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  updateTaskStatus: async (req, res) => {
    try {
      const { taskId } = req.params;
      const { status } = req.body;

      const task = await Task.findById(taskId);

      if (!task) {
        return res.status(404).json({ error: "Task not found" });
      }

      task.status = status;
      await task.save();

      res.json(task);
    } catch (error) {
      console.error("Error updating task status:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  deleteTask: async (req, res) => {
    try {
      const { taskId } = req.params;

      // Find and delete the task
      const task = await Task.findByIdAndDelete(taskId);

      if (!task) {
        return res.status(404).json({ error: "Task not found" });
      }

      res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
      console.error("Error deleting task:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
};
