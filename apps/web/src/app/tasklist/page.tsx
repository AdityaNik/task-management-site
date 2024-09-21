"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import axios from "axios";
import { Task } from "../store/atoms/task";
import { ObjectId } from "bson";
import { BASE_URL } from "../config";
import { useRecoilValue } from "recoil";
import { userState } from "../store/atoms/user";
import { useToast } from "@/hooks/use-toast";

enum STATUS {
  TO_DO = "To Do",
  IN_PROGRESS = "In Progress",
  COMPLETED = "Completed",
}

enum PRIORITY {
  Low,
  Medium,
  High,
}

export default function TaskList() {
  const [title, setTile] = useState<string>("");
  const [description, setDiscription] = useState<string>("");
  const [status, setStatus] = useState<STATUS | null>(null);
  const [priority, setPriority] = useState<PRIORITY | null>(null);
  const [duedate, setDueDate] = useState<Date | undefined>(undefined);
  const user = useRecoilValue(userState);
  const { toast } = useToast();

  const [tasks, setTasks] = useState<Task[]>([]);

  const getTasks = async () => {
    const res = await axios.get(`${BASE_URL}/task/get`, {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    });
    if (res.status === 200) {
      const mapped = res.data.tasks.map((task: any) => ({
        ...task,
        priority: Number(task.priority),
      }));
      console.log(mapped);
      setTasks(mapped);
    }
  };

  useEffect(() => {
    getTasks();
  }, []);

  const createTask = async () => {
    if (
      title == "" ||
      description == "" ||
      status == null ||
      priority == null ||
      duedate == undefined
    ) {
      alert("fill feild are required");
      return;
    }
    try {
      const res = await axios.post(
        `${BASE_URL}/task/insert`,
        {
          title,
          description,
          status,
          priority,
          duedate,
        },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      if (res.status === 200) {
        console.log("Task added successfully");
        toast({
          title: "Task added",
        });
        getTasks();
      }
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Error while adding task",
      });
      console.log(e);
    }
  };

  const handleEdit = (id: ObjectId) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task._id === id ? { ...task, isEditing: true } : task
      )
    );
  };

  const handleSave = async (id: ObjectId) => {
    const taskToUpdate = tasks.find((task) => task._id === id);
    if (taskToUpdate) {
      try {
        const res = await axios.post(
          `${BASE_URL}/task/update/${id}`,
          {
            title: taskToUpdate.title,
            description: taskToUpdate.description,
            status: taskToUpdate.status,
            priority: taskToUpdate.priority,
            duedate: taskToUpdate.duedate,
          },
          {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          }
        );
        if (res.status === 200) {
          toast({
            title: "Task saved",
          });
          getTasks();
        }
      } catch (e) {
        console.log(e);
      }
    }
  };

  const applyFilter = async (value: any) => {
    let mapped: Task[] = [];
    const res = await axios.get(`${BASE_URL}/task/get`, {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    });
    if (res.status === 200) {
      mapped = res.data.tasks.map((task: any) => ({
        ...task,
        priority: Number(task.priority),
      }));
    }
    if (value === "Completed") {
      const completed = mapped.filter(
        (task) => task.status === STATUS.COMPLETED
      );
      setTasks(completed);
    }
    if (value === "All") {
      getTasks();
    }
    if (value === "In-Progress") {
      const inProgeress = mapped.filter(
        (task) => task.status === STATUS.IN_PROGRESS
      );
      setTasks(inProgeress);
    }
    if (value === "To-Do") {
      const toDo = mapped.filter((task) => task.status === STATUS.TO_DO);
      setTasks(toDo);
    }
    if (value === "Priority") {
      const priority = mapped.sort((taskA, taskB) => {
        return taskB.priority - taskA.priority;
      });
      setTasks(priority);
    }
    if (value === "Due-Date") {
      const priority = mapped.sort((taskA, taskB) => {
        console.log(taskA.duedate);
        const dateA = new Date(taskA.duedate);
        const dateB = new Date(taskB.duedate);
        return dateA.getTime() - dateB.getTime();
      });
      setTasks(priority);
    }
  };

  if (user.isLoading) {
    return <div>loading! Need to login....</div>;
  } else {
    return (
      <div>
        <Card className="m-8 lg:m-16">
          <CardHeader>
            <CardTitle>
              <div className="flex justify-between mb-4">
                <div>
                  <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0">
                    Task List
                  </h2>
                </div>
                <div className="flex gap-8">
                  <Select
                    onValueChange={(value) => {
                      applyFilter(value);
                    }}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select a filter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="All">All</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                        <SelectItem value="In-Progress">In Progress</SelectItem>
                        <SelectItem value="To-Do">To Do</SelectItem>
                        <SelectItem value="Priority">Priority</SelectItem>
                        <SelectItem value="Due-Date">Due Date</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size={"lg"}>Create Task</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <div className="flex justify-center">
                          <DialogTitle>Create Task</DialogTitle>
                        </div>
                      </DialogHeader>
                      <div className="grid gap-4 px-2">
                        {/* Title */}
                        <div className="grid w-full max-w-sm items-center gap-1.5">
                          <Label htmlFor="title">Title</Label>
                          <Input
                            id="title"
                            placeholder="Task Title"
                            onChange={(e) => {
                              setTile(e.target.value);
                            }}
                          />
                        </div>

                        {/* Description (Multiline) */}
                        <div className="grid w-full max-w-sm items-center gap-1.5">
                          <Label htmlFor="description">Description</Label>
                          <Textarea
                            id="description"
                            placeholder="Task Description"
                            onChange={(e) => {
                              setDiscription(e.target.value);
                            }}
                          />
                        </div>

                        {/* Status */}
                        <div className="grid w-full max-w-sm items-center gap-1.5">
                          <Label htmlFor="status">Status</Label>
                          <Select
                            onValueChange={(value) => {
                              setStatus(value as STATUS);
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select Status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="To Do">To Do</SelectItem>
                              <SelectItem value="In Progress">
                                In Progress
                              </SelectItem>
                              <SelectItem value="Completed">
                                Completed
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Priority */}
                        <div className="grid w-full max-w-sm items-center gap-1.5">
                          <Label htmlFor="priority">Priority</Label>
                          <Select
                            onValueChange={(value) => {
                              setPriority(value as unknown as PRIORITY);
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select Priority" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value={PRIORITY.High.toString()}>
                                High
                              </SelectItem>
                              <SelectItem value={PRIORITY.Medium.toString()}>
                                Medium
                              </SelectItem>
                              <SelectItem value={PRIORITY.Low.toString()}>
                                Low
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Due Date (Date Picker) */}
                        <div className="grid w-full max-w-sm items-center gap-1.5">
                          <Label htmlFor="dueDate">Due Date</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="outline" className="col-span-3">
                                {duedate
                                  ? format(duedate, "PPP")
                                  : "Pick a date"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={duedate}
                                onSelect={setDueDate}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>
                      <DialogClose asChild className="mt-2">
                        <Button onClick={createTask}>Create</Button>
                      </DialogClose>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-flow-row grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-8 mx-6">
              {tasks.map((task) => (
                <Card
                  key={task._id as unknown as React.Key}
                  className={`${
                    task.status === "Completed"
                      ? "border-green-500"
                      : task.status === "In Progress"
                        ? "border-yellow-500"
                        : task.status === "To Do"
                          ? "border-red-500"
                          : ""
                  }`}
                >
                  <CardContent>
                    <div className="grid gap-4 py-4">
                      {/* Title */}
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label
                          htmlFor={`title-${task._id}`}
                          className="text-right"
                        >
                          Title
                        </Label>
                        <Input
                          id={`title-${task._id}`}
                          value={task.title}
                          disabled={!task.isEditing}
                          className="col-span-3"
                          onChange={(e) => {
                            task.title = e.target.value;
                            setTasks([...tasks]);
                          }}
                        />
                      </div>

                      {/* Description (Multiline) */}
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label
                          htmlFor={`description-${task._id}`}
                          className="text-right"
                        >
                          Description
                        </Label>
                        <Textarea
                          id={`description-${task._id}`}
                          value={task.description}
                          disabled={!task.isEditing}
                          className="col-span-3"
                          onChange={(e) => {
                            task.description = e.target.value;
                            setTasks([...tasks]);
                          }}
                        />
                      </div>

                      {/* Status */}
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label
                          htmlFor={`status-${task._id}`}
                          className="text-right"
                        >
                          Status
                        </Label>
                        <Select
                          disabled={!task.isEditing}
                          value={task.status}
                          onValueChange={(value) => {
                            task.status = value as STATUS;
                            setTasks([...tasks]);
                          }}
                        >
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="To Do">To Do</SelectItem>
                            <SelectItem value="In Progress">
                              In Progress
                            </SelectItem>
                            <SelectItem value="Completed">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Priority */}
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label
                          htmlFor={`priority-${task._id}`}
                          className="text-right"
                        >
                          Priority
                        </Label>
                        <Select
                          disabled={!task.isEditing}
                          value={task.priority.toString()}
                          onValueChange={(value) => {
                            task.priority = value as unknown as PRIORITY;
                            setTasks([...tasks]);
                          }}
                        >
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select Priority" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={PRIORITY.High.toString()}>
                              High
                            </SelectItem>
                            <SelectItem value={PRIORITY.Medium.toString()}>
                              Medium
                            </SelectItem>
                            <SelectItem value={PRIORITY.Low.toString()}>
                              Low
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Due Date (Date Picker) */}
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label
                          htmlFor={`dueDate-${task._id}`}
                          className="text-right"
                        >
                          Due Date
                        </Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="col-span-3"
                              disabled={!task.isEditing}
                            >
                              {task.duedate
                                ? format(task.duedate, "PPP")
                                : "Pick a date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={task.duedate}
                              onSelect={(date) => {
                                task.duedate = date as Date;
                                setTasks([...tasks]);
                              }}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    {task.isEditing ? (
                      <Button onClick={() => handleSave(task._id)}>Save</Button>
                    ) : (
                      <Button onClick={() => handleEdit(task._id)}>Edit</Button>
                    )}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button>Delete</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <div>
                            <DialogTitle>Delete Task</DialogTitle>
                          </div>
                        </DialogHeader>
                        Do you really want to delete the task?
                        <DialogClose asChild>
                          <Button
                            onClick={async (e) => {
                              const res = await axios.delete(
                                `${BASE_URL}/task/delete/${task._id}`,
                                {
                                  headers: {
                                    Authorization:
                                      localStorage.getItem("token"),
                                  },
                                }
                              );
                              if (res.status === 200) {
                                console.log("Successfully deleted task");
                                toast({
                                  title: "Task deleted successfully",
                                });
                                getTasks();
                              }
                            }}
                          >
                            Delete
                          </Button>
                        </DialogClose>
                      </DialogContent>
                    </Dialog>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between"></CardFooter>
        </Card>
      </div>
    );
  }
}
