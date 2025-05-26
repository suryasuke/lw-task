import axios from 'axios';

const BASE_URL = 'http://localhost:4000';



export const getApplicants = async () => {
  const response = await axios.get(`${BASE_URL}/get-Applicant`);
  console.log('response in api' , response);
  return response.data;
};

export const addApplicant = async (applicantName) => {
  const response = await axios.post(`${BASE_URL}/add-Applicant`, { app: applicantName });
  return response.data;
};

export const deleteApplicant = async (applicantId) => {

  
  const response = await axios.delete(`${BASE_URL}/delete-Applicant/${applicantId}`);
  return response.data;
};


export const deleteDocument = async ( id) =>{
  const result  = await axios.delete(`${BASE_URL}/delete-document/${id}`);
  console.log('api delete' , result)
  
}


export const getDocumentsByApplicantId = async (applicantId) => {
  const response = await axios.get(`${BASE_URL}/get-document/${applicantId}`);
  console.log('api get documents' , response.data)
  return response.data;
};

export const addDocument = async (applicantId, docName) => {
  const response = await axios.post(`${BASE_URL}/add-document`, {
    doc_name: docName,
    applicant_id: applicantId
  });

  console.log("after doc add" , response)
  return response.data;
};

export const uploadFile = async (docId, file) => {
  const formData = file;
  console.log('from api data' , formData)
  const response = await axios.post(`${BASE_URL}/upload/${docId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};
