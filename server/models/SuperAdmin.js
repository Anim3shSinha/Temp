const mongoose = require("mongoose");

const managerSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  avail: {
    type: Boolean,
    default: false,
  },
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
});

const taskSchema = new mongoose.Schema({
  site: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  client: {
    type: String,
    required: true,
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client",
    required: true,
  },
  postNumber: {
    type: String,
  },
  addInfo: {
    type: String,
  },
  assignedTo: {
    type: {
      id: mongoose.Schema.Types.ObjectId,
      name: String,
    },
    ref: "Manager",
  },
  isCompleted: {
    type: String,
    default: "Pending",
  },
  lastModified: {
    type: Date,
  },
  dueDate: {
    type: Date,
  },
});

const taskAssignmentSchema = new mongoose.Schema({
  task: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Task",
    required: true,
  },
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Manager",
    required: true,
  },

  assignedAt: {
    type: Date,
    default: Date.now,
  },
});

const Manager = mongoose.model("Manager", managerSchema);
const Task = mongoose.model("Task", taskSchema);
const TaskAssignment = mongoose.model("TaskAssignment", taskAssignmentSchema);

module.exports = {
  Manager,
  Task,
  TaskAssignment,
};
