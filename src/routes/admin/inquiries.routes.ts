import { Router } from 'express';
import { requireAdmin } from '../../middleware/auth.js';
import {
  getInquiries,
  getInquiryById,
  updateInquiry,
  addMessage,
} from '../../controllers/admin/inquiries.controller.js';

const router = Router();

router.use(requireAdmin);

router.get('/', getInquiries);
router.get('/:id', getInquiryById);
router.patch('/:id', updateInquiry);
router.post('/:id/messages', addMessage);

export default router;
