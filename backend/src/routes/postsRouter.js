import express from "express";
import db from "../db.js";
import authenticateToken from "../middleware/authenticateToken.js";

const router = express.Router();


router.post(`/`, (req, res) => {
  const { title, content, author, img_url } = req.body;

  console.log("Received body:", req.body);

  try {
    if (!title || !content || !author || !img_url) {
      return res.status(400).json({ error: "All fields are required" });
    }


    db.prepare(
      "INSERT INTO posts (title, content, author, img_url) VALUES (?, ?, ?, ?)"
    ).run(title, content, author, img_url);

    console.log("New post saved:", { title, content, author, img_url });
    res.status(201).json({ message: "Post created successfully" });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/", (req, res) => {
  try {
    const posts = db
      .prepare("SELECT * FROM posts ORDER BY created_at DESC")
      .all();
    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/:author/:slug", (req, res) => {
  const { author, slug } = req.params;
  try {
    // Use .get() for a single row
    const post = db
      .prepare("SELECT * FROM posts WHERE author = ? AND slug = ? LIMIT 1")
      .get(author, slug);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json(post);
  } catch (err) {
    console.error("Error fetching post:", err);
    res.status(500).json({ error: "Error fetching post" });
  }
});

export default router;
