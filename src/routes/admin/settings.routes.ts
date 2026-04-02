import { Router } from 'express';
import { requireAdmin } from '../../middleware/auth.js';
import {
  getSettings,
  updateSetting,
} from '../../controllers/admin/settings.controller.js';

const router = Router();

router.use(requireAdmin);

router.get('/', getSettings);
router.patch('/', updateSetting);

export default router;
