import { Router } from 'express';
import { requireAdmin } from '../../middleware/auth.js';
import {
  getNotifications,
  markAsRead,
} from '../../controllers/admin/notifications.controller.js';

const router = Router();

router.use(requireAdmin);

router.get('/', getNotifications);
router.patch('/', markAsRead);

export default router;
