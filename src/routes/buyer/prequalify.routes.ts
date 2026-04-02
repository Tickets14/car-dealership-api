import { Router } from 'express';
import { createPreQualification } from '../../controllers/buyer/prequalify.controller.js';
import { validate } from '../../middleware/validate.js';
import { preQualificationSchema } from '../../lib/validations.js';
import { formLimiter } from '../../middleware/rate-limit.js';

const router = Router();

router.post('/', formLimiter, validate(preQualificationSchema), createPreQualification);

export default router;
