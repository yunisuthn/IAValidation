import { memo, useEffect, useState } from 'react';
import { Modal, Box, Typography, Button, FormLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { t } from 'i18next';
import templateService from '../services/template-service';

const ChooseTemplate = memo(({ open, onClose, onSubmit, defaultValue='' }) => {

    const [tempates, setTemplates] = useState([]);
    const [templateId, setTemplateId] = useState('');

    useEffect(() => {
        templateService.getAll().then(templs => {
            setTemplates(templs);
        });
    }, []);

    useEffect(() => {
        setTemplateId(defaultValue);
    }, [defaultValue]);




    const modalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 'auto',
        bgcolor: 'background.paper',
        borderRadius: '8px',
        boxShadow: 24,
        p: 4,
    };

    function handleSubmit(e) {
        e.preventDefault();
        onSubmit?.(templateId);
    }

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="loading-modal"
            aria-describedby="loading-icon-and-text"
        >
            <Box sx={modalStyle} className="flex flex-col min-w-[500px]">
                <form onSubmit={handleSubmit}>
                    {/* <CircularProgress color="primary" /> */}
                    <Typography variant="h6" className="mt-6 text-slate-800">
                        {t('choose-template')}
                    </Typography>
                    <div className="reject__form-group flex justify-between items-center w-full">
                        <FormLabel id="demo-radio-buttons-group-label">Template</FormLabel>
                            <RadioGroup
                                aria-labelledby="demo-radio-buttons-group-label"
                                defaultValue={templateId}
                                value={templateId}
                                name="radio-buttons-group"
                                onChange={(e) => setTemplateId(e.target.value)}
                                
                            >
                            {
                                tempates.map((temp, index) => (
                                    <FormControlLabel key={index} value={temp._id} control={<Radio />} label={temp.name} />
                                ))
                            }
                        </RadioGroup>
                    </div>
                    <div className="flex items-center mt-6 gap-4 justify-center">
                        <Button type="button" variant='outline' color='info' size='small' onClick={onClose}>
                            {t('close-btn')}
                        </Button>
                        <Button type="submit" variant='contained' color='info' size='small' disabled={!templateId ? true : false}>
                            {t('done-btn')}
                        </Button>
                    </div>
                </form>
            </Box>
        </Modal>
    );
});

export default ChooseTemplate;
