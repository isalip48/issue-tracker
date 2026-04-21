import { Router } from "express";
import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
} from "../controllers/projectController";
import { protect, authorize } from "../middleware/auth";
import {
  validate,
  createProjectSchema,
  updateProjectSchema,
} from "../utils/validators";

const router = Router();

router.use(protect);

router
  .route("/")
  .get(getProjects)
  .post(validate(createProjectSchema), createProject);

router
  .route("/:id")
  .get(getProjectById)
  .patch(validate(updateProjectSchema), updateProject)
  .delete(authorize("admin"), deleteProject);

export default router;
