import { Router } from 'express';
import { requireAdmin } from '../../middleware/auth.js';
import {
  getSubmissions,
  getSubmissionById,
  updateSubmission,
} from '../../controllers/admin/submissions.controller.js';

const router = Router();

router.use(requireAdmin);

router.get('/', getSubmissions);
router.get('/:id', getSubmissionById);
router.patch('/:id', updateSubmission);

export default router;
