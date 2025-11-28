import db from "../db.js";

// UNFOLLOW USER
export const unfollowUser = (req, res) => {
  try {
    const followerId = req.user.userId;
    const { username } = req.params;

    const targetUser = db
      .prepare("SELECT id FROM users WHERE username = ?")
      .get(username);

    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const stmt = db.prepare(`
      DELETE FROM follows
      WHERE follower_id = ? AND following_id = ?
    `);

    const result = stmt.run(followerId, targetUser.id);

    if (result.changes === 0) {
      return res.status(400).json({ message: "You do not follow this user" });
    }

    return res.json({ message: "Unfollowed successfully" });

  } catch {
    return res.status(500).json({ message: "Something went wrong" });
  }
};