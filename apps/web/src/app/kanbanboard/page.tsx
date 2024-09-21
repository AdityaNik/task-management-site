"use client";

import { useState, useEffect, Key } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import axios from "axios";
import { Task } from "../store/atoms/task";
import { BASE_URL } from "../config";

export default function KanbanBoard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [hydrated, setHydrated] = useState<boolean>(false);

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

  // Ensures the component is only rendered on the client-side
  useEffect(() => {
    setHydrated(true);
  }, []);

  const handleDragStart = (e: React.DragEvent<HTMLLIElement>, task: Task) => {
    e.dataTransfer.setData("taskId", task._id.toString());
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = async (
    e: React.DragEvent<HTMLDivElement>,
    newStatus: Task["status"]
  ) => {
    const id = e.dataTransfer.getData("taskId");
    const taskToUpdate = tasks.find((task) => task._id.toString() === id);
    if (taskToUpdate) {
      try {
        const res = await axios.post(
          `${BASE_URL}/task/update/${taskToUpdate._id}`,
          {
            title: taskToUpdate.title,
            description: taskToUpdate.description,
            status: newStatus,
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
          getTasks();
        }
      } catch (e) {
        console.log(e);
      }
    }
  };

  const renderTask = (task: Task) => (
    <li
      key={task._id as unknown as Key}
      draggable
      onDragStart={(e) => handleDragStart(e, task)}
      className="bg-card p-3 rounded-md shadow-sm cursor-move flex flex-col"
    >
      <div className="flex justify-between">
        <span className="font-semibold">{task.title}</span>
        {hydrated && (
          <span className="text-xs text-muted-foreground">
            Due: {new Date(task.duedate).toLocaleDateString()}
          </span>
        )}
      </div>
      <p className="text-sm text-muted-foreground">{task.description}</p>
      <span className="text-xs text-muted-foreground">
        Priority:{" "}
        {task.priority == 2
          ? "High"
          : task.priority == 1
            ? "Medium"
            : task.priority == 0
              ? "Low"
              : ""}
      </span>
      <Separator className="my-4" />
    </li>
  );

  return (
    <div className="flex justify-center mt-14 gap-14 m-14">
      {["To Do", "In Progress", "Completed"].map((status) => (
        <Card
          key={status}
          className={`${
            status === "Completed"
              ? "border-green-500 w-1/3"
              : status === "In Progress"
                ? "border-yellow-500 w-1/3"
                : status === "To Do"
                  ? "border-red-500 w-1/3"
                  : "w-1/3"
          }`}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, status as Task["status"])}
        >
          <CardContent>
            <h3 className="text-xl font-semibold mb-4 mt-4">{status}</h3>
            <ul className="space-y-2">
              {tasks.filter((task) => task.status === status).map(renderTask)}
            </ul>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
