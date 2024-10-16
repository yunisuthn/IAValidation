import React, { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

function Home() {

  const [files, setFiles] = useState([])
  const [uploadedFiles, setUploadFiles] = useState([])
  const {t, i18n} = useTranslation()

  useEffect(()=>{
    fetch("http://localhost:5000/files")
      .then(response => response.json())
      .then(data=>{
        console.log("Fichiers récupérés depuis la DB: ", data);
        setUploadFiles(data.map(file=>file.filename))
      })
      .catch(error=>{
        console.error("Erreur lors de la récupération des fichiers:", error);
      })
  }, [])

  const onDrop = useCallback((acceptedFiles) => {
    const pdfFiles = acceptedFiles.filter(file => file.type === "application/pdf")
    setFiles(prevFiles => [...prevFiles, ...pdfFiles])
    console.log('Fichiers PDF acceptés:', pdfFiles);
    

    pdfFiles.forEach(file => {
      const formData = new FormData();
      formData.append('file', file)

      fetch('http://localhost:5000/upload', {
        method: "POST",
        body: formData
      })

      .then(response => response.json())
      .then(data => {
        console.log("Fichier uploadé avec succès: ", data);
        setUploadFiles(prevFiles => [...prevFiles, data.filename])
      })
      .catch(error=>{
        console.error("Erreur lors de l\'upload:", error);
        
      })
    });
    // Gestion des fichiers déposés ici
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
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
      <table className="min-w-full border-collapse border border-gray-400">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">{t('nom-fichier')}</th>
          </tr>
        </thead>
        <tbody>
          {uploadedFiles.length === 0 ? (  // Vérification si le tableau est vide
            <tr>
              <td className="border border-gray-300 px-4 py-2 text-center" colSpan="1">
                  {t('aucun-fichier')}
              </td>
            </tr>
          ) : ( uploadedFiles.map((filename, index) => (
            <tr key={index}>
              <td className="border border-gray-300 px-4 py-2">
                <Link to={'/document/'}>{filename}</Link>
              </td>
            </tr>
          )))}
        </tbody>
      </table>
    </div>
  );
}

export default Home;

