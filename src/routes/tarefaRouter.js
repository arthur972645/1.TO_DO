import { Router } from "express";

import { create, getAll, getTarefa } from "../controllers/tarefaController.js";

const router = Router();

router.post("/", create);
router.get("/", getAll)
router.get("/:id", getTarefa)

export default router;
