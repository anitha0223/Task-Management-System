import { Router } from "express";
import mongoose from "mongoose";
import Task from "../models/Task.js";
import protect from "../middleware/auth.js";

const router = Router();
router.use(protect);

const allowed = (body) => {
  const data = {};
  for (const key of ["title", "description", "dueDate", "priority", "status"]) {
    if (body[key] !== undefined) data[key] = body[key];
  }
  return data;
};

router.get("/", async (req, res, next) => {
  try {
    const tasks = await Task.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json({ tasks });
  } catch (error) { next(error); }
});

router.post("/", async (req, res, next) => {
  try {
    const data = allowed(req.body);
    if (!data.title?.trim()) return res.status(400).json({ message: "Task title is required." });
    const task = await Task.create({ ...data, user: req.userId });
    res.status(201).json({ task });
  } catch (error) { next(error); }
});

router.put("/:id", async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: "Invalid task ID." });
    const data = allowed(req.body);
    if (data.title !== undefined && !data.title.trim()) return res.status(400).json({ message: "Task title cannot be empty." });
    const task = await Task.findOneAndUpdate({ _id: req.params.id, user: req.userId }, data, { new: true, runValidators: true });
    if (!task) return res.status(404).json({ message: "Task not found." });
    res.json({ task });
  } catch (error) { next(error); }
});

router.delete("/:id", async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: "Invalid task ID." });
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!task) return res.status(404).json({ message: "Task not found." });
    res.json({ message: "Task deleted successfully." });
  } catch (error) { next(error); }
});

export default router;
