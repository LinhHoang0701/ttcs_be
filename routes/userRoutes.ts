import express from 'express';
import { getAll, register, login, updateUser, getSingleUser, deleteUser, updateProfile, updatePassword, forgotPassword, resetPassword, searchUser, getAccount } from '../controllers/userController';
import { protect, admin } from '../middlewares/authMiddleware';

const router = express.Router();

router.route("/all").get(protect, admin, getAll);
router.route("/account").get(protect, getAccount);
router.route("/update").put(protect, updateProfile);
router.route("/update/password").put(protect, updatePassword);
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/forgot").post(forgotPassword);
router.route("/reset/:token").post(resetPassword);
router.route("/search").post(protect, admin, searchUser);
router.route("/:userId").put(protect, admin, updateUser).get(protect, getSingleUser).delete(protect, admin, deleteUser);

export default router;