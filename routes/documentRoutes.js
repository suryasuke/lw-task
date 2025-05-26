import express from 'express'
import multer from 'multer'
import * as documentController from '../controllers/documentController.js';
const router = express.Router();




const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

console.log('upload' , upload);


router.get('/get-document/:applicantId', documentController.getDocuments);
router.post('/add-document', documentController.addDocument);
router.post('/upload/:docId', upload.single('file'), documentController.uploadFile);
router.delete('/delete-document/:id' , documentController.deleteDocument);

export default router ; 
