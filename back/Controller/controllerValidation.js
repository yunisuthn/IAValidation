const Validation = require("../Models/Validation")

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

// Regiter validation
exports.validateDocument = async (req, res) => {
    try {
        const { documentId } = req.params; // document id
        const { json_data, num = '1' } = req.body;
        
        if (json_data) {
            const validated = await Validation.create({
                json_data: JSON.stringify(json_data),
                num,
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
        console.error(error);
        res.json({
            ok: false
        });
    }
}