
import { TaskManager } from '../src/TaskManager';
import { UserManager } from '../src/UserManager';
import request from 'supertest';
import express, { Application } from 'express';
import bodyParser from 'body-parser';
import userRouter from '../src/UserRoutes';

const app: Application = express();
app.use(bodyParser.json());
app.use('/api', userRouter);


 describe('TaskManager', () => {
  it('should get all tasks', () => {
    const taskManager = new TaskManager();
    expect(taskManager.getTasks()).toEqual([]);
  });

  it('should add a new task', () => {
    const taskManager = new TaskManager();
    const newTask = taskManager.addTask('Test Task', 'This is a test task');
    expect(taskManager.getTasks()).toEqual([newTask]);
  });

  it('should mark a task as completed', () => {
    const taskManager = new TaskManager();
    const task = taskManager.addTask('Test Task', 'This is a test task');
    const completedTask = taskManager.completeTask(task.id);
    expect(completedTask !== null && completedTask !== undefined ? completedTask.completed : undefined).toBe(true);
  });

  it('should return undefined when completing a non-existing task', () => {
    const taskManager = new TaskManager();
    const completedTask = taskManager.completeTask(1);
    expect(completedTask).toBeUndefined();
  });

  it('should update a task', () => {
    const taskManager = new TaskManager();
    const task = taskManager.addTask('Test Task', 'This is a test task');
    const updatedTask = taskManager.updateTask(task.id, 'Updated Task', 'This task has been updated');
    expect(updatedTask !== null && updatedTask !== undefined ? updatedTask.title : undefined).toBe('Updated Task');
    expect(updatedTask !== null && updatedTask !== undefined ? updatedTask.description : undefined).toBe('This task has been updated');
  });

  it('should delete a task', () => {
    const taskManager = new TaskManager();
    const task = taskManager.addTask('Test Task', 'This is a test task');
    const result = taskManager.deleteTask(task.id);
    expect(result).toBe(true);
    expect(taskManager.getTasks()).toEqual([]);
  });

  it('should handle deleting a non-existing task', () => {
    const taskManager = new TaskManager();
    const result = taskManager.deleteTask(1);
    expect(result).toBe(false);
  });

  it('should handle updating a non-existing task', () => {
    const taskManager = new TaskManager();
    const updatedTask = taskManager.updateTask(1, 'Updated Task', 'This task has been updated');
    expect(updatedTask).toBeUndefined();
  });

  it('should get completed tasks', () => {
    const taskManager = new TaskManager();
    const task1 = taskManager.addTask('Test Task 1', 'This is a test task 1');
    const task2 = taskManager.addTask('Test Task 2', 'This is a test task 2');
    taskManager.completeTask(task1.id);
    const completedTasks = taskManager.getCompletedTasks();
    expect(completedTasks.length).toBe(1);
    expect(completedTasks[0].completed).toBe(true);
  });

  it('should get pending tasks', () => {
    const taskManager = new TaskManager();
    const task1 = taskManager.addTask('Test Task 1', 'This is a test task 1');
    const task2 = taskManager.addTask('Test Task 2', 'This is a test task 2');
    taskManager.completeTask(task1.id);
    const pendingTasks = taskManager.getPendingTasks();
    expect(pendingTasks.length).toBe(1);
    expect(pendingTasks[0].completed).toBe(false);
  });

  it('should get a task by ID', () => {
    const taskManager = new TaskManager();
    const task1 = taskManager.addTask('Test Task 1', 'This is a test task 1');
    const task2 = taskManager.addTask('Test Task 2', 'This is a test task 2');
    const foundTask = taskManager.getTaskById(task1.id);
    expect(foundTask).toEqual(task1);
  });

  it('should handle getting a non-existing task by ID', () => {
    const taskManager = new TaskManager();
    const foundTask = taskManager.getTaskById(1);
    expect(foundTask).toBeUndefined();
  });

  it('should filter tasks by keyword (exact match)', () => {
    const taskManager = new TaskManager();
    const task1 = taskManager.addTask('Test Task 1', 'This is a test task 1');
    const task2 = taskManager.addTask('Test Task 2', 'This is a test task 2');
    const filteredTasks = taskManager.filterTasksByKeyword('Test Task 1');
    expect(filteredTasks).toEqual([task1]);
  });

  it('should filter tasks by keyword (partial match in title)', () => {
    const taskManager = new TaskManager();
    const task1 = taskManager.addTask('Test Task 1', 'This is a test task 1');
    const task2 = taskManager.addTask('Test Task 2', 'This is a test task 2');
    const filteredTasks = taskManager.filterTasksByKeyword('Test');
    expect(filteredTasks).toEqual([task1, task2]);
  });

  it('should filter tasks by keyword (partial match in description)', () => {
    const taskManager = new TaskManager();
    const task1 = taskManager.addTask('Test Task 1', 'This is a test task 1');
    const task2 = taskManager.addTask('Test Task 2', 'This is a test task 2');
    const filteredTasks = taskManager.filterTasksByKeyword('test task');
    expect(filteredTasks).toEqual([task1, task2]);
  });

  it('should filter tasks by keyword (no match)', () => {
    const taskManager = new TaskManager();
    const task1 = taskManager.addTask('Test Task 1', 'This is a test task 1');
    const task2 = taskManager.addTask('Test Task 2', 'This is a test task 2');
    const filteredTasks = taskManager.filterTasksByKeyword('Non-Matching Keyword');
    expect(filteredTasks).toEqual([]);
  });

  it('should assign a task to a user', () => {
    const taskManager = new TaskManager();
    const userManager = new UserManager();
    
    const user = userManager.addUser('TestUser');
    const task = taskManager.addTask('Test Task', 'This is a test task');

    const assignedTask = taskManager.assignTaskToUser(task.id, user.id);

    expect(assignedTask !== null && assignedTask !== undefined ? assignedTask.user : undefined).toEqual(user);
    expect(user.tasks).toEqual([task]);
  });

  it('should return undefined when assigning a task to a non-existing user', () => {
    const taskManager = new TaskManager();
    const task = taskManager.addTask('Test Task', 'This is a test task');
    
    const assignedTask = taskManager.assignTaskToUser(task.id, 1);

    expect(assignedTask).toBeUndefined();
  });

  it('should return undefined when assigning a non-existing task to a user', () => {
    const taskManager = new TaskManager();
    const userManager = new UserManager();
    
    const user = userManager.addUser('TestUser');

    const assignedTask = taskManager.assignTaskToUser(1, user.id);

    expect(assignedTask).toBeUndefined();
  });

  it('should get tasks assigned to a user', () => {
    const taskManager = new TaskManager();
    const userManager = new UserManager();
    
    const user = userManager.addUser('TestUser');
    const task1 = taskManager.addTask('Test Task 1', 'This is a test task 1');
    const task2 = taskManager.addTask('Test Task 2', 'This is a test task 2');

    taskManager.assignTaskToUser(task1.id, user.id);
    taskManager.assignTaskToUser(task2.id, user.id);

    const userTasks = taskManager.getUserTasks(user.id);

    expect(userTasks).toEqual([task1, task2]);
  });

  it('should return an empty array when getting tasks for a non-existing user', () => {
    const taskManager = new TaskManager();
    const userTasks = taskManager.getUserTasks(1);

    expect(userTasks).toEqual([]);
  });

});




