import { useEffect, useState } from "react";
import DocumentsTable from "../others/DocumentsTable";
import useSocket, { useOnLockedAndUnlockedDocument } from "../../hooks/useSocket";
import fileService from "../services/fileService";
import Validation2Table from "../others/tables/Validation2Table";

const Validation = () => {

  const [documents, setDocuments] = useState([]);
  const [isLoading, setLoading] = useState(true);

  // listen event lock and unlock
  useOnLockedAndUnlockedDocument(({ id, ...data }) => {
    setDocuments(prev => prev.map(doc =>
    doc._id === id ? { ...doc, ...data } : doc));
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