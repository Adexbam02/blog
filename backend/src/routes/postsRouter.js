import express from "express";
import db from "../db.js";
import authenticateToken from "../middleware/authenticateToken.js";
import { getAllPosts } from "../controllers/getAllPosts.js";
import { createPost } from "../controllers/createPost.js";
import { getPostBySlug } from "../controllers/getPostBySlug.js";
import { getAllPostsByAuthor } from "../controllers/getPostByAuthor.js";
import { likePost } from "../controllers/likePost.js";
import { unLikePost } from "../controllers/unLikePost.js";
import { countLikes } from "../controllers/countLikes.js";
import { checkLike } from "../controllers/checkLike.js";
import { deletePost } from "../controllers/deletePost.js";
import { mostLike } from "../controllers/mostLike.js";
import { editPost } from "../controllers/editPost.js";
import { commentOnPost } from "../controllers/commentOnPost.js";
import { getCommentsByPostId } from "../controllers/getCommentsByPostId.js";
import { deleteComment } from "../controllers/deleteComment.js";
import { postView } from "../controllers/postViews.js";
import { getViewCount } from "../controllers/getViewCount.js";
import { optionalAuth } from "../middleware/optionalAuth.js";
import { getUserTotalViewsInLastOneHr } from "../controllers/getUserViewGrowthToday.js";

const router = express.Router();

// POST create post
router.post("/", authenticateToken, createPost);

// DELETE delete post
router.delete("/:id", authenticateToken, deletePost);

// GET all posts
router.get("/", getAllPosts);

// Like routes (specific paths)
router.post("/like/:postId", authenticateToken, likePost);
router.delete("/like/:postId", authenticateToken, unLikePost);

// Count likes for a post (specific path)
router.get("/:postId/likes", countLikes);

// Optional: Route by slug
router.get("/slug/:slug/likes", countLikes);

router.get("/:postId/liked", authenticateToken, checkLike);

router.get("/most-liked", mostLike);

router.patch("/edit-post/:postId", authenticateToken, editPost);

router.post("/comment/:postId", authenticateToken, commentOnPost);

router.get("/comments/:postId", getCommentsByPostId);

router.delete("/comment/:commentId", authenticateToken, deleteComment);

router.post("/views/:postId", optionalAuth, postView);
router.get("/views/:postId", getViewCount);
// router.get("/views/:userId", getUserTotalViews);
// router.get("/views/growth/:postId", getUserTotalViewsInLastOneHr);

// Get posts by username - MOVE THIS DOWN
router.get("/:username", (req, res) => {
  const { username } = req.params;
  try {
    const posts = db
      .prepare("SELECT * FROM posts WHERE author = ? ORDER BY created_at DESC")
      .all(username);
    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching username:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get all posts by author (already generic)
router.get("/:author", getAllPostsByAuthor);

// Get post by author and slug (most generic - must be last)
router.get("/:author/:slug", getPostBySlug);

export default router;
