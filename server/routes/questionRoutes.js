import express from 'express';
import {
  getAllQuestions,
  getQuestionsAmount,
  getSpecQuestion,
  addNewQuestion,
  deleteQuestion,
  editQuestion
} from '../controllers/questionController.js';

import { verifyJWT } from '../middleware/auth.js'; // ✅ Import middleware

const router = express.Router();

// Public routes
router.get('/', getAllQuestions);
router.get('/getCount', getQuestionsAmount);
router.get('/:_id', getSpecQuestion);

// Protected routes
router.post('/', verifyJWT, addNewQuestion);     // ✅ Now protected
router.delete('/:_id', verifyJWT, deleteQuestion); // ✅ Now protected
router.patch('/:_id', verifyJWT, editQuestion);   // ✅ Now protected

export default router;