import React, { useEffect, useState } from 'react';
import fileService from '../services/fileService';
import PrevalidationTable from '../others/tables/PrevalidationTable';
import useSocketEvent from '../../hooks/useSocketEvent';
import { useDispatch } from 'react-redux';
import { decrementPrevalidation, incrementValidationV2 } from '../redux/store';


// Hook pour gérer les fichiers (Single Responsibility)
function useFileUpload() {
  const [documents, setDocuments] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const dispatch = useDispatch();
  
  // listen event
  useSocketEvent('document-lock/unlock', ({ id, ...data }) => {
    setDocuments(prev => prev.map(doc =>
      doc._id === id ? { ...doc, ...data } : doc));
  });
  
  // on document changed
  useSocketEvent('document-changed', (document) => {
    // PREVALIDATION: move document to v2 if valdation 1 value is true (validation.v1 === true)
    if (document.validation.v1 && !document.validation.v2) {
      setDocuments(prev => prev.filter(doc => doc._id !== document._id));
      // decrease number of validation2
      dispatch(decrementPrevalidation());
      // increment validation2
      dispatch(incrementValidationV2());
      console.log('more')
    }
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