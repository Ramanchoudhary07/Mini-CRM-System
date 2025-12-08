import { Router } from "express";
import {
  createAgent,
  deleteAgent,
  getAgentById,
  getAllAgents,
  updateAgent,
} from "../controllers/agentController";

const router = Router();

router.get("/", getAllAgents);

router.get("/:id", getAgentById);

router.post("/", createAgent);

router.put("/:id", updateAgent);

router.delete("/:id", deleteAgent);

export default router;
