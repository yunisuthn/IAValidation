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
  const [lockedFiles, setLockedFiles] = useState([])
  
  useEffect(()=>{
    fileService.fetchFiles()
      .then(data => setUploadFiles(data))
      .catch(error=>console.error("Erreur lors de la récupération des fichiers:", error))
  

    // Écoute des événements depuis le serveur
    socket.on('connect', () => {
      console.log('Connecté à Socket.IO avec ID:', socket.id);
    });
      // Écouter les événements de verrouillage et de déverrouillage des fichiers
    socket.on("file-locked", (fileId)=>{
      setLockedFiles(prevLockedFiles => [...prevLockedFiles, fileId])
    })

    socket.on("file-unlocked", (fileId)=>{
      setLockedFiles(prevLockedFiles => prevLockedFiles.filter(id => id !== fileId))
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
        .then(data => setUploadFiles(prevFiles => [...prevFiles, data.filename]))
        .catch(error => console.error("Erreur lors de l'upload:", error))
    })
  }, [])

  return {files, uploadedFiles,lockedFiles, handleDrop}
}


// Composant pour la table des fichiers (Single Responsibility)
function FileTable({files, lockedFiles}) {
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
              {console.log("file", file) }
              <td className='border border-gray-300 px-4 py-2'>
                {lockedFiles.includes(file._id) ? (
                  <FontAwesomeIcon icon={faLock} />
                ) : <FontAwesomeIcon icon={faCheckSquare} />}
              </td>
              <td className='border border-gray-300 px-4 py-2'>
                <Link to={'/document/' + file._id}>{file.filename}</Link>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  )
}

function Home() {

  const {t} = useTranslation()
  const { uploadedFiles, lockedFiles, handleDrop } = useFileUpload();  // Gestion des fichiers centralisée

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop: handleDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'text/xml': ['.xml']
    } 
  });

  return (
    <div className="flex flex-col items-center">
      <div
        {...getRootProps()}
        className="border-2 border-dashed border-gray-400 h-64 w-full flex justify-center items-center text-center"
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>{t("deposez-les-fichiers")}</p>
        ) : (
          <p>{t('glissez-et-deposez')}</p>
        )}
      </div>
      <FileTable files={uploadedFiles} lockedFiles={lockedFiles}/>
    </div>
  );
}

export default Home;

