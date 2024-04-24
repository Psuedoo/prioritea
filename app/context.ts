import { Dispatch, SetStateAction, createContext } from "react";
import { Task } from "./task";

interface TaskContext {
  tasks: Task[];
  setTasks: Dispatch<SetStateAction<Task[]>>;
}

export const TaskContext = createContext<TaskContext>({
  tasks: [],
  setTasks: () => {},
});
