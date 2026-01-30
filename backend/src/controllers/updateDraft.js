import db from "../db.js";

export const updateDraft = (req, res) => {
  const { postId } = req.params;
  const { title, content } = req.body;

  const stmt = db.prepare(`
    UPDATE posts 
    SET title = ?, content = ?, updated_at = datetime('now')
    WHERE id = ? AND status = 'draft'
  `);

  stmt.run(title, content, postId);

  res.json({ success: true });
};