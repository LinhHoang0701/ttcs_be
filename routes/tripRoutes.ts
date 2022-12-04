import express from "express";
import { getAll, getSingle, addTrip, updateTrip, deleteTrip, createTripReview,searchTrips } from '../controllers/tripController';
import { protect, admin } from '../middlewares/authMiddleware';

const router = express.Router();

router.route("/all").get(getAll);
router.route("/").post(protect, admin, addTrip);
router.route("/:id/reviews").post(protect, createTripReview);
router.route("/:id").get(getSingle).put(protect, updateTrip).delete(protect, admin, deleteTrip);
router.route('/search').post(searchTrips)

export default router;