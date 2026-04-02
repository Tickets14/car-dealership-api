import { Router } from 'express';
import { requireAdmin } from '../../middleware/auth.js';
import { getDashboard } from '../../controllers/admin/dashboard.controller.js';

const router = Router();

router.use(requireAdmin);

router.get('/', getDashboard);

export default router;
