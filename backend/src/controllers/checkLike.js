import db from "../db.js";

// Check if a user liked a post
export const checkLike = (req, res) => {
  try {
    const userId = req.user.userId; // from authenticateToken
    const { postId } = req.params;

    // Check if post exists
    const post = db.prepare("SELECT id FROM posts WHERE id = ?").get(postId);
    if (!post) return res.status(404).json({ error: "Post not found" });

    // Check if user liked it
    const like = db
      .prepare("SELECT id FROM likes WHERE user_id = ? AND post_id = ?")
      .get(userId, postId);

    return res.json({ liked: !!like });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Something went wrong" });
  }
};
