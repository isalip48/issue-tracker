import { Router } from "express";
import {
  createIssue,
  getIssues,
  getIssueById,
  updateIssue,
  deleteIssue,
  getIssueStats,
  getIssueActivity,
} from "../controllers/issueController";
import { protect, authorize } from "../middleware/auth";
import {
  validate,
  createIssueSchema,
  updateIssueSchema,
  issueQuerySchema,
} from "../utils/validators";

const router = Router();

router.use(protect);

router.get("/stats", getIssueStats);

router
  .route("/")
  .get(validate(issueQuerySchema), getIssues)
  .post(validate(createIssueSchema), createIssue);

router
  .route("/:id")
  .get(getIssueById)
  .patch(validate(updateIssueSchema), updateIssue)
  .delete(deleteIssue);

router.get("/:id/activity", getIssueActivity);

export default router;
