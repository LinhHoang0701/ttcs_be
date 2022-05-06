import express from "express";
import { getAll, createCompany, updateCompany, deleteCompany, getCompany } from "../controllers/companyController";
import { protect, admin } from '../middlewares/authMiddleware';

const router = express.Router();

router.route('/all').get(protect, admin, getAll);
router.route('/:id').get(protect, admin, getCompany);
router.route('/').post(protect, admin, createCompany);
router.route('/:id').put(protect, admin, updateCompany);
router.route('/:id').delete(protect, admin, deleteCompany);

export default router;