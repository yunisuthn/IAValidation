
const File = require('../Models/File')

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