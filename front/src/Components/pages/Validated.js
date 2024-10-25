import { useEffect, useState } from "react";
import { useOnLockedAndUnlockedDocument } from "../../hooks/useSocket";
import fileService from "../services/fileService";
import ValidatedTable from "../others/tables/ValidatedTable";

const Validated = () => {

    const [documents, setDocuments] = useState([]);
    const [isLoading, setLoading] = useState(true);
    
    // listen event lock and unlock
    useOnLockedAndUnlockedDocument(({ id, ...data }) => {
        setDocuments(prev => prev.map(doc =>
        doc._id === id ? { ...doc, ...data } : doc));
    });


    useEffect(() => {

        setLoading(true);
        fileService.fetchValidatedDocuments()
            .then(data => {
                setDocuments(data);
            })
            .catch(error => console.error("Erreur lors de la récupération des fichiers:", error))
            .finally(() => setLoading(false));

        return () => {
            
        }
    }, [])


    return (

        <div className="flex flex-col items-start h-full w-full flex-grow">
            {/* <div className='flex-grow w-full overflow-x-auto h-full'> */}
                <ValidatedTable data={documents} version='v2' loading={isLoading} />
            {/* </div> */}
        </div>
    );
};

export default Validated;