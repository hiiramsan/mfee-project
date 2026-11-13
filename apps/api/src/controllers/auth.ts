import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/user';
import { RequestHandler } from 'express';

const users: User[] = [];

const register = async (req: any, res: any) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      message: 'Username and password are required'
    });
  }

  const duplicate = users.find((u) => u.username === username);

  if (duplicate) {
    return res.status(409).json({
      message: 'User already exists'
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    users.push({ username, password: hashedPassword });

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'SOmething WenT WRoNG' });
  }
};

const login: RequestHandler = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      message: 'Username and password are required'
    });
  }

  const user = users.find((u) => u.username === username);

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const accessToken = jwt.sign({ username }, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ username }, process.env.REFRESH_TOKEN_SECRET!, { expiresIn: '1d' });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  res.json({ accessToken });
};

const logout: RequestHandler = (req, res) => {
  res.clearCookie('refreshToken');
  res.json({ message: 'Logged out successfully!' });
};

const refresh = (req: any, res: any) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({
      message: 'Unauthorized!'
    });
  }

  jwt.verify(refreshToken, process.env.REFRESS_TOKEN_SECRET || '', (err: any, { username }: any) => {
    if (err) {
      return res.status(403).json({
        message: 'Forbidden!'
      });
    }

    const accessToken = jwt.sign({ username }, process.env.ACCESS_TOKEN_SECRET || '', { expiresIn: '15m' });
    res.json({ accessToken });
  });
};

export default {
  register,
  login,
  logout,
  refresh
};
