import db from "../db.js";

export const deletePost = (req, res) => {
  const postId = req.params.id; // Get the post ID from the URL
  const userId = req.user?.userId; // Get the logged-in user's ID from the token

    console.log("Delete Post Request:", { postId, userId });

  try {
    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    // Find the post in the database to check who owns it
    const post = db
      .prepare("SELECT user_id FROM posts WHERE id = ?")
      .get(postId);

    // Handle cases where the post doesn't exist
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Authorization Check: Is this user the owner of the post?
    if (post.user_id !== userId) {
      return res.status(403).json({
        error: "Forbidden: You are not authorized to delete this post",
      });
    }

    // If all checks pass, delete the post
    db.prepare("DELETE FROM posts WHERE id = ? AND user_id = ?").run(
      postId,
      userId
    );

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
