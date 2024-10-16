const express = require("express")
const multer = require("multer")
const router = express.Router()
const {uploadFile, getFiles} = require("../Controller/controllerFile")


// Définir le dossier où les fichiers seront enregistrés
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads');  // Le dossier où les fichiers seront stockés
    },
    filename: function (req, file, cb) {
      cb(null, `${file.originalname}`);  // Renommer le fichier avec la date pour éviter les conflits de noms
    }
  });
  
  const upload = multer({ 
    storage: storage,
    fileFilter: function (req, file, cb) {
      // Accepter uniquement les fichiers PDF
      if (file.mimetype === 'application/pdf') {
        cb(null, true);
      } else {
        cb(new Error('Only PDF files are allowed'), false);
      }
    }
  });
  
  // Route POST pour l'upload des fichiers
  router.post('/upload', upload.single('file'), uploadFile);
  router.get("/files", getFiles)

  module.exports = router