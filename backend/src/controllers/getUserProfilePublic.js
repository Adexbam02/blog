import db from "../db.js";

export const getUserProfilePublic = (req, res) => {
  try {
    const { username } = req.params; // from URL params
    const query = db.prepare(`
      SELECT username, email, bio, profile_picture_url
      FROM users
    WHERE LOWER(username) = LOWER(?)
    `);

    const user = query.get(username);

    console.log("Fetched user profile:", user);

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
    
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
