import db from "../db.js";

export const getViewCount = async (req, res) => {
  const { postId } = req.params;

  try {
    const result = db
      .prepare(`SELECT COUNT(*) as count FROM post_views WHERE post_id = ?`)
      .get(postId);

    res.status(200).json({ views: result.count });
  } catch (error) {
    console.error("Error getting view count:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
