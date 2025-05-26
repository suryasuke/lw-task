import React, { useEffect, useState } from 'react';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DangerousIcon from '@mui/icons-material/Dangerous';
import DeleteIcon from '@mui/icons-material/Delete';
import './DocuUpload.css';
import {
  getApplicants,
  addApplicant,
  deleteApplicant,
  addDocument,
  uploadFile,
  getDocumentsByApplicantId , 
  deleteDocument
} 
from '../../API/api';



export default function DocuUpload() {
  const [toggleApplicantForm, setToggleApplicantForm] = useState(false);
  const [toggleDocForm, setToggleDocForm] = useState(false);
  const [applicantName, setApplicantName] = useState('');
  const [applicants, setApplicants] = useState([]);
  
  const [clickedId, setClickedId] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [DocumentName, setdocname] = useState('');
  const [clickedDoc, setClickedDoc] = useState(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');

  function docClicked(id) {
    setClickedDoc(id);
  }

console.log('documents' , documents);

  console.log(clickedId);
  useEffect(() => {
 
    fetchApplicants();
    if (clickedId) {
      fetchDocuments(clickedId);
    }


  
}, [clickedId]);

console.log('applicants name ' , applicants)


  const fetchApplicants = async () => {
    try {
      const result = await getApplicants();
      console.log("from front-end" , result.data);
      setApplicants(result);
    } catch (error) {
      console.error("Error fetching applicants:", error);
    }
  };

  

  const fetchDocuments = async (id) => {
    if (!id) return;
    try {
    const result = await getDocumentsByApplicantId(id);
    console.log('data from frontend' , result)
     setDocuments(Array.isArray(result) ? result : []);
     console.log(result);
      setClickedId(id);
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };

  const handleInputChange = (e) => setApplicantName(e.target.value);
  const handleinpChange = (e) => setdocname(e.target.value);

  const showApplicantForm = () => setToggleApplicantForm(true);

console.log(applicantName);

  const handleAddApplicant = async () => {
    if (applicantName && applicantName.trim() !== "") {
      try {
        await addApplicant(applicantName);
        await fetchApplicants();
        setToggleApplicantForm(false);
        setApplicantName('');
      } catch (error) {
        console.error("Error adding applicant:", error);
      }
    } else {
      alert("Please fill out the applicant name");
    }
  };

  const handleAddDocument = async () => {
    if (!clickedId || !DocumentName || DocumentName.trim() === "") {
      alert("Select an applicant and enter a valid document name");
      return;
    }
    try {
      const result = await addDocument(clickedId , DocumentName)
      console.log(result);
      await fetchDocuments(clickedId);
      setToggleDocForm(false);
      setdocname('');
    } catch (error) {
      console.error("Error adding document:", error);
    }
  };

  const handleDeleteApplicant = async (id) => {
    try {
      console.log('delete applicant' , id)
      await deleteDocument(id);
      const result = await deleteApplicant(id);
      console.log(result);
      await fetchApplicants();
      if (clickedId === id) {
        setDocuments([]);
        setClickedId(null);
      }
    } catch (error) {
      console.error("Error deleting applicant:", error);
    }
  };

 const handleNext = async () => {
  if (applicants.length === 0) return;

  let currentAppIndex = applicants.findIndex(app => app.id === clickedId);
  if (currentAppIndex === -1) currentAppIndex = 0;

  const currentDocs = documents;
  let currentDocIndex = currentDocs.findIndex(doc => doc.id === clickedDoc);

  if (currentDocs.length > 0 && currentDocIndex < currentDocs.length - 1) {
   
    setClickedDoc(currentDocs[currentDocIndex + 1].id);
  } else {
   
    const nextAppIndex = (currentAppIndex + 1) % applicants.length;
    const nextAppId = applicants[nextAppIndex].id;

    const result = await getDocumentsByApplicantId(nextAppId);
    const nextDocs = Array.isArray(result.data) ? result.data : [];

    setClickedId(nextAppId);
    setDocuments(nextDocs);
    setClickedDoc(nextDocs.length > 0 ? nextDocs[0].id : null);
  }
};

const handleBack = async () => {
  if (applicants.length === 0) return;

  let currentAppIndex = applicants.findIndex(app => app.id === clickedId);
  if (currentAppIndex === -1) currentAppIndex = 0;

  const currentDocs = documents;
  let currentDocIndex = currentDocs.findIndex(doc => doc.id === clickedDoc);

  if (currentDocs.length > 0 && currentDocIndex > 0) {
    
    setClickedDoc(currentDocs[currentDocIndex - 1].id);
  } else {
    
    const prevAppIndex = (currentAppIndex - 1 + applicants.length) % applicants.length;
    const prevAppId = applicants[prevAppIndex].id;

    const result = await getDocumentsByApplicantId(prevAppId)
    const prevDocs = Array.isArray(result.data) ? result.data : [];

    setClickedId(prevAppId);
    setDocuments(prevDocs);
    setClickedDoc(prevDocs.length > 0 ? prevDocs[prevDocs.length - 1].id : null);
  }
};




  return (
    <>
      {toggleApplicantForm && (
        <div className='appAdd'>
          <div className='addAppcls'>
            <h3>Add Applicant</h3>
            <DangerousIcon className='CancelIcon' onClick={() => setToggleApplicantForm(false)} />
          </div>
          <input
            type='text'
            placeholder='Enter applicant name'
            onChange={handleInputChange}
            value={applicantName}
          />
          <button onClick={handleAddApplicant}>Add</button>
        </div>
      )}

      {toggleDocForm && (
        <div className='appAdd'>
          <div className='addAppcls'>
            <h3>Add document</h3>
            <DangerousIcon
              className='CancelIcon'
              onClick={() => setToggleDocForm(prev => !prev)}
            />
          </div>
          <input
            type='text'
            placeholder='Enter document name'
            onChange={handleinpChange}
            value={DocumentName}
          />
          <button onClick={handleAddDocument}>Add</button>
        </div>
      )}

      <div className={toggleApplicantForm ? 'geted' : ''}>
        <div className='header'>
          <h1>Document Upload</h1>
          <button onClick={showApplicantForm}>
            <AddCircleOutlineIcon /> Add Applicant
          </button>
        </div>
        <hr style={{ color: 'gray' }} />
      </div>

      <div className="list-app">
        {applicants?.map(app => (
          <div
            key={app.id}
            className="list-val"
           
          
            onClick={() => fetchDocuments(app.id)}
          >
            <div className="list">
              <p className="app-loc">
                {app.name}
                <span>
                  <DeleteIcon
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteApplicant(app.id);
                    }}
                    style={{ fontSize: '20px' }}
                  />
                </span>
              </p>
              <hr
                className="hover-line"
                style={{ display: clickedId === app.id ? 'block' : 'none' }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className='total'>
        <div className='documents'>
          {documents && documents.length > 0 ? (
            documents.map((doc) => (
              <div
                key={doc.id}
                className={`doc-item ${clickedDoc === doc.id ? 'doc-items' : ""}`}
                onClick={() => docClicked(doc.id)}
              >
                <p>{doc.doc_name}</p>
              </div>
            ))
          ) : (
            <p>No documents found</p>
          )}

          {clickedId && (
            <button
              onClick={() => setToggleDocForm(prev => !prev)}
              className='btnad'
            >
              Add Document
            </button>
          )}
        </div>

        {documents.length > 0 && clickedDoc !== null && (
          <div className='uploads'>
            <div className='upload-header'>
              <input
                type='file'
                id='fileInput'
                style={{ display: 'none' }}
                onChange={(e) => {
                  setSelectedFile(e.target.files[0]);
                  setUploadStatus('');
                }}
              />
              <label htmlFor='fileInput' className='choose-btn'>+ Choose</label>
              <button
                className='upload-btn'
                onClick={async () => {
                  if (!selectedFile) {
                    alert("Please select a file");
                    return;
                  }

                  const formData = new FormData();
                  formData.append('file', selectedFile);
                  
console.log("frontend formdata" , formData);
                  try {
                   await uploadFile(clickedDoc , formData)
                    setUploadStatus('Completed');
                    alert("File uploaded successfully");
                  } catch (error) {
                    console.error("Upload error:", error);
                    setUploadStatus('Failed');
                  }
                }}
              >
                ⬆ Upload
              </button>
              <button
                className='cancel-btn'
                onClick={() => {
                  setSelectedFile(null);
                  setUploadStatus('');
                }}
              >
                ✖ Cancel
              </button>
            </div>

            {selectedFile && (
              <div className='upload-list'>
                <div className='upload-item'>
                  {selectedFile.type.startsWith('image/') ? (
                    <img
                      src={URL.createObjectURL(selectedFile)}
                      alt='preview'
                      className='upload-thumb'
                    />
                  ) : (
                    <div className='file-icon-preview'>
                      📄 {selectedFile.name}
                    </div>
                  )}
                  <div className='upload-info'>
                    <p className='file-name'>{selectedFile.name}</p>
                    <span className='file-size'>{(selectedFile.size / 1024).toFixed(2)} KB</span>
                    <span className={`file-status ${uploadStatus.toLowerCase()}`}>
                      {uploadStatus || 'Pending'}
                    </span>
                  </div>
                  <div className='upload-action'>
                    <span
                      className='delete-icon'
                      onClick={() => {
                        setSelectedFile(null);
                        setUploadStatus('');
                      }}
                    >
                      ❌
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className='next-back'>
        <button style={{ marginTop: '40px' }} onClick={handleBack}>← Back</button>
        <button style={{ marginTop: '40px' }} onClick={handleNext}>Next →</button>
      </div>
    </>
  );
}
