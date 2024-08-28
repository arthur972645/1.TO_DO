import { Router } from "express";

import { create, getAll, getTarefa, updateTarefa } from "../controllers/tarefaController.js";

const router = Router();

router.post("/", create);
router.get("/", getAll)
router.get("/:id", getTarefa)
router.put("/:id", updateTarefa)

export default router;
