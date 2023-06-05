import express from "express";
import * as UserController from "../controllers/user";

const router = express.Router();
//api/admin/user

router.get("/:type", UserController.getAllUsers);
router.get("/single/:userId", UserController.getUserDetails);
router.post("/create", UserController.createUser);
router.put("/update/:userId", UserController.updateUser);
router.put("/update/password/:userId", UserController.updateUserPassword);
router.patch("/update/:userId", UserController.updateUser);
router.delete("/delete/:userId", UserController.deleteUser);
router.post("/delete/multiple", UserController.deleteMultipleUser);




export default router;
