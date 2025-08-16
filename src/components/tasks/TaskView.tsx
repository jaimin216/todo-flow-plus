import { useState, useEffect } from "react";
import { TaskCard } from "./TaskCard";
import { EmptyState } from "./EmptyState";
import { ViewType } from "@/components/layout/AppLayout";

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: 1 | 2 | 3 | 4;
  dueDate?: string;
  project?: string;
  createdAt: string;
}

interface TaskViewProps {
  view: ViewType;
  projectId?: string | null;
}

const sampleTasks: Task[] = [
  {
    id: '1',
    title: 'Review quarterly reports',
    completed: false,
    priority: 1,
    dueDate: new Date().toISOString().split('T')[0],
    project: 'work',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Buy groceries for dinner',
    completed: false,
    priority: 2,
    dueDate: new Date().toISOString().split('T')[0],
    project: 'personal',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Call dentist for appointment',
    completed: true,
    priority: 3,
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    title: 'Plan weekend trip',
    completed: false,
    priority: 4,
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    project: 'personal',
    createdAt: new Date().toISOString(),
  },
];

export const TaskView = ({ view, projectId }: TaskViewProps) => {
  const [tasks, setTasks] = useState<Task[]>(sampleTasks);

  const filterTasks = () => {
    const today = new Date().toISOString().split('T')[0];
    
    switch (view) {
      case 'today':
        return tasks.filter(task => task.dueDate === today && !task.completed);
      case 'upcoming':
        return tasks.filter(task => task.dueDate && task.dueDate > today && !task.completed);
      case 'project':
        return tasks.filter(task => task.project === projectId);
      default:
        return tasks.filter(task => !task.completed);
    }
  };

  const handleToggleComplete = (taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  const filteredTasks = filterTasks();

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto space-y-4">
        {filteredTasks.length === 0 ? (
          <EmptyState view={view} />
        ) : (
          filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onToggleComplete={handleToggleComplete}
              onDelete={handleDeleteTask}
            />
          ))
        )}
      </div>
    </div>
  );
};