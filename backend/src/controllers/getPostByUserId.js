import db from "../db.js";

export const getAllPostsByAuthorId = (req, res) => {
const userId = req.params.id;

  try {
    const posts = db
      .prepare("SELECT * FROM posts WHERE user_id = ?  ORDER BY created_at DESC")
      .all(userId);
    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching posts by user ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};