import { Router } from 'express';
import multer from 'multer';
import { createSubmission } from '../../controllers/buyer/submissions.controller.js';
import { formLimiter } from '../../middleware/rate-limit.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB per file
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

const router = Router();

router.post('/', formLimiter, upload.array('photos', 10), createSubmission);

export default router;
