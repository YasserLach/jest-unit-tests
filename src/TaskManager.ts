import { Task } from './Task';
import { User } from './User';

export class TaskManager {
  private tasks: Task[];
  private users: User[];

  
  constructor() {
    this.tasks = [];
    this.users = [];
  }

  getTasks(): Task[] {
    return this.tasks;
  }

  getTaskById(id: number): Task | undefined {
    return this.tasks.find((task) => task.id === id);
  }

  addTask(title: string, description: string, dueDate?: Date): Task {
    const id = this.tasks.length + 1;
    const task = new Task(id, title, description, false, dueDate);
    this.tasks.push(task);
    return task;
  }

  updateTask(id: number, title: string, description: string, dueDate?: Date): Task | undefined {
    const taskIndex = this.tasks.findIndex((task) => task.id === id);

    if (taskIndex !== -1) {
        this.tasks[taskIndex].title = title;
        this.tasks[taskIndex].description = description;
        this.tasks[taskIndex].dueDate = dueDate;
        return this.tasks[taskIndex];
    }
    return undefined;
  }

  completeTask(id: number): Task | undefined {
    const taskIndex = this.tasks.findIndex((task) => task.id === id);

    if (taskIndex !== -1) {
        this.tasks[taskIndex].completed = true;
        return this.tasks[taskIndex];
    }
    return undefined;
  }

  deleteTask(id: number): boolean {
    const initialLength = this.tasks.length;
    this.tasks = this.tasks.filter((task) => task.id !== id);
    return initialLength !== this.tasks.length;
  }

  getCompletedTasks(): Task[] {
    return this.tasks.filter((task) => task.completed);
  }

  getPendingTasks(): Task[] {
    return this.tasks.filter((task) => !task.completed);
  }

  filterTasksByKeyword(keyword: string): Task[] {
    const lowerKeyword = keyword.toLowerCase();
    return this.tasks.filter((task) =>
      task.title.toLowerCase().includes(lowerKeyword) ||
      task.description.toLowerCase().includes(lowerKeyword)
    );
  }

  assignTaskToUser(taskId: number, userId: number): Task | undefined {
    const task = this.tasks.find((t) => t.id === taskId);
    const user = this.users.find((u) => u.id === userId);

    if (task && user) {
      task.user = user;
      user.tasks.push(task);
      return task;
    }

    return undefined;
  }

  getUserTasks(userId: number): Task[] {
    const user = this.users.find((u) => u.id === userId);
    return user ? user.tasks : [];
  }
}
