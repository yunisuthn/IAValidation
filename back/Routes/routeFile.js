const express = require("express")
const multer = require("multer")
const router = express.Router()
const {uploadFile, getFiles, getFileById} = require("../Controller/controllerFile")
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
  fileFilter: function (req, file, cb) {
    // Accepter uniquement les fichiers PDF
    if (file.mimetype === 'application/pdf' || file.mimetype === 'text/xml' ) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  }
});
  
const uploadFiles = upload.fields([
  { name: 'pdfFile', maxCount: 1 },
  { name: 'xmlFile', maxCount: 1 }
]);
// Route POST pour l'upload des fichiers
router.post('/upload', uploadFiles, uploadFile);
router.get("/files", getFiles)
router.get("/document/:id", getFileById)

// Validation routes
router.route('/validation/:documentId').get(getValidationByDocumentId)
      .post(saveValidationDocument) // create or update document
      .put(validateDocument); // update document
router.route('/validation/:documentId/:validation').get(getValidationByDocumentIdAndValidation)
router.route('/get-validations/:state?').get(getValidations)

module.exports = router