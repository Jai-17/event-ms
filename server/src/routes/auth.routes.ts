import { Router } from "express";
import { signUp, signIn, verifyEmail, deleteUser, resendVerificationEmail } from "../controllers/auth.controller";
import { isAuthorizedUser, isVerifiedUser } from "../middleware/authCheckUser";

const router = Router();

router.post("/signin", signIn);
router.post("/signup", signUp);
router.get("/verify-email", verifyEmail);
router.get("/resend-verify", resendVerificationEmail);
router.delete("/delete-account", isAuthorizedUser, isVerifiedUser, deleteUser);

export default router;