import { Router } from 'express';

import { verifyJWT } from '../middleware/auth.js';
import { addNewQuestion, deleteQuestion, editQuestion, getAllQuestions, getQuestionsAmount, getSpecQuestion } from '../controllers/questionController.js';

const router = Router();

router.get('', getAllQuestions);

router.get('/getCount', getQuestionsAmount);

router.get('/:_id', getSpecQuestion);

router.post('/', verifyJWT, addNewQuestion);

router.delete('/:_id', verifyJWT, deleteQuestion);

router.patch('/:_id', verifyJWT, editQuestion);

export default router;