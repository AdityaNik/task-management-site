export enum STATUS {
  TO_DO = "To Do",
  IN_PROGRESS = "In Progress",
  COMPLETED = "Completed",
}

export enum PRIORITY {
  Low,
  Medium,
  High
}

// User input type for authentication
export type UserInput = {
  username: String,
  password: String
}

// Task type definition
export type TaskType = {
  title: String,
  description: String,
  status: STATUS,
  priority: PRIORITY,
  duedate: Date,
}
