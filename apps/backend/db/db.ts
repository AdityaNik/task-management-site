import mongoose from "mongoose";
import { STATUS, PRIORITY } from "../utils/utils";

// Defining MongoDB schemas
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  status: { type: String, enum: Object.values(STATUS) },
  priority: { type: String, enum: Object.values(PRIORITY) },
  duedate: Date,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

// Defining mongoose models
export const User = mongoose.model("User", userSchema);
export const Task = mongoose.model("Task", taskSchema);
