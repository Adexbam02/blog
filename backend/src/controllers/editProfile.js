// import db from "../db.js";

// export const editProfile = (req, res) => {
//   const { username } = req.user; // assuming you use JWT auth middleware
//   const {
//     username: newUsername,
//     bio,
//     email,
//     profile_picture_url,
//     banner_picture_url,
//   } = req.body;

//   try {
//     const query = db.prepare(`
//       UPDATE users 
//       SET username = ?, bio = ?, email = ?, profile_picture_url = ?, banner_picture_url = ?
//       WHERE username = ?
//     `);
//     const result = query.run(
//       newUsername,
//       bio,
//       email,
//       profile_picture_url,
//       banner_picture_url,
//       username,
//     );

//     if (result.changes === 0)
//       return res.status(404).json({ message: "User not found" });

//     res.status(200).json({ message: "Profile updated successfully" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };


// import db from "../db.js";

// export const editProfile = (req, res) => {
//   const { username } = req.user;
//   const {
//     username: newUsername,
//     bio,
//     email,
//     profile_picture_url,
//     banner_picture_url,
//   } = req.body;

//   try {
//     // Build dynamic query based on what's provided
//     const updates = [];
//     const params = [];

//     if (newUsername !== undefined) {
//       updates.push('username = ?');
//       params.push(newUsername);
//     }
//     if (bio !== undefined) {
//       updates.push('bio = ?');
//       params.push(bio);
//     }
//     if (email !== undefined) {
//       updates.push('email = ?');
//       params.push(email);
//     }
//     if (profile_picture_url !== undefined) {
//       updates.push('profile_picture_url = ?');
//       params.push(profile_picture_url);
//     }
//     if (banner_picture_url !== undefined) {
//       updates.push('banner_picture_url = ?');
//       params.push(banner_picture_url);
//     }

//     if (updates.length === 0) {
//       return res.status(400).json({ message: "No fields to update" });
//     }

//     params.push(username); // Add WHERE parameter last

//     const query = db.prepare(`
//       UPDATE users 
//       SET ${updates.join(', ')}
//       WHERE username = ?
//     `);
    
//     const result = query.run(...params);

//     if (result.changes === 0)
//       return res.status(404).json({ message: "User not found" });

//     res.status(200).json({ message: "Profile updated successfully" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };


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
      bio ?? null,  // Convert undefined to null
      email,
      profile_picture_url ?? null,  // Convert undefined to null
      banner_picture_url ?? null,   // Convert undefined to null
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