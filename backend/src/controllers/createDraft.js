import db from "../db.js";

// export const draftedPost = (req, res) => {
//   const { authorId } = req.body;

//   const stmt = db.prepare(`
//     INSERT INTO posts (author_id, status)
//     VALUES (?, 'draft')
//   `);

//   const result = stmt.run(authorId);

//   res.json({ postId: result.lastInsertRowid });
// };

export const createDraft = (req, res) => {
  const { authorId } = req.body;

  const stmt = db.prepare(`
    INSERT INTO posts (author_id, status, title, content, created_at)
    VALUES (?, 'draft', '', '', datetime('now'))
    `);

  const result = stmt.run(authorId);

  res.json({ postId: result.lastInsertRowid });
};
