import { useEffect, useState } from "react";
import fileService from "../services/fileService";
import Validation2Table from "../others/tables/Validation2Table";
import useSocketEvent from "../../hooks/useSocketEvent";

const Validation = () => {

  const [documents, setDocuments] = useState([]);
  const [isLoading, setLoading] = useState(true);

  // listen event lock and unlock
  useSocketEvent('document-lock/unlock', ({ id, ...data }) => {
    setDocuments(prev => prev.map(doc =>
      doc._id === id ? { ...doc, ...data } : doc));
  });
  
  // on document changed
  useSocketEvent('document-changed', (document) => {


    // FROM PREVALIDATION: add new document
    if (document.validation.v1 && !document.validation.v2 && !(documents.find(doc => doc._id === document._id))) {
      setDocuments(prev => [...prev, document]);
    }

    // VALIDATION TO VALIDATED: remove document 
    if (document.validation.v1 && document.validation.v2) {
      setDocuments(prev => prev.filter(doc => doc._id !== document._id));
    }
    
  });

  useEffect(() => {

    setLoading(true);
    fileService.fetchV2Validations()
      .then(data => {
        setDocuments(data);
      } )
      .catch(error=>console.error("Erreur lors de la récupération des fichiers:", error))
      .finally(() => setLoading(false))

  }, [])
  

  return (

    <div className="flex flex-col items-start h-full w-full flex-grow">
      <div className='w-full overflow-x-auto h-full'>
        <Validation2Table data={documents} version='v2' loading={isLoading} />
      </div>
    </div>
  );
};

export default Validation;