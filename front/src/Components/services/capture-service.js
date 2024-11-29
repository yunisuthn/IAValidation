import axios from 'axios';
const API_BASE_URL = process.env.REACT_APP_API_URL;
// services/fileService.js

const token = () => localStorage.getItem('token');

// Service pour récupérer tous les fichiers (uniquement les PDF ou autres)
export const convertImageToText = async (imageBase64) => {
    const response = await axios.post(`${API_BASE_URL}/extract-text`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token()}`,
        },
        body: JSON.stringify({imageBase64}),
    });
    

    return response.data;
}
