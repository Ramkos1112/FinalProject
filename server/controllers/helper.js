import jwt from 'jsonwebtoken';
import { getDB } from '../index.js';

export const createAccessJWT = (payload) => {
  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: '1h' });
};

export const validateJWT = (providedJWT) => {
  return new Promise((resolve) => {
    jwt.verify(providedJWT, process.env.JWT_ACCESS_SECRET, (err, decoded) => {
      if (err) {
        resolve({ error: 'Session expired or invalid token' });
      } else {
        resolve(decoded);
      }
    });
  });
};

export const getUserByEmail = async (email) => {
  const db = getDB();
  const usersCollection = db.collection('users');
  return await usersCollection.findOne({ email });
};