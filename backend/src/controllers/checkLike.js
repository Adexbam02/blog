import db from "../db.js";

export const checkLike = (req, res) => {
  const userId = req.user?.id;
  const postId = req.params.id;

  if (!userId) {
    return res.json({ liked: false });
  }

  const result = db
    .prepare("SELECT 1 FROM likes WHERE user_id = ? AND post_id = ?")
    .get(userId, postId);

  res.json({ liked: !!result });
}