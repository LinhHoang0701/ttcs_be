import express from "express";
import {
  createVehicle,
  getAll,
  updateVehicle,
  deleteVehicle,
  getVehicle,
  getVehicleByCompanyId,
  searchVehicle,
} from "../controllers/vehicleController";
import { protect, admin } from "../middlewares/authMiddleware";

const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

router.route("/all").get(protect, getAll);
router.route("/search").post(protect, admin, searchVehicle);
router
  .route("/getByCompanyId/:companyId")
  .get(protect, admin, getVehicleByCompanyId);
router.route("/:id").get(protect, admin, getVehicle);
router.route("/").post(protect, admin, upload.single("image"), createVehicle);
router.route("/:id").put(protect, admin, updateVehicle);
router.route("/:id").delete(protect, admin, deleteVehicle);

export default router;
