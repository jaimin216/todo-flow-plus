import { CheckCircle, Calendar, CalendarDays, Inbox } from "lucide-react";
import { ViewType } from "@/components/layout/AppLayout";

interface EmptyStateProps {
  view: ViewType;
}

const emptyStates = {
  inbox: {
    icon: Inbox,
    title: "Your inbox is empty",
    description: "All caught up! Add a new task to get started.",
  },
  today: {
    icon: Calendar,
    title: "No tasks for today",
    description: "Enjoy your free time or add tasks for today.",
  },
  upcoming: {
    icon: CalendarDays,
    title: "No upcoming tasks", 
    description: "You're all set for the future. Plan ahead by adding tasks.",
  },
  project: {
    icon: CheckCircle,
    title: "No tasks in this project",
    description: "Start organizing by adding tasks to this project.",
  },
};

export const EmptyState = ({ view }: EmptyStateProps) => {
  const state = emptyStates[view] || emptyStates.inbox;
  const Icon = state.icon;

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="bg-primary/10 p-6 rounded-full mb-6">
        <Icon className="h-12 w-12 text-primary" />
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2">
        {state.title}
      </h3>
      <p className="text-muted-foreground max-w-md">
        {state.description}
      </p>
    </div>
  );
};