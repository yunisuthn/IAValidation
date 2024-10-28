import { useEffect, useState } from "react";
import fileService from "../services/fileService";
import ValidatedTable from "../others/tables/ValidatedTable";
import useSocketEvent from "../../hooks/useSocketEvent";

const Validated = () => {

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
        if (document.validation.v1 && document.validation.v2 && document.status === 'validated') {
            setDocuments(prev => [...prev, document]);
        }
        
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