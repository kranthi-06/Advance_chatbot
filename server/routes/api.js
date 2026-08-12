import express from 'express';
import { getCrops, getLocations, analyzeVirtualIoT } from '../controllers/apiController.js';

const router = express.Router();

router.get('/crops', getCrops);
router.get('/locations', getLocations);
router.post('/analyze', analyzeVirtualIoT);

export default router;
