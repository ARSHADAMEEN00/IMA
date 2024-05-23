import express from "express";
import * as AuthController from "../controllers/auth";
import { authenticateUser } from "../middleware/verifyAuth";

const router = express.Router();
// /api/auth

router.post("/login", AuthController.login);
router.post("/signup", AuthController.signUp);
router.get("/refresh", AuthController.refresh);

router.get("/profile", authenticateUser, AuthController.getAuthenticatedUser);

router.put("/profile/password", authenticateUser, AuthController.updateUserPassword);
router.post("/logout", authenticateUser, AuthController.logout);


export default router;
