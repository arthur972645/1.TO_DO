import { Router } from "express";
import { getAll } from "../controllers/tarefaController.js";

const router = Router();

router.get("/", getAll);

export default router;
