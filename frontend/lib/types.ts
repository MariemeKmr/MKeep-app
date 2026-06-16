export type TaskStatus = "todo" | "in_progress" | "done";
export type TaskPriority = "low" | "medium" | "high";

export interface User {
  id: number;
  email: string;
  username: string;
  xp: number;
  level: number;
  current_streak: number;
  longest_streak: number;
  avatar_color: string;
}

export interface Task {
  id: number;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  category: string | null;
  position: number;
  xp_reward: number;
  due_date: string | null;
  created_at: string;
  completed_at: string | null;
}

export interface CompleteResult {
  task: Task;
  xp_gained: number;
  leveled_up: boolean;
  old_level: number;
  new_level: number;
  current_streak: number;
  new_achievements: string[];
  progress: { level: number; xp_into_level: number; xp_for_next: number; progress_pct: number };
}

export interface Stats {
  level: number;
  xp: number;
  xp_into_level: number;
  xp_for_next: number;
  progress_pct: number;
  current_streak: number;
  longest_streak: number;
  total_tasks: number;
  done_tasks: number;
  todo_tasks: number;
  in_progress_tasks: number;
  completion_rate: number;
  weekly: { day: string; done: number }[];
}

export interface Achievement {
  code: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  unlocked: boolean;
  unlocked_at: string | null;
}
