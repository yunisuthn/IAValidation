import React, { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

// Service pour l'upload des fichiers (Inversion des dépendances)
const fileService = {
  fetchFiles : async () => {
    const response = await fetch("http://localhost:5000/files")
    return await response.json()
  },
  uploadFile: async (file) => {
    const formData = new FormData()
    formData.append("file", file)
    const response = await fetch("http://localhost:5000/upload", {
      method: "POST",
      body: formData
    })
    return await response.json()
  }
}


// Hook pour gérer les fichiers (Single Responsibility)
function useFileUpload() {
  const [files, setFiles] = useState([])
  const [uploadedFiles, setUploadFiles] = useState([])
  
  useEffect(()=>{
    fileService.fetchFiles()
      .then(data => setUploadFiles(data))
      .catch(error=>console.error("Erreur lors de la récupération des fichiers:", error))
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

  return {files, uploadedFiles, handleDrop}
}


// Composant pour la table des fichiers (Single Responsibility)
function FileTable({files}) {
  const {t} = useTranslation()

  return (
    <table className='min-w-full border-collapse border border-gray-400'>
      <thead>
        <tr>
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
              <td className='boder border-gray-300 px-4 py-2'>
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
  const { uploadedFiles, handleDrop } = useFileUpload();  // Gestion des fichiers centralisée

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
      <FileTable files={uploadedFiles}/>
    </div>
  );
}

export default Home;

