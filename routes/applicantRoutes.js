import express from 'express'

import * as applicantController from '../controllers/applicantController.js' ;

const router = express.Router();

router.get('/get-Applicant', applicantController.getApplicants);

router.post('/add-Applicant', applicantController.addApplicant);

router.delete('/delete-Applicant/:id', applicantController.deleteApplicant);

export default router ; 
