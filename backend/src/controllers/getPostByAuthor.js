import db from "../db.js";

export const getAllPostsByAuthor = (req, res) => {
const { author } = req.params;

  try {
    const posts = db
      .prepare("SELECT * FROM posts WHERE author = ? COLLATE NOCASE ORDER BY created_at DESC")
      .all(author);
    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching posts by author:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};