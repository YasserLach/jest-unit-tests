import { TaskManager } from './TaskManager';
import { UserManager } from './UserManager';
import express from 'express';
import userRouter from './UserRoutes';

const app = express();
const port = 3000;

app.use(express.json());
app.use('/api', userRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const taskManager = new TaskManager();
const userManager = new UserManager();

const task1 = taskManager.addTask('Complete homework', 'Finish math assignment');
const task2 = taskManager.addTask('Read a book', 'Start with "The Hitchhiker\'s Guide to the Galaxy"');

const user1 = userManager.addUser('Yasser');
const user2 = userManager.addUser('Hamza');

console.log('All tasks:', taskManager.getTasks());
console.log('All users:', userManager.getAllUsers());

const completedTask = taskManager.completeTask(task1.id);
console.log('Completed task:', completedTask);

console.log('Updated tasks:', taskManager.getTasks());


