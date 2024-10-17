
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
        res.status(200).json({message: 'File uploaded successfully', data: newFile})
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
        const id = req.params.id
        const file = await File.findById(req.params.id);
                
        if (!req.io) {
            return res.status(500).send('Socket.io instance is not available');
        }
        
        // req.io.on('lock-file', async (id) => {
        //     console.log("id ====== ", id);
            // const item = await File.findById(id)
        if (!file.isLocked) {
            file.isLocked = true
            await file.save()
            req.io.emit('file-locked', {id, isLocked: true})
        }
            
        //   })
  //test socket
  // socket.on('lock-item', async (id) => {
  //   const item = await Item.findById(id)
  //   if (!item.isLocked) {
  //     item.isLocked = true
  //     await item.save()
  //     io.emit('item-locked', {id, isLocked: true})
  //   }
    
        // io.emit('file-locked', file._id)

        const xmlJSON = await convertXmlToJson('./uploads/' + file.xml);
        res.status(200).json({...file._doc, xmlJSON});
    } catch (error) {
        console.error("Erreur lors de la récupération des fichiers:", error);
        res.status(500).json({message: 'Erreur lors de la récupération des fichiers'})
    }
}

exports.getFiles = async (req, res) => {
    try {
        const files = await File.find({filename: {$regex: /\.pdf$/i}})
        //test socket
    
        res.status(200).json(files)
    } catch (error) {
        console.error("Erreur lors de la récupération des fichiers:", error);
        res.status(500).json({message: 'Erreur lors de la récupération des fichiers'})
    }
}

exports.unlock_file = async (req, res) => {
    try {
        const id = req.params.id;
        const file = await File.findById(id);

        if (!file) {
            return res.status(404).json({ message: 'File not found' });
        }

        if (!req.io) {
            return res.status(500).send('Socket.io instance is not available');
        }

        // Si le fichier est verrouillé, le déverrouiller
        if (file.isLocked) {
            file.isLocked = false;
            await file.save();

            // Émettre un événement via Socket.io pour notifier que le fichier est déverrouillé
            req.io.emit('file-unlocked', { id, isLocked: false });
        }

        res.status(200).json({ message: 'File unlocked successfully', file });
    } catch (error) {
        console.error("Erreur lors de la mise à jour du fichier:", error);
        res.status(500).json({ message: 'Erreur lors de la mise à jour du fichier' });
    }
};