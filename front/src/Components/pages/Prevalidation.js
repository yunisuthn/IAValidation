import React, { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckSquare, faLock } from '@fortawesome/free-solid-svg-icons'
import fileService from '../services/fileService';
import DocumentsTable from '../others/DocumentsTable';
import useSocket from '../../hooks/useSocket';


// Hook pour gérer les fichiers (Single Responsibility)
function useFileUpload() {
  const [files, setFiles] = useState([])
  const [uploadedFiles, setUploadFiles] = useState([])
  const { socket, isConnected} = useSocket();

  useEffect(()=>{

    if (!socket) return;

    fileService.fetchPrevalidations()
      .then(data => {
        setUploadFiles(data);
        console.log(data)
      } )
      .catch(error=>console.error("Erreur lors de la récupération des fichiers:", error))
  
    // Écouter les événements de verrouillage et de déverrouillage des fichiers
    socket.on("file-locked", ({id, isLocked})=>{
      setUploadFiles(prevLockedFiles => 
        prevLockedFiles.map(file => 
          file._id === id ? {...file, isLocked} : file
        )
      )
      
    })

    socket.on("file-unlocked", ({id, isLocked})=>{
      setUploadFiles(prevLockedFiles => 
        prevLockedFiles.map(file => 
          file._id === id ? {...file, isLocked} : file));
    })

    return () =>{
      socket.off("file-locked")
      socket.off("file-unlocked")
    }

  }, [socket]);

  const handleDrop = useCallback((acceptedFiles)=>{
    const validFiles =  acceptedFiles.filter(file=>file.type === "application/pdf" || file.type === "text/xml")

    setFiles(prevFiles=>[...prevFiles, ...validFiles])
    
    validFiles.forEach(file=>{
      fileService.uploadFile(file)
        .then(res => setUploadFiles(prevFiles => [...prevFiles, res.data]))
        .catch(error => console.error("Erreur lors de l'upload:", error))
    })
  }, [])

  // console.log("files, uploadedFiles,lockedFiles, ",  uploadedFiles,handleDrop );
  
  return { uploadedFiles, handleDrop}
}

function PreValidation() {

  const {t} = useTranslation()
  const { uploadedFiles, handleDrop } = useFileUpload();  // Gestion des fichiers centralisée

  return (
    <div className="flex flex-col items-start h-full w-full flex-grow">
      <div className='w-full overflow-x-auto h-full'>
        <DocumentsTable data={uploadedFiles} version='v1' />
      </div>
    </div>
  );
}

export default PreValidation;