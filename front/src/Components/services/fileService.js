
  // fileService.js

import axios from 'axios';
const API_BASE_URL = 'http://localhost:5000';
// services/fileService.js

// Service pour récupérer tous les fichiers (uniquement les PDF ou autres)
const fetchFiles = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/files`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Erreur lors de la récupération des fichiers: ${response.statusText}`);
    }

    const data = await response.json();
    
    return data; // Cela retourne la liste des fichiers
  } catch (error) {
    console.error('Erreur lors de la récupération des fichiers:', error);
    throw error;
  }
}

const uploadFiles = async (files) => {
  const formData = new FormData();

  console.log("files", files);
  
  files.forEach((file) => {
    formData.append('files', file);
  });

  try {
    const response = await axios.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.files; // Retourner les fichiers reçus du serveur
  } catch (error) {
    console.error('Erreur lors du téléchargement:', error);
    throw error;
  }
};



// Method to send validation
const saveValidation = async  (documentId, data) => {
  const response = await fetch(`${API_BASE_URL}/validation/${documentId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      documentId,
      ...data
    })
  });
  return response.json();
}

// Method to send validation
const validateDocument = async  (documentId, data) => {
  const response = await fetch(`${API_BASE_URL}/validation/${documentId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      documentId,
      ...data
    })
  });
  return response.json();
}

const getDocumentValidation = async (documentId, validation) => {
  const response = await fetch(`${API_BASE_URL}/validation/${documentId}${validation ? '/' + validation : ''}`, {
    method: 'GET',
  });
  return response.json();
}
// Export des fonctions du service
const fileService = {
  fetchFiles,
  uploadFiles,
  saveValidation,
  getDocumentValidation,
  validateDocument
};


export default fileService;
