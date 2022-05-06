import express from 'express';
import { getAll, newBooking, myBookings, deleteBooking } from '../controllers/ticketController';
import { protect, admin } from '../middlewares/authMiddleware';

const router = express.Router();

router.route("/").post(protect, newBooking);
router.route("/all").get(protect, admin, getAll);
router.route("/me").get(protect, myBookings);
router.route("/:id").delete(protect, admin, deleteBooking);

export default router;