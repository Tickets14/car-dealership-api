import { Router } from 'express';
import { getSettings } from '../../controllers/buyer/settings.controller.js';

const router = Router();

router.get('/', getSettings);

export default router;
