import { Router } from 'express';
import {
  getCars,
  getFeaturedCars,
  getRecentlySoldCars,
  getCarById,
} from '../../controllers/buyer/cars.controller.js';

const router = Router();

router.get('/', getCars);
router.get('/featured', getFeaturedCars);
router.get('/recently-sold', getRecentlySoldCars);
router.get('/:id', getCarById);

export default router;
