import { useEffect, useState } from "react";
import useSocket from "../../hooks/useSocket";
import fileService from "../services/fileService";
import ReturnedTable from "../others/tables/ReturnedTable";

const Retourne = () => {

  const { socket, isConnected } = useSocket();
  const [documents, setDocuments] = useState([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    if (!socket || !isConnected) return;
    setLoading(true);
    fileService.fetchReturnedValidations()
      .then(data => {
        setDocuments(data);
      } )
      .catch(error=>console.error("Erreur lors de la récupération des fichiers:", error))
      .finally(() => setLoading(false))

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
  }, [socket, isConnected]);
  

  return (

    <div className="flex flex-col items-start h-full w-full flex-grow">
      <div className='w-full overflow-x-auto h-full'>
        <ReturnedTable data={documents} version='v1' loading={isLoading}/>
      </div>
    </div>
  );
};

export default Retourne;