import db from "../db.js";

export const mostLike = (req, res) => {
  try {
    const posts = db
      .prepare(
        "SELECT posts.id,posts.slug,posts.title,posts.category,posts.author,  users.profile_picture_url,  posts.created_at,posts.img_url,COUNT(likes.id) AS like_count FROM posts LEFT JOIN likes ON posts.id = likes.post_id LEFT JOIN users ON posts.user_id = users.id GROUP BY posts.id ORDER BY like_count DESC, posts.created_at DESC;"
      )
      .all();

    res.json(posts);
  } catch (error) {
    console.error("Error fetching most liked posts:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
