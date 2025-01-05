import express from "express";
import {
  crateNewBusiness,
  createReview,
  deleteBusinessById,
  deleteReview,
  getAllBusiness,
  getBusinessById,
  getBusinessByUser,
  getFilteredBusiness,
  updateBusiness,
} from "../controllers/BusinessController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/crateBusiness", verifyToken, crateNewBusiness);

router.post("/createReview/:businessId", verifyToken, createReview);

router.get("/getAll", getAllBusiness);

router.get("/getFilteredBusiness", getFilteredBusiness);

router.get("/getById/:id", getBusinessById);

router.get("/getBusinessByUser", verifyToken, getBusinessByUser);

router.patch("/:businessId", verifyToken, updateBusiness);

router.delete("/byId/:id", verifyToken, deleteBusinessById);

router.delete("/deleteReview/:businessId/:reviewId", verifyToken, deleteReview);

export default router;
