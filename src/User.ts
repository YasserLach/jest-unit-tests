import { Task } from './Task';

export class User {
    private static counter = 0;
  
    public id: number;
    public username: string;
    public tasks: Task[];
  
    constructor(username: string) {
      this.id = ++User.counter;
      this.username = username;
      this.tasks = [];
    }
  }