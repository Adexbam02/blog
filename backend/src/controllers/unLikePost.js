import db from "../db.js";

export const unLikePost = (req, res) => {
  const userId = req.user?.id;
  const postId = req.params.id;

  if (!userId) {
    return res.status(401).json({ error: "Login required to unlike posts" });
  }

  try {
    db.prepare("DELETE FROM likes WHERE user_id = ? AND post_id = ?").run(
      userId,
      postId
    );
    res.status(200).json({ message: "Post unliked successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
