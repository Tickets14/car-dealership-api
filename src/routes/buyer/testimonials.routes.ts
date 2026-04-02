import { Router } from 'express';
import { getTestimonials } from '../../controllers/buyer/testimonials.controller.js';

const router = Router();

router.get('/', getTestimonials);

export default router;
