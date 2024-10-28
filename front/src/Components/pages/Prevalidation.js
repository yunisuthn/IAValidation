import React, { useEffect, useState } from 'react';
import fileService from '../services/fileService';
import PrevalidationTable from '../others/tables/PrevalidationTable';
import useSocketEvent from '../../hooks/useSocketEvent';


// Hook pour gérer les fichiers (Single Responsibility)
function useFileUpload() {
  const [documents, setDocuments] = useState([]);
  const [isLoading, setLoading] = useState(true);
  
  // listen event
  useSocketEvent('document-lock/unlock', ({ id, ...data }) => {
    setDocuments(prev => prev.map(doc =>
      doc._id === id ? { ...doc, ...data } : doc));
  });
  
  // on document changed
  useSocketEvent('document-changed', (document) => {
    // PREVALIDATION: move document to v2 if valdation 1 value is true (validation.v1 === true)
    if (document.validation.v1 && !document.validation.v2) {
      const docs = documents.filter(doc => doc._id !== document._id)
      setDocuments(docs);
    }
  });

  // on document incoming
  useSocketEvent('document-incoming', (document) => {
    // add if not on the list yet
    if (!documents.find(doc => doc._id === document._id))
      setDocuments(prev => [document, ...prev]);
  });


  useEffect(()=>{

    setLoading(true);

    fileService.fetchPrevalidations()
      .then(data => {
        setDocuments(data);
      } )
      .catch(error=>console.error("Erreur lors de la récupération des fichiers:", error))
      .finally(() => setLoading(false))

    return () =>{
      
    }

  }, []);

  // console.log("files, documents,lockedFiles, ",  documents,handleDrop );
  
  return { documents, isLoading}
}

function PreValidation() {

  const { documents, isLoading } = useFileUpload();  // Gestion des fichiers centralisée

  return (
    <div className="flex flex-col items-start h-full w-full flex-grow">
      <div className='w-full overflow-x-auto h-full'>
        <PrevalidationTable data={documents} version='v1' loading={isLoading} />
      </div>
    </div>
  );
}

export default PreValidation;