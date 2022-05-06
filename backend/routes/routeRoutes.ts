import express from "express";
import { createRoute } from "../controllers/routeController";
import { protect, admin } from '../middlewares/authMiddleware';

const router = express.Router();

router.route('/').post(protect, admin, createRoute);

export default router;