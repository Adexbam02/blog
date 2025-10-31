import express from "express";
import db from "../db.js";
import authenticateToken from "../middleware/authenticateToken.js";
import path from "path";
import { getAllPosts } from "../controllers/getAllPosts.js";
import { createPost } from "../controllers/createPost.js";
import { getPostBySlug } from "../controllers/getPostBySlug.js";
import { getAllPostsByAuthor } from "../controllers/getPostByAuthor.js";
import { likePost } from "../controllers/likePost.js";
import { unLikePost } from "../controllers/unLikePost.js";
import { countLikes } from "../controllers/countLikes.js";
import { checkLike } from "../controllers/checkLike.js";
import { deletePost } from "../controllers/deletePost.js";

const router = express.Router();

// POST create post
router.post("/", authenticateToken, createPost);

// DELETE delete post
router.delete("/:id", authenticateToken, deletePost);

// GET all post
router.get("/", getAllPosts);

// GET post by author and slug
router.get("/:author/:slug", getPostBySlug);

router.get("/:author", getAllPostsByAuthor);

// Like a post
// router.post("/posts/:id/like", likePost);

// Unlike a post
// router.delete("/posts/:id/like", unLikePost);

// count likes for a post
// router.get("/posts/:id/likes", countLikes)

router.get("/:id/liked", checkLike);

router.post("/:id/like", authenticateToken, likePost);
router.delete("/:id/like", authenticateToken, unLikePost);
router.get("/:id/likes", countLikes);

router.get("/:username", (req, res) => {
  const {username} = req.params
  try {
    const posts = db
      .prepare(
        "SELECT * FROM posts WHERE username = ? ORDER BY created_at DESC"
      )
      .all(username);
    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching username:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
