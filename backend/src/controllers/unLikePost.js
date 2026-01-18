import db from "../db.js";

export const unLikePost = (req, res) => {
  try {
    const userId = req.user.userId;
    const { postId } = req.params;

    // remove from likes table
    const deleteLike = db.prepare(`
      DELETE FROM likes
      WHERE user_id = ? AND post_id = ?
    `);

    const result = deleteLike.run(userId, postId);

    if (result.changes === 0) {
      return res.status(400).json({ message: "You have not liked this post" });
    }

    // decrement likes count only if a like was deleted
    db.prepare(`
      UPDATE posts
      SET likes = CASE WHEN likes > 0 THEN likes - 1 ELSE 0 END
      WHERE id = ?
    `).run(postId);

    return res.json({ message: "Like removed successfully" });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
