import { Router } from "express";
import {
  getAgentAnalytics,
  getAllAgentsPerformance,
  getAnalyticsSummary,
  getMonthlyPerformance,
} from "../controllers/analyticController";

const router = Router();

router.get("/summary", getAnalyticsSummary);

router.get("/agents/performance", getAllAgentsPerformance);

router.get("/agent/:agentId", getAgentAnalytics);

router.get("/performance/monthly", getMonthlyPerformance);

export default router;
