const router = express.Router();
import express from "express";

import { editProfile } from "../controllers/editProfile.js";
import authenticateToken from "../middleware/authenticateToken.js";
import { getUserProfile } from "../controllers/getUserProfile.js";
import { getUserProfilePublic } from "../controllers/getUserProfilePublic.js";
import { followUser } from "../controllers/followUser.js";
import { unfollowUser } from "../controllers/unfollowUser.js";

router.patch("/edit", authenticateToken, editProfile);
router.get("/me", authenticateToken, getUserProfile);
router.get("/profile/:username", getUserProfilePublic);

router.post("/follow/:username", authenticateToken, followUser);
router.post("/unfollow/:username", authenticateToken, unfollowUser);

export default router;
