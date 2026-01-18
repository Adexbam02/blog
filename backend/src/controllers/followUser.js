import db from "../db.js";

export const followUser = (req, res) => {
  try {
    const followerId = req.user.userId; // from authenticateToken
    const { username } = req.params;

    const targetUser = db
      .prepare("SELECT id FROM users WHERE username = ?")
      .get(username);

    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (targetUser.id === followerId) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }

    const stmt = db.prepare(`
      INSERT INTO follows (follower_id, following_id)
      VALUES (?, ?)
    `);

    stmt.run(followerId, targetUser.id);

    return res.json({ message: "Followed successfully" });

  } catch (error) {
    if (error.message.includes("UNIQUE")) {
      return res.status(400).json({ message: "You already follow this user" });
    }
    return res.status(500).json({ message: "Something went wrong" });
  }
};