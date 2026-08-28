import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const getUserFromToken = async (req) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.split(' ')[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  return User.findById(decoded.id).select('-password');
};

export const protect = async (req, res, next) => {
  try {
    const user = await getUserFromToken(req);

    if (!user) {
      return res.json({ success: false, message: 'Not Authorized' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.json({ success: false, message: 'Not Authorized' });
  }
};

export const protectAdmin = async (req, res, next) => {
  try {
    const user = await getUserFromToken(req);

    if (!user || !['admin', 'owner'].includes(user.role)) {
      return res.json({ success: false, message: 'Not Authorized' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.json({ success: false, message: 'Not Authorized' });
  }
};

export const protectOwner = async (req, res, next) => {
  try {
    const user = await getUserFromToken(req);

    if (!user || user.role !== 'owner') {
      return res.json({ success: false, message: 'Not Authorized' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.json({ success: false, message: 'Not Authorized' });
  }
};
