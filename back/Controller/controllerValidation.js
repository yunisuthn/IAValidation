const Validation = require("../Models/Validation")
const Document = require("../Models/File")
const { Builder } = require('xml2js');
const path = require('path');
const fs = require('fs');

// method to get validation by state
exports.getValidations = async (req, res) => {
    try {

        const { state } = req.params;

        const validations = await Validation.find({
            ...(state && { num: state })
        }).populate('document');
    
        res.json(validations);
    } catch (err) {
        console.log(err);
        res.status(503).json([]);
    }
}

// Function to check if document is treated (v1 or v2)
exports.getValidationByDocumentId = async (req, res) => {
    try {
        const { documentId } = req.params; // document id
        const validation = await Validation.findOne({ document: documentId })
            .populate('document');

        res.json(validation);

    } catch (error) {
        console.error(error);
        res.json(null);
    }
}

// get validation by document id and validation (v1 or v2)
exports.getValidationByDocumentIdAndValidation = async (req, res) => {
    try {
        const { documentId, validation } = req.params; // document id
        const document = await Document.findById(documentId);

        res.json(document);

    } catch (error) {
        console.error(error);
        res.json(null);
    }
}


// method to save document
exports.saveValidationDocument = async (req, res) => {
    try {
        
        const { documentId } = req.params; // document id
        const { json_data, versionNumber } = req.body;
        
        if (json_data) {

            const existingDocument = await Document.findOne({ 
                _id: documentId, 
                'versions.versionNumber': versionNumber 
            });

            let updatedDocument;

            if (existingDocument) {
                // Version exists, so update it
                updatedDocument = await Document.findOneAndUpdate(
                    { _id: documentId, 'versions.versionNumber': versionNumber },
                    { $set: { 'versions.$.dataJson': json_data } }, // Update existing version's dataJson
                    { new: true } // Return the updated document
                );
            } else {
                // Version does not exist, so push a new version to the array
                updatedDocument = await Document.findOneAndUpdate(
                    { _id: documentId },
                    { 
                        $push: { 
                            versions: { versionNumber, dataJson: json_data } // Add new version
                        } 
                    },
                    { new: true } // Return the updated document
                );
            }

            res.json({
                ok: true,
                data: updatedDocument
            });

        } else {
            res.json({
                ok: false,
                message: 'No json_data'
            });
        }
    } catch (error) {
        console.log(error)
        res.json({
            ok: false,
            message: 'Error'
        });
    }

}


// validate validation
exports.validateDocument = async (req, res) => {
    try {
        const { documentId } = req.params; // document id
        const { json_data, versionNumber } = req.body;
        
        // update document
        const validated = await Document.findOneAndUpdate(
            { _id: documentId, 'versions.versionNumber': versionNumber },
            {
                $set: {
                    'versions.$.dataJson': json_data, // Updates the matched version's dataJson
                    [`validation.${versionNumber}`]: true, // Sets the validation field for the version
                    status: versionNumber === 'v2' ? 'validated' : 'progress',
                    isLocked: false
                }
            },
            { new: true } // Returns the updated document
        );

        res.json({
            ok: true,
            data: validated
        });

    } catch (error) {
        console.error(error);
        res.json({
            ok: false
        });
    }
}

// method to return document
exports.returnDocument = async (req, res) => {
    try {
        
        const { documentId } = req.params;
        
        const updatedDocument = await Document.findByIdAndUpdate(
            documentId,
            { 
                $set: {
                    "validation.v1": false,
                    "validation.v2": false, 
                    status: 'returned',
                    isLocked: false
                },
            },
            { new: true } // Returns the updated document
        );
        

        res.json({
            ok: true,
            data: updatedDocument
        })
    } catch (error) {
        console.log(error)
        res.json({
            ok: false,
            data: null
        })
    }

}

exports.createXMLFile = async (req, res) => {
    try {
        const { json } = req.body;
        // Create a new Builder instance
        const builder = new Builder();
        // Convert JSON to XML
        const xml = builder.buildObject(json);

        // Define the file path where XML will be written
        const filePath = path.join(__dirname, 'output.xml');

        // Write the XML data to the file
        fs.writeFile(filePath, xml, (err) => {
            if (err) {
                return res.status(500).send("Error generating XML file.");
            }

            // Send the file for download
            res.download(filePath, 'data.xml', (err) => {
                if (err) {
                    return res.status(500).send("Error downloading the file.");
                }

                // Optionally, delete the file after download
                fs.unlink(filePath, (err) => {
                    if (err) console.error("Error deleting the file after download:", err);
                });
            });
        });

    } catch (error) {
        console.log(error)
        res.send(null);
    }
}