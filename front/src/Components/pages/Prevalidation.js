import React, { useEffect, useState } from 'react';
import fileService from '../services/fileService';
import { useOnLockedAndUnlockedDocument } from '../../hooks/useSocket';
import { useNavigate } from 'react-router-dom';
import PrevalidationTable from '../others/tables/PrevalidationTable';


// Hook pour gérer les fichiers (Single Responsibility)
function useFileUpload() {
  const [uploadedFiles, setUploadFiles] = useState([])
  const [isLoading, setLoading] = useState(true)
  const navigate = useNavigate(); 
  
  // listen event
  useOnLockedAndUnlockedDocument(({ id, ...data }) => {
    setUploadFiles(prev => prev.map(file =>
      file._id === id ? { ...file, ...data } : file));
  });

  useEffect(()=>{
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    console.log("storedUser", token);
    console.log("storedUser", storedUser)
    
    if (!storedUser && !token) {
      navigate('/')
    }
  }, [])

  useEffect(()=>{

    setLoading(true);

    fileService.fetchPrevalidations()
      .then(data => {
        setUploadFiles(data);
      } )
      .catch(error=>console.error("Erreur lors de la récupération des fichiers:", error))
      .finally(() => setLoading(false))

    return () =>{
      
    }

  }, []);

  // console.log("files, uploadedFiles,lockedFiles, ",  uploadedFiles,handleDrop );
  
  return { uploadedFiles, isLoading}
}

function PreValidation() {

  const { uploadedFiles, isLoading } = useFileUpload();  // Gestion des fichiers centralisée

  return (
    <div className="flex flex-col items-start h-full w-full flex-grow">
      <div className='w-full overflow-x-auto h-full'>
        <PrevalidationTable data={uploadedFiles} version='v1' loading={isLoading} />
      </div>
    </div>
  );
}

export default PreValidation;