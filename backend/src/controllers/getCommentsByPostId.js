import db from "../db.js";

export const getCommentsByPostId = (req, res) => {
  const { postId } = req.params;

  // Validate postId
  if (!postId || isNaN(postId)) {
    return res.status(400).json({ error: "Invalid post ID" });
  }

  try {
    const comments = db
      .prepare(
        `SELECT c.id, c.user_id, c.content, c.created_at, u.username, u.profile_picture_url
       FROM comments c
       JOIN users u ON c.user_id = u.id
       WHERE c.post_id = ? ORDER BY c.created_at DESC`
      )
      .all(postId);

    res.json(comments);
  } catch (error) {
    console.error("Failed to retrieve comments:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


// export const getCommentsByPostId = (req, res) => {
//   const { postId } = req.params;

//   if (!postId || isNaN(postId)) {
//     return res.status(400).json({ error: "Invalid post ID" });
//   }

//   try {
//     const comments = db
//       .prepare(
//         `SELECT c.id, c.user_id, c.content, c.created_at,
//                 u.username, u.profile_picture_url
//          FROM comments c
//          JOIN users u ON c.user_id = u.id
//          WHERE c.post_id = ?
//          ORDER BY c.created_at DESC`
//       )
//       .all(postId);

//     res.status(200).json({
//       comments,
//       count: comments.length,
//     });
//   } catch (error) {
//     console.error("Failed to retrieve comments:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };
