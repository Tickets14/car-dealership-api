import { Router } from 'express';
import { login, logout, getSession, refreshToken } from '../../controllers/admin/auth.controller.js';
import { requireAdmin } from '../../middleware/auth.js';

const router = Router();

router.post('/login', login);
router.post('/logout', requireAdmin, logout);
router.get('/session', requireAdmin, getSession);
router.post('/refresh', refreshToken);

export default router;
