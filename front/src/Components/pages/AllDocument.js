import { useEffect, useState } from "react";
import fileService from "../services/fileService";
import AllDocumentTable from "../others/tables/AllDocumentTable";
import useSocketEvent from "../../hooks/useSocketEvent";

const AllDocument = () => {

  const [documents, setDocuments] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [page, setPage] = useState(0); // MUI DataGrid utilise l'index de page
  const [pageSize, setPageSize] = useState(50); // Nombre d'enregistrements par page
  const [rowCount, setRowCount] = useState(0); // Total des enregistrements dans la 
  
  // listen event lock and unlock
  useSocketEvent('document-lock/unlock', ({ id, ...data }) => {
    console.log('data:', data)
    setDocuments(prev => prev.map(doc =>
      doc._id === id ? { ...doc, ...data } : doc));
    console.log('rel')
  });
  
  // on document incoming
  useSocketEvent('document-incoming', (document) => {
    // add if not on the list yet
    if (!documents.find(doc => doc._id === document._id))
      setDocuments(prev => [document, ...prev]);
  });

  useEffect(() => {
    
    setLoading(true);
    fileService.fetchDocuments(page, 5)
      .then(res => {
        const { data, otalRecords, totalPages, currentPage } = res;
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