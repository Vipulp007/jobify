import express from 'express';
import { register, login, updateUser } from '../assets/auth.js';
import authenticate from '../middleware/authenticate.js';
const router = express.Router();
router.route('/register').post(register);
router.route('/login').post(login);
router.route('/updateuser').patch(authenticate, updateUser);

export default router;
