import db from "../db.js";

const createSlug = (title) => {
  const baseSlug = title
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
  return baseSlug;
};

export const createPost = (req, res) => {
  // ... your existing code for creating a post
  const { title, content, author, category, img_url } = req.body;
  const userId = req.user?.userId;
  const slug = createSlug(title);

  try {
    if (!title || !content || !author || !category || !img_url) {
      return res.status(400).json({ error: "All fields are required" });
    }
    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }
    db.prepare(
      "INSERT INTO posts (user_id, title, content, author, category, img_url, slug) VALUES (?, ?, ?, ?, ?, ?, ?)"
    ).run(userId, title, content, author, category, img_url, slug);

    res.status(201).json({ message: "Post created successfully" });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
