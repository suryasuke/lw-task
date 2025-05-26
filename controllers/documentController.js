import pool from '../db/db.js'

export const getDocuments = async (req, res) => {
  const { applicantId } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM documents WHERE applicant_id = $1 ORDER BY id ASC',
      [applicantId]
    );
    console.log('api id' , result.rows);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching documents' });
  }
};

export const addDocument = async (req, res) => {
  const { applicant_id, doc_name } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO documents (applicant_id, doc_name) VALUES ($1, $2) RETURNING *',
      [applicant_id, doc_name]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error adding document' });
  }
};

export const deleteDocument = async (req,res)=>{
  const { id } = req.params; 
  console.log('this to be delete' , id)
  try {
    const result = await pool.query(
      'DELETE FROM documents WHERE applicant_id =$1',[id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error adding document' });
  }
}

export const uploadFile = async (req, res) => {
  const { docId } = req.params;
  console.log(req.file)

  console.log('here to upload' , docId);
  const filePath = req.file ? req.file.path : null;

  if (!filePath) {
    return res.status(400).json({ error: 'File not uploaded' });
  }

  try {
    await pool.query(
      'UPDATE documents SET file_path = $1 WHERE id = $2',
      [filePath, docId]
    );
    res.json({ message: 'File uploaded', path: filePath });
  } catch (err) {
    res.status(500).json({ error: 'Error uploading file' });
  }
};
