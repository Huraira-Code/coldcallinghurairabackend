
import express from "express";
import {
    createUser,
    checkUser
} from "../controllers/userController.js";

const router = express.Router();

router.post("/create", createUser);
router.post("/check", checkUser);

export default router;
