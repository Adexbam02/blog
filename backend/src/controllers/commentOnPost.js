import db from "../db.js";

export const commentOnPost = (req, res) => {
  try {
    const userId = req.user.userId;
    const { postId } = req.params;
    const { content } = req.body;

    // Validate content
    if (!content || content.trim().length === 0) {
      return res.status(400).json({ error: "Comment cannot be empty" });
    }

    // Validate postId
    if (!postId || isNaN(postId)) {
      return res.status(400).json({ error: "Invalid post ID" });
    }

    // Optional: Check if post exists
    const post = db.prepare(`SELECT id FROM posts WHERE id = ?`).get(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Insert comment
    const stmt = db.prepare(
      `INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)`
    );

    const result = stmt.run(postId, userId, content);

    // Fetch the created comment to return
    const newComment = db
      .prepare(
        `SELECT c.id, c.content, c.created_at, u.username, u.profile_picture_url
         FROM comments c
         JOIN users u ON c.user_id = u.id
         WHERE c.id = ?`
      )
      .get(result.lastInsertRowid);

    return res.status(201).json({
      message: "Comment added successfully",
      comment: newComment
    });
  } catch (error) {
    console.error("Comment error:", error);
    return res.status(500).json({ error: "Failed to add comment" });
  }
};