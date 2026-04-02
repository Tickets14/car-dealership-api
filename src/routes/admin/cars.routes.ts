import { Router } from 'express';
import multer from 'multer';
import { requireAdmin } from '../../middleware/auth.js';
import {
  getCars,
  getCarById,
  createCar,
  updateCar,
  deleteCar,
  uploadPhotos,
  reorderPhotos,
  deletePhotos,
  bulkUpdateStatus,
} from '../../controllers/admin/cars.controller.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

const router = Router();

router.use(requireAdmin);

router.get('/', getCars);
router.post('/', createCar);
router.patch('/bulk', bulkUpdateStatus);
router.get('/:id', getCarById);
router.patch('/:id', updateCar);
router.delete('/:id', deleteCar);
router.post('/:id/photos', upload.array('photos', 20), uploadPhotos);
router.patch('/:id/photos', reorderPhotos);
router.delete('/:id/photos', deletePhotos);

export default router;
