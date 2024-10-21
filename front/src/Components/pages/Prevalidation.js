import React, { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckSquare, faLock } from '@fortawesome/free-solid-svg-icons'
import io from 'socket.io-client' // Importer socket.io-client
import fileService from '../services/fileService';

// URL du serveur Socket.io
const socket = io("http://localhost:5000")

// Hook pour gérer les fichiers (Single Responsibility)
function useFileUpload() {
  const [files, setFiles] = useState([])
  const [uploadedFiles, setUploadFiles] = useState([])
  
  useEffect(()=>{
    fileService.fetchFiles()
      .then(data => setUploadFiles(data) )
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

  }, [])

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


const handleClick = (id) => {    
  socket.emit('lock-file', id); // Notifier le serveur que cet élément est verrouillé
};

// Composant pour la table des fichiers (Single Responsibility)
function FileTable({files}) {
  const {t} = useTranslation()

  return (
    <table className='min-w-full border-collapse border border-gray-400'>
      <thead>
        <tr>
          <th className='border border-gray-300 px-4 py-2'></th>
          <th className='border border-gray-300 px-4 py-2'  >{t('nom-fichier')}</th>
        </tr>
      </thead>
      <tbody>
        {files.length === 0 ? (
          <tr>
            <td className='border border-gray-300 px-4 py-2 text-center' colSpan="1">
              {t('aucun-fichier')}
            </td>
          </tr>
        ):(
          files.map((file, index)=>(
            
            <tr key={index}>
              <td className='border border-gray-300 px-4 py-2'>
                {file.isLocked ?  (
                  <FontAwesomeIcon icon={faLock} />
                ) : <FontAwesomeIcon icon={faCheckSquare} />}
              </td>
              <td className='border border-gray-300 px-4 py-2'>
                {
                  file.isLocked ? (
                   <span>{file.name} ({t('verouiller')})</span> 
                  ) : 
                <Link to={'/document/v1/' + file._id}
                onClick={()=> handleClick(file._id)}>{file.name}</Link>
                }
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  )
}

function PreValidation() {

  const {t} = useTranslation()
  const { uploadedFiles, handleDrop } = useFileUpload();  // Gestion des fichiers centralisée

  return (
    <div className="flex flex-col items-center">
      <FileTable files={uploadedFiles} />
    </div>
  );
}

export default PreValidation;