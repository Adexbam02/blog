import db from "../db.js";

export const getFollowingStatus = (req, res) => {
  try {
    const { username } = req.params;
    const followerId = req.user.userId;

    const targetUser = db
      .prepare("SELECT id FROM users WHERE username = ?")
      .get(username);
    if (!targetUser) return res.status(404).json({ message: "User not found" });

    const follow = db
      .prepare(
        "SELECT 1 FROM follows WHERE follower_id = ? AND following_id = ?"
      )
      .get(followerId, targetUser.id);

    res.json({ isFollowing: !!follow });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
