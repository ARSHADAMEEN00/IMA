import express from "express";
import * as NotesController from "../controllers/kuri";

const router = express.Router();
// /api/kuri
router.get("/", NotesController.getKuri);
router.get("/:KuriId", NotesController.getKuriDetail);
router.post("/", NotesController.createKuri);
router.put("/:KuriId", NotesController.updateKuri);
router.delete("/:KuriId", NotesController.deleteKuri);

export default router;
