import db from "../db.js";

export const countLikes = (req, res) => {
  const postId = req.params.id;

  try {
    const count = db
      .prepare("SELECT COUNT(*) AS total FROM likes WHERE post_id = ?")
      .get(postId);
    res.status(200).json(count);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
