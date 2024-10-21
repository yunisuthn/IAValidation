import { useEffect, useState } from "react";
import DocumentsTable from "../others/DocumentsTable";
import useSocket from "../../hooks/useSocket";
import fileService from "../services/fileService";

const Validation = () => {

  const { socket, isConnected } = useSocket();
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    if (!socket || !isConnected) return;

    
    fileService.fetchV2Validations()
      .then(data => {
        setDocuments(data);
      } )
      .catch(error=>console.error("Erreur lors de la récupération des fichiers:", error))

    // Écouter les événements de verrouillage et de déverrouillage des fichiers
    socket.on("file-locked", ({id, isLocked})=>{
      setDocuments(prev => 
        prev.map(file => 
          file._id === id ? {...file, isLocked} : file
        )
      )
    })

    socket.on("file-unlocked", ({id, isLocked})=>{
      setDocuments(prev => 
        prev.map(file => 
          file._id === id ? {...file, isLocked} : file));
    })

    return () =>{
      socket.off("file-locked")
      socket.off("file-unlocked")
    }
  }, [socket, isConnected])
  

  return (

    <div className="flex flex-col items-start h-full w-full flex-grow">
      <div className='w-full overflow-x-auto h-full'>
        <DocumentsTable data={documents} version='v2' />
      </div>
    </div>
  );
};

export default Validation;