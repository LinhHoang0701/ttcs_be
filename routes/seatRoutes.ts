import express from "express";
import {
  getAll,
  getSeat,
  createSeat,
  updateSeat,
  deleteSeat,
  searchSeat,
} from "../controllers/seatController";
import { protect, admin } from "../middlewares/authMiddleware";

const router = express.Router();

router.route("/all").get(protect, admin, getAll);
router.route("/:id").get(getSeat);
router.route("/search").post(protect, admin, searchSeat);
router.route("/").post(protect, admin, createSeat);
router.route("/:id").put(protect, admin, updateSeat);
router.route("/:id").delete(protect, admin, deleteSeat);

export default router;
