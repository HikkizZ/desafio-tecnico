import { Router } from 'express';
import { plan, verify } from '../controllers/logistics.controller.js';

const router = Router();

router.post('/plan', plan);
router.post('/verify', verify);

export default router;