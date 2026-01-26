import db from "../db.js";

export const draftedPost = (req, res) => {
  const { authorId } = req.body;

  const stmt = db.prepare(`
    INSERT INTO posts (author_id, status)
    VALUES (?, 'draft')
  `);

  const result = stmt.run(authorId);

  res.json({ postId: result.lastInsertRowid });
};
