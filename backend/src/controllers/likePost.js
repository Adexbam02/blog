import db from "../db.js";

export const likePost = (req, res) => {
const userId = req.user?.id || 1;
  const postId = req.params.id;

   console.log("🧠 Like request:", { userId, postId });

  if (!userId) {
    return res.status(401).json({ error: "Login required to like posts" });
  }

  try {
    // Check if already liked
    const alreadyLiked = db
      .prepare("SELECT 1 FROM likes WHERE user_id = ? AND post_id = ?")
      .get(userId, postId);

    if (alreadyLiked) {
      return res.status(400).json({ message: "You already liked this post" });
    }

    // Insert like
    db.prepare("INSERT INTO likes (user_id, post_id) VALUES (?, ?)").run(
      userId,
      postId
    );

    res.status(200).json({ message: "Post liked successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
