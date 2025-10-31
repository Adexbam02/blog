import db from "../db.js";

export const getAllPosts = (req, res) => {
  try {
    const posts = db
      .prepare("SELECT * FROM posts ORDER BY created_at DESC")
      .all();
    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
