import { Router } from 'express';
import { createInquiry } from '../../controllers/buyer/inquiries.controller.js';
import { validate } from '../../middleware/validate.js';
import { inquirySchema, visitRequestSchema } from '../../lib/validations.js';
import { formLimiter } from '../../middleware/rate-limit.js';
import { z } from 'zod';

const router = Router();

// Union schema: accept either inquiry or visit request
const inquiryOrVisitSchema = z.union([visitRequestSchema, inquirySchema]);

router.post('/', formLimiter, validate(inquiryOrVisitSchema), createInquiry);

export default router;
