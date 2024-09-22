import express from 'express';
import { UserInput } from '../utils/utils';
import { User } from '../db/db';
import { generateJWT, USERAUTHENTICATION } from '../middleware/userAuth';

const router = express.Router();

// Route to get the current user's information
router.get('/me', USERAUTHENTICATION, async (req, res) => {
  const admin = await User.findOne({ username: req.headers["user"] });
  if (!admin) {
    res.status(403).json({ msg: "Admin doesn't exist" });
    return;
  }
  res.json({
    username: admin.username
  });
});

// Route for user login
router.get('/login', async (req, res) => {
  const data: UserInput = req.body;
  const username = data.username;
  const password = data.password;

  // Check if the user exists with the provided credentials
  const user = await User.findOne({ username, password });
  if (user) {
    let jwtToken = generateJWT({ username, password });
    res.status(200).json({
      'msg': 'Login Successful',
      'token': jwtToken
    });
  } else {
    res.status(403).json({
      'msg': "Invalid username and password"
    });
  }
});

// Route for user sign-up
router.post('/sign-up', async (req, res) => {
  const data: UserInput = req.body;
  const username = data.username;
  const password = data.password;

  // Check if the user already exists
  const user = await User.findOne({ username, password });
  if (user) {
    res.status(403).json({
      'msg': 'User already exists'
    });
  } else {
    const token = generateJWT({ username, password });
    const newUser = new User({ username, password });
    // Save the new user to the database
    newUser.save();
    res.status(200).json({
      'msg': 'Account created successfully',
      "token": token
    });
  }
})

export default router;
