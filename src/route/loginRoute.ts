import express from 'express';
import { loginUser, showLoginPage } from '../controller/loginController';

const router = express.Router();

router.get('/login', showLoginPage);
router.post('/login', loginUser);

export default router;
