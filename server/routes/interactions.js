import { Router } from 'express';

import { verifyJWT } from '../middleware/auth.js';
import { getAllLikes, toggleLike, getUserLikes, getAllUserLikedQuestions } from '../controllers/likesController.js';

const router = Router();

router.get('/count/:targetType/:targetId', getAllLikes);

router.post('/toggle/:targetType/:targetId', verifyJWT, toggleLike);

router.get('/user-liked/:targetType/:targetId', verifyJWT, getUserLikes);

router.get('/liked-questions', verifyJWT, getAllUserLikedQuestions);

export default router;