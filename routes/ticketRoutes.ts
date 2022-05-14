import express from 'express';
import { getAll, newBooking, myBookings, deleteBooking, getTicketByVehicle } from '../controllers/ticketController';
import { protect, admin } from '../middlewares/authMiddleware';

const router = express.Router();

router.route("/").post(protect, newBooking);
router.route("/all").get(protect, admin, getAll);
router.route("/me").get(protect, myBookings);
router.route("/search").get(protect, admin, getTicketByVehicle);
router.route("/:id").delete(protect, admin, deleteBooking);

export default router;