describe('UserManager', () => {
  it('should add a new user', () => {
    const userManager = new UserManager();
    const newUser = userManager.addUser('TestUser');
    expect(userManager.getAllUsers()).toEqual([newUser]);
  });

  it('should update a user', () => {
    const userManager = new UserManager();
    const user = userManager.addUser('TestUser');
    const updatedUser = userManager.updateUser(user.id, 'UpdatedUser');
    expect(updatedUser !== null && updatedUser !== undefined ? updatedUser.username : undefined).toBe('UpdatedUser');
  });

  it('should return undefined when updating a non-existing user', () => {
    const userManager = new UserManager();
    const updatedUser = userManager.updateUser(1, 'UpdatedUser');
    expect(updatedUser).toBeUndefined();
  });

  it('should remove a user', () => {
    const userManager = new UserManager();
    const user = userManager.addUser('TestUser');
    const result = userManager.removeUser(user.id);
    expect(result).toBe(true);
    expect(userManager.getAllUsers()).toEqual([]);
  });

  it('should handle removing a non-existing user', () => {
    const userManager = new UserManager();
    const result = userManager.removeUser(1);
    expect(result).toBe(false);
  });

  it('should get all users', () => {
    const userManager = new UserManager();
    const user1 = userManager.addUser('TestUser1');
    const user2 = userManager.addUser('TestUser2');
    const allUsers = userManager.getAllUsers();
    expect(allUsers).toEqual([user1, user2]);
  });

  it('should get a user by ID', () => {
    const userManager = new UserManager();
    const user1 = userManager.addUser('TestUser1');
    const user2 = userManager.addUser('TestUser2');
    const foundUser = userManager.getUserById(user1.id);
    expect(foundUser).toEqual(user1);
  });

  it('should handle getting a non-existing user by ID', () => {
    const userManager = new UserManager();
    const foundUser = userManager.getUserById(1);
    expect(foundUser).toBeUndefined();
  });
});
 
describe('User Routes', () => {
  it('should add a new user', async () => {
    const response = await request(app)
      .post('/api/users')
      .send({ username: 'testuser' });

    expect(response.status).toBe(200);
    expect(response.body.username).toBe('testuser');
  });

  it('should update a user', async () => {
    const addUserResponse = await request(app)
      .post('/api/users')
      .send({ username: 'testuser' });

    const userId = addUserResponse.body.id;

    const updateResponse = await request(app)
      .put(`/api/users/${userId}`)
      .send({ newUsername: 'updateduser' });

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.username).toBe('updateduser');
  });

  it('should remove a user', async () => {
    const addUserResponse = await request(app)
      .post('/api/users')
      .send({ username: 'testuser' });

    const userId = addUserResponse.body.id;

    const removeResponse = await request(app).delete(`/api/users/${userId}`);

    expect(removeResponse.status).toBe(200);
    expect(removeResponse.body.message).toBe('User removed successfully');
  });

  it('should get all users', async () => {
    const response = await request(app).get('/api/users');

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1); // Assuming one user is added in the previous tests
  });

  it('should get a user by ID', async () => {
    const addUserResponse = await request(app)
      .post('/api/users')
      .send({ username: 'testuser' });

    const userId = addUserResponse.body.id;

    const response = await request(app).get(`/api/users/${userId}`);

    expect(response.status).toBe(200);
    expect(response.body.username).toBe('testuser');
  });
});