const express = require("express")
const multer = require("multer")
const router = express.Router()
const {uploadFile, getFiles, getFileById, unlock_file} = require("../Controller/controllerFile")
const {getValidationByDocumentId, saveValidationDocument, getValidations, 
  validateDocument, getValidationByDocumentIdAndValidation} = require("../Controller/controllerValidation")
const {login, signup} = require("../Controller/controllerAuthentification")
const { log } = require("console")

const {protect} = require("../Controller/authMiddleware")

const File = require('../Models/File')
let pdfFileName = '';  // Variable to temporarily store the PDF file name

  
// Configurer l'emplacement de stockage et les fichiers acceptés
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, `${file.originalname}`);
  }
});

const fileFilter = (req, file, cb) => {
  const filetypes = /pdf|xml/;
  const mimetype = filetypes.test(file.mimetype);
  // const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype ) {
    return cb(null, true);
  } else {
    cb('Erreur : Seuls les fichiers PDF et XML sont acceptés');
  }
};

// Initialiser multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});
// const upload = multer({ 
//   storage: storage,
// });
  
// Route POST pour l'upload des fichiers
// router.route('/upload').post(upload.single("file"), uploadFile);
router.route('/upload').post(upload.array('files', 10), uploadFile);

router.get("/files", getFiles)
router.get("/document/:id", getFileById)
router.post("/unlockFile/:id", unlock_file)

// Validation routes
router.route('/validation/:documentId').get(getValidationByDocumentId)
      .post(saveValidationDocument) // create or update document
      .put(validateDocument); // update document
router.route('/validation/:documentId/:validation').get(getValidationByDocumentIdAndValidation)
router.route('/get-validations/:state?').get(getValidations)
router.route('/login').post(login)
router.route('/register').post(signup)

module.exports = router