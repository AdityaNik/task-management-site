import express from 'express';
import { USERAUTHENTICATION } from '../middleware/userAuth';
import { TaskType } from '../utils/utils';
import { Task, User } from '../db/db';
import mongoose from 'mongoose';

const router = express.Router();

// Route to get tasks for the authenticated user
router.get('/get', USERAUTHENTICATION, async (req, res) => {
  const user = await User.findOne({ username: req.headers['user'] });
  if (user) {
    const tasks = await Task.find({ user: user._id });
    res.status(200).json({
      'msg': 'done',
      'tasks': tasks
    });
  } else {
    res.status(403).json({
      "msg": 'User not exists'
    });
  }
});

// Route to get all tasks (admin access)
router.get('/get-all', USERAUTHENTICATION, async (req, res) => {
  const tasks = await Task.find();
  res.status(200).json({
    'msg': 'done',
    'tasks': tasks
  });
});

// Route to insert a new task
router.post('/insert', USERAUTHENTICATION, async (req, res) => {
  const task: TaskType = req.body;
  if (!task) {
    res.status(403).json({
      "msg": "No task data found"
    });
  }
  const user = await User.findOne({ username: req.headers['user'] });
  if (user) {
    const newTask = new Task(task);
    newTask.user = user._id; // Assigning the user ID to the task
    await newTask.save();
    res.status(200).json({
      'msg': 'Inserted Successfully',
      'task': task
    });
  } else {
    res.status(403).json({
      "msg": "You did something unexpected"
    });
  }
});

// Route to update a task by ID
router.post('/update/:id', USERAUTHENTICATION, async (req, res) => {
  let objId = mongoose.isValidObjectId(req.params.id); // Check if the ID is valid
  if (objId) {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (task) {
      res.status(200).json({
        "msg": 'Task Updated',
        "task": task
      });
    } else {
      res.status(403).json({
        "msg": "Task not exists"
      });
    }
  }
});

// Route to delete a task by ID
router.delete('/delete/:id', USERAUTHENTICATION, async (req, res) => {
  const taskId = mongoose.isValidObjectId(req.params.id); // Check if the ID is valid
  if (taskId) {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (task) {
      res.status(200).json({
        "msg": "successfully deleted",
        "task": task
      });
    } else {
      res.status(403).json({
        'msg': 'Something bad happened'
      });
    }
  } else {
    res.status(403).json({
      'msg': 'Something bad happened'
    });
  }
})

export default router;
