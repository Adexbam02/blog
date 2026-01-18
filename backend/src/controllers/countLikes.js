import db from "../db.js";

// GET TOTAL LIKES FOR A POST
export const countLikes = (req, res) => {
  try {
    const { postId, slug } = req.params;

    let post;
    if (postId) {
      post = db.prepare("SELECT id FROM posts WHERE id = ?").get(postId);
    } else if (slug) {
      post = db.prepare("SELECT id FROM posts WHERE slug = ?").get(slug);
    }

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const result = db
      .prepare("SELECT COUNT(*) AS total FROM likes WHERE post_id = ?")
      .get(post.id);

    return res.json({ total: result.total || 0 });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};
