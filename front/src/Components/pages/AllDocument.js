import { useEffect, useState } from "react";
import fileService from "../services/fileService";
import AllDocumentTable from "../others/tables/AllDocumentTable";
import useSocketEvent from "../../hooks/useSocketEvent";

const AllDocument = () => {

  const [documents, setDocuments] = useState([]);
  const [isLoading, setLoading] = useState(true);
  
  // listen event lock and unlock
  useSocketEvent('document-lock/unlock', ({ id, ...data }) => {
    console.log('data:', data)
    setDocuments(prev => prev.map(doc =>
      doc._id === id ? { ...doc, ...data } : doc));
    console.log('rel')
  });

  useEffect(() => {
    
    setLoading(true);
    fileService.fetchFiles()
      .then(data => {
        setDocuments(data);
      } )
      .catch(error=>console.error("Erreur lors de la récupération des fichiers:", error))
      .finally(() => setLoading(false))

    return () =>{
    }
  }, []);
  

  return (

    <div className="flex flex-col items-start h-full w-full flex-grow">
      <div className='w-full overflow-x-auto h-full'>
        <AllDocumentTable data={documents} version='viewonly' loading={isLoading}/>
      </div>
    </div>
  );
};

export default AllDocument;