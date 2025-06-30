import { Router } from "express";

import { verifyJWT } from '../middleware/auth.js';
import { login, loginAuto, register, editUserInfo } from "../controllers/userController.js";

const router = Router();

router.post('/login', login);

router.get('/loginAuto', loginAuto);

router.post('/register', register);

router.patch('/editInfo', verifyJWT, editUserInfo);

export default router;