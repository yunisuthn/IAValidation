const Validation = require("../Models/Validation")
const Document = require("../Models/File")

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
        const record = await Validation.findOne({ document: documentId, num: validation })
            .populate('document');

        res.json(record);

    } catch (error) {
        console.error(error);
        res.json(null);
    }
}


// method to save document
exports.saveValidationDocument = async (req, res) => {
    try {
        
        const { documentId } = req.params; // document id
        const { json_data, num } = req.body;

        if (json_data) {
            
            // check v1 if exists
            const v1 = await Validation.findOne({ document: documentId, num: 'v1', state: 'validated'});

            if (!v1) return res.json({
                ok: false,
                message: 'No v1',
                data: null
            })

            // check if it has already inserted
            const validationDoc = await Validation.findOne({
                document: documentId,
                ...(num && { num })
            });

            if (validationDoc) {
                // update it
                const updated = await Validation.findByIdAndUpdate(validationDoc._id, {
                    json_data: JSON.stringify(json_data),
                    ...(num && { num })
                }).populate('document');

                return res.json({
                    ok: true,
                    data: updated
                });
            }

            const validated = await Validation.create({
                json_data: JSON.stringify(json_data),
                ...(num && { num }),
                document: documentId
            });

            res.json({
                ok: true,
                data: validated
            });

        } else {
            res.json({
                ok: false,
                message: 'No json_data'
            });
        }
    } catch (error) {
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
        const { json_data, num } = req.body;
        
        // update document
        const updatedDoc = await Validation.findOneAndUpdate({
            document: documentId,
        }, {
            state: 'validated',
            ...(json_data && { json_data: JSON.stringify(json_data)}),
            ...(num && { num })
        }).populate('document');

        res.json({
            ok: true,
            data: updatedDoc
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

        const updatedDoc = await Validation.findByIdAndUpdate(documentId, {
            state: 'returned'
        }).populate('document');

        res.json({
            ok: true,
            data: updatedDoc
        })
    } catch (error) {
        console.log(error)
        res.json({
            ok: false,
            data: null
        })
    }

}