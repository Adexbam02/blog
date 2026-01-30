import db from "../db.js";

export const getUserProfile = (req, res) => {
  try {
    const { username } = req.params; // from JWT

    // Fetch user info
    const userQuery = db.prepare(`
      SELECT id, username, email, bio, profile_picture_url, banner_picture_url
      FROM users
      WHERE LOWER(username) = LOWER(?)
    `);
    const user = userQuery.get(username);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch posts from this user
    const postsQuery = db.prepare(`
      SELECT 
        posts.id,
        posts.slug,
        posts.title,
        posts.category,
        posts.content,
        posts.img_url,
        posts.created_at,
        COUNT(likes.id) AS like_count
      FROM posts
      LEFT JOIN likes ON posts.id = likes.post_id
      WHERE posts.user_id = ?
      GROUP BY posts.id
      ORDER BY posts.created_at DESC
    `);

    const posts = postsQuery.all(user.id);

    // Final response
    res.status(200).json({
      username: user.username,
      email: user.email,
      bio: user.bio,
      profile_picture_url: user.profile_picture_url,
      banner_picture_url: user.banner_picture_url,
      posts: posts,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
