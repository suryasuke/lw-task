import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import multer from 'multer'

import applicantRoutes from './routes/applicantRoutes.js';
import documentRoutes from './routes/documentRoutes.js';

dotenv.config();

const app = express();
const port =  4000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


app.use(cors({
  origin: 'http://localhost:5434', 
  credentials: true,
}));
app.use(bodyParser.json());
app.use(express.json());

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.use('/' , applicantRoutes);
app.use('/' , documentRoutes);

app.listen(port, () => {
  console.log(`✅ Server is running on http://localhost:${port}`);
});
