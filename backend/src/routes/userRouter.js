const router = express.Router();
import express from "express";

import { editProfile } from "../controllers/editProfile.js";
import authenticateToken from "../middleware/authenticateToken.js";
import db from "../db.js";
import { getUserProfile } from "../controllers/getUserProfile.js";
import { getUserProfilePublic } from "../controllers/getUserProfilePublic.js";

router.patch("/edit", authenticateToken, editProfile);
router.get("/me", authenticateToken, getUserProfile);
router.get("/profile/:username", getUserProfilePublic);

export default router;
