import db from "../db.js";

export const getUserTotalViews = (req, res) => {
  const { userId  } = req.params;
  

  try {
    const row = db
      .prepare(`
        SELECT COUNT(pv.id) AS total_views
        FROM posts p
        JOIN post_views pv ON pv.post_id = p.id
        WHERE p.user_id = ?
      `)
      .get(userId);

    res.status(200).json({ totalViews: row?.total_views ?? 0 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
