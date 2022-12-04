import express from "express";
import { createRoute, getAll, getRoute, updateRoute, deleteRoute } from "../controllers/routeController";
import { protect, admin } from '../middlewares/authMiddleware';

const router = express.Router();

router.route('/').post(protect, admin, createRoute);
router.route('/all').get(protect, admin, getAll);
router.route('/:id').get(protect, admin, getRoute);
router.route('/:id').put(protect, admin, updateRoute);
router.route('/:id').delete(protect, admin, deleteRoute);

export default router;