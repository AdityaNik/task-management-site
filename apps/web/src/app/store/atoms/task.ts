import { atom } from 'recoil';
import { ObjectId } from 'bson'

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

export interface Task {
  _id: ObjectId,
  title: string,
  description: string,
  status: STATUS,
  priority: PRIORITY,
  duedate: Date,
  isEditing: boolean
}
type TaskInput = Partial<Task>;

interface TaskAtom {
  isLoading: boolean
  tasks: TaskInput
}


export const taskState = atom<TaskAtom>({
  key: 'taskState',
  default: {
    isLoading: true,
    tasks: {}
  }
})