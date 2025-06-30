import { Router } from 'express';

import { verifyJWT } from '../middleware/auth.js';
import { getAllLikes, toggleLike, getUserLikes, getAllUserLikedQuestions } from '../controllers/likesController.js';

const router = Router();

router.get('/count/:questionId', getAllLikes);

router.post('/toggle/:questionId', verifyJWT, toggleLike);

router.get('/user-liked/:questionId', verifyJWT, getUserLikes);

router.get('/liked-questions', verifyJWT, getAllUserLikedQuestions);

export default router;