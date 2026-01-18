import db from "../db.js";

export const likePost = (req, res) => {
  try {
    const userId = req.user.userId;
    const { postId } = req.params;

    // Check if post exists
    const post = db.prepare("SELECT id FROM posts WHERE id = ?").get(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Insert into likes table
    const insertLike = db.prepare(`
      INSERT INTO likes (user_id, post_id)
      VALUES (?, ?)
    `);

    try {
      insertLike.run(userId, postId);
    } catch (error) {
      if (error.message.includes("UNIQUE")) {
        return res.status(400).json({ message: "You already liked this post" });
      }
      throw error;
    }

    // increment post like count
    db.prepare(`
      UPDATE posts
      SET likes = likes + 1
      WHERE id = ?
    `).run(postId);

    return res.json({ message: "Post liked successfully" });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
