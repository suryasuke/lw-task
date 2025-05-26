import pool from '../db/db.js'

export const getApplicants = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM applicant ORDER BY id ASC');
    console.log("Applicants Fetched:", result.rows);  // ✅ Console log
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching applicants:", err);  // ✅ Error log
    res.status(500).json({ error: 'Error fetching applicants' });
  }
};

export const addApplicant = async (req, res) => {
  const { app } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO applicant (name) VALUES ($1) RETURNING *',
      [app]
    );
    console.log("Applicant Added:", result.rows[0]);  // ✅ Console log
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error adding applicant:", err);  // ✅ Error log
    res.status(500).json({ error: 'Error adding applicant' });
  }
};

export const deleteApplicant = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM applicant WHERE id = $1', [id]);
    console.log("Applicant Deleted, ID:", id);  // ✅ Console log
    res.json({ message: 'Applicant deleted' });
  } catch (err) {
    console.error("Error deleting applicant:", err);  // ✅ Error log
    res.status(500).json({ error: 'Error deleting applicant' });
  }
};
