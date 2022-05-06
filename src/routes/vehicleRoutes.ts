import express from "express";
import { createVehicle, getAll, updateVehicle, deleteVehicle, getVehicle } from "../controllers/vehicleController";
import { protect, admin } from '../middlewares/authMiddleware';

const router = express.Router();

router.route('/all').get(protect, admin, getAll);
router.route('/:id').get(protect, admin, getVehicle);
router.route('/').post(protect, admin, createVehicle);
router.route('/:id').put(protect, admin, updateVehicle);
router.route('/:id').delete(protect, admin, deleteVehicle);

export default router;