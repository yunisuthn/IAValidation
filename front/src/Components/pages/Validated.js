import { useEffect, useState } from "react";
import useSocket from "../../hooks/useSocket";
import fileService from "../services/fileService";
import ValidatedTable from "../others/tables/ValidatedTable";

const Validated = () => {

    const { socket, isConnected } = useSocket();
    const [documents, setDocuments] = useState([]);

    useEffect(() => {
        if (!socket || !isConnected) return;


        fileService.fetchValidatedDocuments()
            .then(data => {
                setDocuments(data);
            })
            .catch(error => console.error("Erreur lors de la récupération des fichiers:", error))

        // Écouter les événements de verrouillage et de déverrouillage des fichiers
        socket.on("file-locked", ({ id, isLocked }) => {
            setDocuments(prev =>
                prev.map(file =>
                    file._id === id ? { ...file, isLocked } : file
                )
            )
        })

        socket.on("file-unlocked", ({ id, isLocked }) => {
            setDocuments(prev =>
                prev.map(file =>
                    file._id === id ? { ...file, isLocked } : file));
        })

        return () => {
            socket.off("file-locked")
            socket.off("file-unlocked")
        }
    }, [socket, isConnected])


    return (

        <div className="flex flex-col items-start h-full w-full flex-grow">
            {/* <div className='flex-grow w-full overflow-x-auto h-full'> */}
                <ValidatedTable data={documents} version='v2' />
            {/* </div> */}
        </div>
    );
};

export default Validated;