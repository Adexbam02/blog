import db from "../db.js";

// export const getUserFollowerGrowth = (req, res) => {
//   try {
//     const { username } = req.params;

//     const user = db
//       .prepare(
//         `
//         SELECT id, username
//         FROM users
//         WHERE LOWER(username) = LOWER(?)
//       `
//       )
//       .get(username);

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const totalFollowers = db
//       .prepare(
//         `
//         SELECT COUNT(*) AS count
//         FROM follows
//         WHERE following_id = ?
//       `
//       )
//       .get(user.id).count;

//     const followersGrowthLast30Minutes = db
//       .prepare(
//         `
//         SELECT COUNT(*) AS count
//         FROM follows
//         WHERE following_id = ?
//           AND created_at >= datetime('now', '-30 minutes')
//       `
//       )
//       .get(user.id).count;

//     const previousFollowers = totalFollowers - followersGrowthLast30Minutes;

//     let followersGrowthPercentage = 0;

//     if (previousFollowers > 0) {
//       followersGrowthPercentage =
//         (followersGrowthLast30Minutes / previousFollowers) * 100;
//     }

//     res.status(200).json({
//       id: user.id,
//       username: user.username,
//       followers: totalFollowers,
//       followersGrowthLast30Minutes,
//       followersGrowthPercentage: Number(followersGrowthPercentage.toFixed(2)),
//     });
//   } catch (error) {
//     console.error("Error fetching follower growth:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

    export const getUserFollowerGrowth = (req, res) => {
    try {
        const { username } = req.params;

        const user = db
        .prepare(
            `
            SELECT id, username
            FROM users
            WHERE LOWER(username) = LOWER(?)
        `
        )
        .get(username);

        if (!user) {
        return res.status(404).json({ message: "User not found" });
        }

        const totalFollowers = db
        .prepare(
            `
            SELECT COUNT(*) AS count
            FROM follows
            WHERE following_id = ?
        `
        )
        .get(user.id).count;

        const followersGainedLast30Minutes = db
        .prepare(
            `
            SELECT COUNT(*) AS count
            FROM follows
            WHERE following_id = ?
            AND created_at >= datetime('now', '-30 minutes')
            `
        )
        .get(user.id).count;

        const followersLostLast30Minutes = db

        .prepare(
            `
            SELECT COUNT(*) AS count
            FROM unfollows
            WHERE following_id = ?
            AND unfollowed_at >= datetime('now', '-30 minutes')
            `
        )
        .get(user.id).count;

        const netFollowersChange =
        followersGainedLast30Minutes - followersLostLast30Minutes;

        const previousFollowers =
        totalFollowers - followersGainedLast30Minutes + followersLostLast30Minutes;

        let followersGrowthPercentage = 0;

        if (previousFollowers > 0) {
        followersGrowthPercentage =
            (netFollowersChange / previousFollowers) * 100;
        }

        let followersLostPercentage = 0;

        if (previousFollowers > 0) {
        followersLostPercentage =
            (followersLostLast30Minutes / previousFollowers) * 100;
        }

        res.status(200).json({
        id: user.id,
        username: user.username,
        followers: totalFollowers,
        followersGainedLast30Minutes,
        followersLostLast30Minutes,
        netFollowersChange,
        followersGrowthPercentage: Number(followersGrowthPercentage.toFixed(2)),
        followersLostPercentage: Number(followersLostPercentage.toFixed(2)),
        });
    } catch (error) {
        console.error("Error fetching follower growth:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
