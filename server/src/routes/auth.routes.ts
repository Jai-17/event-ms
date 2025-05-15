import { Router } from "express";
import { signUp, signIn, verifyEmail } from "../controllers/auth.controller";

const router = Router();

router.post("/signin", signIn);
router.post("/signup", signUp);
router.get("/verify-email", verifyEmail)

export default router;