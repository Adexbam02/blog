import db from "../db.js";

export const getPostBySlug = (req, res) => {
  const { author, slug } = req.params;

  try {
    const post = db
      .prepare(
        `SELECT * FROM posts WHERE LOWER(author)  = ? AND LOWER(slug) = ?`
      )
      .get(author.toLowerCase(), slug.toLowerCase());

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
