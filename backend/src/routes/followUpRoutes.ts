import { Router } from "express";
import {
  getAllFollowUps,
  getFollowUpById,
  createFollowUp,
  updateFollowUp,
  deleteFollowUp,
  getPendingFollowUps,
  markFollowUpAsCompleted,
} from "../controllers/followUpController.js";

const router = Router();

router.get("/", getAllFollowUps);

router.get("/pending", getPendingFollowUps);

router.get("/:id", getFollowUpById);

router.post("/", createFollowUp);

router.put("/:id", updateFollowUp);

router.put("/:id/complete", markFollowUpAsCompleted);

router.delete("/:id", deleteFollowUp);

export default router;
