import db from "../db.js";

const createSlug = (title) => {
  const baseSlug = title
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
  return baseSlug;
};

export const editPost = (req, res) => {
  const { postId } = req.params;
  const { title, content, author, category, img_url } = req.body;
  const userId = req.user?.userId;

//   console.log("User ID:", req.user?.userId);
//   console.log("Decoded token:", req.user);

  try {
    // Get existing post
    const existing = db
      .prepare("SELECT title FROM posts WHERE id = ? AND user_id = ?")
      .get(postId, userId);

    if (!existing) {
      return res
        .status(404)
        .json({ error: "Post not found or not authorized" });
    }

    // If title changed, regenerate slug
    const slug =
      title && title !== existing.title ? createSlug(title) : undefined;

    // Update SQL
    const stmt = db
      .prepare(
        `
      UPDATE posts SET
        title = COALESCE(?, title),
        content = COALESCE(?, content),
        author = COALESCE(?, author),
        category = COALESCE(?, category),
        img_url = COALESCE(?, img_url),
        slug = COALESCE(?, slug)
      WHERE id = ? AND user_id = ?
    `
      )
      .run(
        title || null,
        content || null,
        author || null,
        category || null,
        img_url || null,
        slug || null,
        postId,
        userId
      );

    res.json({ message: "Post updated successfully" });
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
