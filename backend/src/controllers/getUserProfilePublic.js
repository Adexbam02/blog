import db from "../db.js";

export const getUserProfilePublic = (req, res) => {
  try {
    const { username } = req.params;

    // Fetch user
    const user = db.prepare(`
      SELECT id, username, email, bio, profile_picture_url, banner_picture_url
      FROM users
      WHERE LOWER(username) = LOWER(?)
    `).get(username);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Count followers
    const followers = db.prepare(`
      SELECT COUNT(*) AS count
      FROM follows
      WHERE following_id = ?
    `).get(user.id).count;

    // Count following
    const following = db.prepare(`
      SELECT COUNT(*) AS count
      FROM follows
      WHERE follower_id = ?
    `).get(user.id).count;

    // Check if the requester is following this user
    let isFollowing = false;

    if (req.user && req.user.id) {
      const followCheck = db.prepare(`
        SELECT 1 FROM follows
        WHERE follower_id = ? AND following_id = ?
      `).get(req.user.id, user.id);

      isFollowing = !!followCheck;
    }

    // Return public profile plus stats
    res.status(200).json({
      username: user.username,
      email: user.email,
      bio: user.bio,
      profile_picture_url: user.profile_picture_url,
      banner_picture_url: user.banner_picture_url,
      followers,
      following,
      isFollowing
    });

  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
