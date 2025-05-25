import bodyParser from 'body-parser';
import pg from 'pg';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

dotenv.config();

const app = express();
const port = 4000;


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


app.use(cors({
  origin: 'http://localhost:5434', //cors permisions
  credentials: true,
}));

app.use(bodyParser.json());
app.use(express.json());

const db = new pg.Client({
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: 5432,
});

db.connect()
  .then(() => console.log("Connected to PostgreSQL"))
  .catch(err => console.error("Error connecting to PostgreSQL:", err));


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'uploads')); 
  },
  filename: function (req, file, cb) {
   
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.post("/add-Applicant", async (req, res) => {
  const { app } = req.body;
  try {
    const result = await db.query("INSERT INTO applicant (name) VALUES ($1) RETURNING *", [app]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error adding applicant" });
  }
});


app.post("/add-document", async (req, res) => {
  const { applicant_id, doc_name } = req.body;
  try {
    const result = await db.query(
      "INSERT INTO documents (doc_name, applicant_id) VALUES ($1, $2) RETURNING *",
      [doc_name, applicant_id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error adding document" });
  }
});

app.post('/upload/:docId', upload.single('file'), async (req, res) => {
  const docId = req.params.docId;

  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    const filePath = `uploads/${req.file.filename}`; 
   

    await db.query(
      'UPDATE documents SET file_path = $1 WHERE id = $2',
      [filePath ,  docId]
    );

    res.json({ message: 'File uploaded successfully', filePath });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error while saving file info' });
  }
});


app.get("/get-document/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query("SELECT * FROM documents WHERE applicant_id = $1", [id]);
    if (result.rows.length !== 0) {
      res.json(result.rows);
    } else {
      res.json({ message: "No documents available" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error fetching documents" });
  }
});


app.delete("/delete-Applicant/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const doc = await db.query("SELECT * FROM documents WHERE applicant_id = $1", [id]);

    if (doc.rows.length > 0) {
      
      await db.query("DELETE FROM documents WHERE applicant_id = $1", [id]); //deleting the FK values using this <-----
    }

    const result = await db.query("DELETE FROM applicant WHERE id = $1 RETURNING *", [id]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error deleting applicant" });
  }
});


app.get("/get-Applicant", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM applicant");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error fetching applicants" });
  }
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
