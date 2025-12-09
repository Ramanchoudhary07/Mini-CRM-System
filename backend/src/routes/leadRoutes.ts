import { Router } from "express";
import {
  assignLeadToAgent,
  changeLeadStatus,
  createLead,
  deleteLead,
  getAllLeads,
  getLeadById,
  updateLead,
} from "../controllers/leadController";

const router = Router();

router.get("/", getAllLeads);
router.get("/:id", getLeadById);
router.post("/", createLead);
router.put("/:id", updateLead);
router.delete("/:id", deleteLead);
router.put("/:id/assign", assignLeadToAgent);
router.put("/:id/status", changeLeadStatus);

export default router;
