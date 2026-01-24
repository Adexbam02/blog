// import db from "../db.js";
// import { getUserViewGrowthToday } from "../services/getUserViewGrowthToday.js";

// export const getUserViewGrowthToday = (req, res) => {
//   const { userId  } = req.params;

//   if (!userId) {
//     return res.status(400).json({ error: "Invalid userId" });
//   }

//   try {
//     const stats = getUserViewGrowthToday(userId);
//     res.status(200).json(stats);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

import db from "../db.js";

export const getUserTotalViewsInLastOneHr = (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ error: "Invalid userId" });
  }

  try {
    const row = db
      .prepare(
        `
      SELECT COUNT(pv.id) AS total_views_last_oneHr
      FROM posts p
      JOIN post_views pv ON pv.post_id = p.id
      WHERE p.user_id = ?
        AND pv.viewed_at >= datetime('now', '-30 minutes')
    `
      )
      .get(userId);

    res.status(200).json({
      totalViewsInLastOneHr: row?.total_views_last_oneHr ?? 0,
    });
  } catch (err) {
    console.error("Error getting views in last hour:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
