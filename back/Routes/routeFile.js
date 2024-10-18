const express = require("express")
const multer = require("multer")
const router = express.Router()
const {uploadFile, getFiles, getFileById, unlock_file} = require("../Controller/controllerFile")
const {getValidationByDocumentId, saveValidationDocument, getValidations, validateDocument, getValidationByDocumentIdAndValidation} = require("../Controller/controllerValidation")

let pdfFileName = '';  // Variable to temporarily store the PDF file name

// Define storage with custom naming logic
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads');  // Folder where files will be stored
  },
  filename: function (req, file, cb) {
    // If the file is a PDF, save its original name
    if (file.mimetype === 'application/pdf') {
      pdfFileName = file.originalname.replace(/\.[^/.]+$/, ""); // Store PDF name without extension
      cb(null, file.originalname);  // Save the PDF with its original name
    }
    // If the file is XML, check if PDF has been uploaded first
    else if (file.mimetype === 'text/xml') {
      if (pdfFileName) {
        cb(null, `${pdfFileName}.xml`);  // Name XML same as PDF
      } else {
        cb(new Error('PDF must be uploaded before XML'), false);  // Return error if no PDF uploaded
      }
    }
  }
});

  
const upload = multer({ 
  storage: storage,
});
  
// Route POST pour l'upload des fichiers
router.post('/upload', upload.single("file"), uploadFile);
router.get("/files", getFiles)
router.get("/document/:id", getFileById)
router.post("/unlockFile/:id", unlock_file)

// Validation routes
router.route('/validation/:documentId').get(getValidationByDocumentId)
      .post(saveValidationDocument) // create or update document
      .put(validateDocument); // update document
router.route('/validation/:documentId/:validation').get(getValidationByDocumentIdAndValidation)
router.route('/get-validations/:state?').get(getValidations)

module.exports = router