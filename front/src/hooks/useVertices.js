import React, { useEffect, useState } from 'react'
import fileService from '../Components/services/fileService';
import { getVerticesOnJSOn } from '../utils/utils';

export const useVertices = (link = '', docType = '') => {
    const [vertices, setVertices] = useState([]);
    useEffect(() => {
        if (!link && !docType) return;

        fileService.fetchVerticesJson(link).then(json => {
            const verticesArray = getVerticesOnJSOn(json, docType);
            setVertices(verticesArray);
        }).catch((error) => {
            console.log("Failed to fetch JSON vertices: ", error)
        });

    }, [link, docType]);
    
    return vertices;
}

export default useVertices