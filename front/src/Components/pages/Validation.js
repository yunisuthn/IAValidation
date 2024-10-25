import { useEffect, useState } from "react";
import fileService from "../services/fileService";
import Validation2Table from "../others/tables/Validation2Table";
import useSocketEvent from "../../hooks/useSocketEvent";
import { decrementValidationV2, incrementValidationV2 } from "../redux/store";
import { useDispatch } from "react-redux";

const Validation = () => {

  const [documents, setDocuments] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const dispatch = useDispatch();

  // listen event lock and unlock
  useSocketEvent('document-lock/unlock', ({ id, ...data }) => {
    setDocuments(prev => prev.map(doc =>
      doc._id === id ? { ...doc, ...data } : doc));
  });
  
  // on document changed
  useSocketEvent('document-changed', (document) => {

    // FROM PREVALIDATION: add new document
    if (document.validation.v1 && !document.validation.v2) {
      setDocuments(prev => [...prev, document]);
      // increment number of validation2
      dispatch(incrementValidationV2());
    }

    // VALIDATION TO VALIDATED: remove document 
    if (document.validation.v1 && document.validation.v2) {
      setDocuments(prev => prev.filter(doc => doc._id !== document._id));
      // decrease number of validation2
      dispatch(decrementValidationV2());
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