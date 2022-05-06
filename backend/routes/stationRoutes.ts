import express from "express";
import { createStaion, getAll, getStation, updateStation, deleteStation } from "../controllers/stationController";
import { protect, admin } from '../middlewares/authMiddleware';

const router = express.Router();


router.route('/all').get(protect, admin, getAll);
router.route('/:id').get(protect, admin, getStation);
router.route('/').post(protect, admin, createStaion);
router.route('/:id').put(protect, admin, updateStation);
router.route('/:id').delete(protect, admin, deleteStation);

export default router;