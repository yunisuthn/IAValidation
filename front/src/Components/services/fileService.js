
  // fileService.js

const API_BASE_URL = 'http://localhost:5000';

// Service pour récupérer tous les fichiers (uniquement les PDF ou autres)
async function fetchFiles() {
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

// Service pour uploader un fichier (PDF ou XML)
async function uploadFile(file) {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Erreur lors de l'upload: ${response.statusText}`);
    }

    const data = await response.json();
    return data; // Cela retourne les détails du fichier uploadé
  } catch (error) {
    console.error("Erreur lors de l'upload du fichier:", error);
    throw error;
  }
}

// Method to send validation
async function sendValidation(documentId, data) {
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

async function getDocumentValidation(documentId) {
  const response = await fetch(`${API_BASE_URL}/validation/${documentId}`, {
    method: 'GET',
  });
  return response.json();
}
// Export des fonctions du service
const fileService = {
  fetchFiles,
  uploadFile,
  sendValidation,
  getDocumentValidation
};


export default fileService;
