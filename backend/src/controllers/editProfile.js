import db from "../db.js";

export const editProfile = (req, res) => {
  const { username } = req.user; // assuming you use JWT auth middleware
  const {
    username: newUsername,
    bio,
    email,
    profile_picture_url,
    banner_picture_url,
  } = req.body;

  try {
    const query = db.prepare(`
      UPDATE users 
      SET username = ?, bio = ?, email = ?, profile_picture_url = ?, banner_picture_url = ?
      WHERE username = ?
    `);
    const result = query.run(
      newUsername,
      bio,
      email,
      profile_picture_url,
      banner_picture_url,
      username,
    );

    if (result.changes === 0)
      return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
