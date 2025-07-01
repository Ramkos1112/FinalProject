import { Router } from 'express';
import { verifyJWT } from '../middleware/auth.js';
import { getAnswersForQuestion, addAnswerToQuestion, deleteAnswer, editAnswer } from '../controllers/commentController.js';

const router = Router();

router.get('/:questionId/answers', getAnswersForQuestion);

router.post('/:questionId/answers', verifyJWT, addAnswerToQuestion);

router.delete('/answers/:_id', verifyJWT, deleteAnswer);

router.patch('/answers/:_id', verifyJWT, editAnswer);

export default router;