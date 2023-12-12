// UserManager.ts
import { User } from './User';

export class UserManager {
  private users: User[];

  constructor() {
    this.users = [];
  }

  addUser(username: string): User {
    const user = new User(username);
    this.users.push(user);
    return user;
  }

  updateUser(userId: number, newUsername: string): User | undefined {
    const user = this.users.find((u) => u.id === userId);

    if (user) {
      user.username = newUsername;
      return user;
    }

    return undefined;

  }

  removeUser(userId: number): boolean {
    const initialLength = this.users.length;
    this.users = this.users.filter((user) => user.id !== userId);
    return initialLength !== this.users.length;
  }

  getAllUsers(): User[] {
    return this.users;
  }

  getUserById(userId: number): User | undefined {
    return this.users.find((user) => user.id === userId);
  }
}
