import express, { Request, Response } from 'express';
import { UserManager } from './UserManager';

const userRouter = express.Router();
const userManager = new UserManager();

// Route to add a new user
userRouter.post('/users', (req: Request, res: Response) => {
  const { username } = req.body;
  const user = userManager.addUser(username);
  res.json(user);
});

// Route to update a user
userRouter.put('/users/:userId', (req: Request, res: Response) => {
  const userId = parseInt(req.params.userId, 10);
  const { newUsername } = req.body;
  const updatedUser = userManager.updateUser(userId, newUsername);

  if (updatedUser) {
    res.json(updatedUser);
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

// Route to remove a user
userRouter.delete('/users/:userId', (req: Request, res: Response) => {
  const userId = parseInt(req.params.userId, 10);
  const removed = userManager.removeUser(userId);

  if (removed) {
    res.json({ message: 'User removed successfully' });
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

// Route to get all users
userRouter.get('/users', (req: Request, res: Response) => {
  const allUsers = userManager.getAllUsers();
  res.json(allUsers);
});

// Route to get a user by ID
userRouter.get('/users/:userId', (req: Request, res: Response) => {
  const userId = parseInt(req.params.userId, 10);
  const user = userManager.getUserById(userId);

  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

export default userRouter;
