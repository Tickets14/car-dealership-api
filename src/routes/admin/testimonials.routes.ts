import { Router } from 'express';
import { requireAdmin } from '../../middleware/auth.js';
import {
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from '../../controllers/admin/testimonials.controller.js';

const router = Router();

router.use(requireAdmin);

router.get('/', getTestimonials);
router.post('/', createTestimonial);
router.patch('/:id', updateTestimonial);
router.delete('/:id', deleteTestimonial);

export default router;
