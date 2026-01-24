import db from "../db.js";

// export const postView = async (req, res) => {
//   const { postId } = req.params;
//   const userId = req.user?.userId || null;
//   const visitorId = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;

//   try {
//     // Check if this user/visitor already viewed this post recently (within last 24 hours)
//     const recentView = db
//       .prepare(`
//         SELECT id FROM post_views
//         WHERE post_id = ?
//         AND (user_id = ? OR visitor_id = ?)
//         AND viewed_at > datetime('now', '-24 hours')
//       `)
//       .get(postId, userId, visitorId);

//     if (recentView) {
//       return res.status(200).json({ message: "View already recorded" });
//     }

//     db.prepare(`
//       INSERT INTO post_views (post_id, user_id, visitor_id)
//       VALUES (?, ?, ?)
//     `).run(postId, userId, visitorId);

//     res.status(201).json({ message: "View recorded successfully" });
//   } catch (error) {
//     console.error("Error recording view:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

export const postView = async (req, res) => {
  const { postId } = req.params;
  const userId = req.user?.userId ?? null;
  const visitorId = req.body?.visitorId ?? null;

  console.log("req.user:", req.user);

  if (!userId && !visitorId) {
    return res.status(400).json({ error: "Missing viewer identity" });
  }

  try {
    let existing;

    if (userId) {
      existing = db
        .prepare(
          `
        SELECT 1 FROM post_views
        WHERE post_id = ?
        AND user_id = ?
        AND viewed_at > datetime('now', '-2 minutes')
      `
        )
        .get(postId, userId);
    } else {
      existing = db
        .prepare(
          `
        SELECT 1 FROM post_views
        WHERE post_id = ?
        AND visitor_id = ?
        AND viewed_at > datetime('now', '-24 hours')
      `
        )
        .get(postId, visitorId);
    }

    if (existing) {
      return res.json({ message: "View already recorded" });
    }

    db.prepare(
      `
      INSERT INTO post_views (post_id, user_id, visitor_id)
      VALUES (?, ?, ?)
    `
    ).run(postId, userId, visitorId);

    res.status(201).json({ message: "View recorded" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
