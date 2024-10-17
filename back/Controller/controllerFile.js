
const File = require('../Models/File')
const xml2js = require('xml2js');
const fs = require('fs')

exports.uploadFile = (req, res) =>{
    if (!req.file) {
        return res.status(400).json({message: 'No file uploaded'})
    }

    const newFile = new File ({
        filename: req.file.filename
    })

    newFile.save()
    .then(()=>{
        res.status(200).json({message: 'File uploaded successfully', filename: req.file.filename})
    })
    .catch((error)=>{
        console.error('Error saving file to database:', error);
        res.status(500).json({message: 'Error saving file to database'})
        
    })
}

// Function to read and convert XML to JSON using Promises
function convertXmlToJson(filePath) {
    
    return new Promise((resolve, reject) => {
        // Read the XML file
        fs.readFile(filePath, 'utf8', (err, data) => {
            
            if (err) {
                return reject('Error reading XML file: ' + err);
            }
    
            // Parse the XML data
            xml2js.parseString(data, { explicitArray: false }, (err, result) => {
                if (err) {
                    return reject('Error parsing XML to JSON: ' + err);
                }
                // Resolve the parsed JSON result
                resolve(result);
            });
        });
    });
}

exports.getFileById = async (req, res) => {
    try {
        const io = req.app.get('io');  // Initialiser le serveur Socket.IO

        const file = await File.findById(req.params.id);
        
        io.emit('file-locked', file._id)

        const xmlJSON = await convertXmlToJson('./uploads/' + file.xml);
        res.status(200).json({...file._doc, xmlJSON})
    } catch (error) {
        console.error("Erreur lors de la récupération des fichiers:", error);
        res.status(500).json({message: 'Erreur lors de la récupération des fichiers'})
    }
}

exports.getFiles = async (req, res) => {
    try {
        const files = await File.find({filename: {$regex: /\.pdf$/i}})
        res.status(200).json(files)
    } catch (error) {
        console.error("Erreur lors de la récupération des fichiers:", error);
        res.status(500).json({message: 'Erreur lors de la récupération des fichiers'})
    }
}