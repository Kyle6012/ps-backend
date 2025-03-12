import express from 'express';
import { upload } from '../middlewares/upload.mjs';
import { createCase, getCases, getCaseById, assignCase, updateCaseStatus } from '../controllers/caseController.mjs';

const router = express.Router();

router.post('/report', upload.single('media'), createCase);
router.get('/', getCases);
router.get('/:id', getCaseById);
router.put('/:id/assign', assignCase);
router.put('/:id/status', updateCaseStatus);

export default router;