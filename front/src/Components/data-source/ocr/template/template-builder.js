import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FormElementEditor } from './form-element-editor';
import { FormPreview } from './form-preview';
import { Add, Download, HelpOutline, Save, Undo, Upload } from '@mui/icons-material';
import { Button } from '@mui/material';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { useTranslation } from 'react-i18next';
import { deepCloneArray, deleteObjectFoundByName, replaceObjectFoundByName, updateNamesToHaveGroupName, updateObjectByName } from '../../../../utils/utils';
import { isEqual } from 'lodash';

function TemplateBuilder({ json, onSave }) {
    const [formElements, setFormElements] = useState([]);
    const [memoFormElements, setMemoFormElements] = useState([]);
    const [showHelp, setShowHelp] = useState(false);
    const { t } = useTranslation();
    const templateData = useMemo(() => json, [json]);
    const inputFileRef = useRef(null);


    useEffect(() => {
        if (json) {
            const arr = Array.isArray(json.data) ? json.data : JSON.parse(String.raw`${json.data}`);
            setFormElements(arr);
            setMemoFormElements(deepCloneArray(arr));
        }
    }, [json]);

    const handleAddElement = () => {
        setFormElements([...formElements, {
            name: '',
            label: '',
            type: 'text'
        }]);
    };

    const handleUpdateElement = (index, newField) => {
        const newElements = [...formElements];
        // const updated = updateNamesToHaveGroupName(newField);
        // newElements[index] = updated;
        newElements[index] = newField;
        setFormElements(newElements);
    };

    const handleDeleteElement = (index) => {
        const newElements = [...formElements];
        newElements.splice(index, 1);
        setFormElements(newElements);
    };

    const handleExportJSON = () => {
        const jsonString = JSON.stringify(formElements, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'form-definition.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleSaveJSON = () => {
        const jsonString = JSON.stringify(formElements);
        onSave?.(json._id, jsonString);
        setMemoFormElements(deepCloneArray(formElements));
    };

    const handleUndoJSON = () => {
        setFormElements(deepCloneArray(memoFormElements));
    };

    const handleFileChange = (event) => {

        const file = event.target.files[0];

        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const json = JSON.parse(e.target.result);
                setFormElements(json);
            } catch (error) {
                console.error("Invalid JSON file:", error);
            } finally {
                if (inputFileRef.current) {
                    inputFileRef.current.value = ""; // Clear input value
                }
            }
        };

        reader.readAsText(file);
    }

    return (
        <div className="flex flex-col flex-grow h-full bg-gradient-to-br from-slate-100 to-indigo-50">
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <h1 className="text-base font-bold text-slate-800">{t('form-builder')}: <i className='text-blue-optimum'>{templateData?.name}</i></h1>
                        <div className="flex items-center space-x-4 text-sm">
                            <button
                                onClick={() => setShowHelp(!showHelp)}
                                className="text-gray-500 hover:text-gray-700"
                                title="Show Help"
                            >
                                <HelpOutline fontSize='small' />
                            </button>
                            <Button
                                onClick={handleAddElement}
                                variant="contained"
                                color="primary"
                                startIcon={<Add fontSize="small" />}
                            >
                                {t('add-field')}
                            </Button>

                            <Button
                                onClick={handleSaveJSON}
                                variant="contained"
                                color="success"
                                startIcon={<Save fontSize="small" />}
                                disabled={isEqual(memoFormElements, formElements)}
                            >
                                {t('save')}
                            </Button>
                            
                            {
                                !isEqual(formElements, memoFormElements) &&
                                <Button
                                    onClick={handleUndoJSON}
                                    variant="outlined"
                                    color="inherit"
                                    startIcon={<Undo fontSize="small" />}
                                >
                                    {t('cancel')}
                                </Button>
                            }

                            <Button
                                onClick={() => inputFileRef.current?.click()}
                                variant="outlined"
                                color='info'
                                startIcon={<Upload fontSize="small" />}
                                title="Import JSON file"
                            >
                                {t('import')}
                            </Button>


                            <Button
                                onClick={handleExportJSON}
                                variant="outlined"
                                color='warning'
                                startIcon={<Download fontSize="small" />}
                                title="Export form configuration as JSON"
                            >
                                {t('export')}
                            </Button>

                            <input type='file' className='hidden invisible' ref={inputFileRef} onChange={handleFileChange} accept='application/json' />
                        </div>
                    </div>
                </div>
            </nav>

            {showHelp && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                        <h2 className="text-lg font-semibold mb-4">Quick Guide</h2>
                        <ul className="space-y-2 text-gray-600">
                            <li>• Click <strong>Add Field</strong> to create a new form element</li>
                            <li>• Choose the field type from the dropdown (text, number, date, etc.)</li>
                            <li>• For group fields, you can add nested elements</li>
                            <li>• Preview your form on the right side</li>
                            <li>• Click <strong>Export</strong> to download the form configuration</li>
                        </ul>
                    </div>
                </div>
            )}

            <main className="relative overflow-y-auto h-full w-full">
                <div className="absolute inset-0 flex flex-col">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 h-full w-full flex flex-col">
                        <PanelGroup autoSaveId='form-builder_panel' className="flex flex-grow gap-4 w-full" direction='horizontal'>
                            <Panel className="space-y-4 w-full h-full flex flex-col">
                                <div className="bg-white border h-full rounded-lg shadow-sm py-6 flex flex-col flex-grow">
                                    <h2 className="text-base font-bold mb-2 px-6 text-slate-700">Form Structure</h2>
                                    <div className="h-full flex-grow relative overflow-y-auto">
                                        <div className="absolute inset-0 p-6">
                                            <div className="space-y-4 h-full pr-1">
                                                {formElements.length === 0 ? (
                                                    <div className="text-center py-12 text-slate-500">
                                                        <p>No fields added yet.</p>
                                                        <p className="text-sm mt-2">Click "Add Field" to start building your form.</p>
                                                    </div>
                                                ) : (
                                                    formElements.map((element, index) => (
                                                        <FormElementEditor
                                                            key={index}
                                                            element={element}
                                                            onUpdate={(updated) => handleUpdateElement(index, updated)}
                                                            onDelete={() => handleDeleteElement(index)}
                                                        />
                                                    ))
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className='bg-white h-6 w-full' />
                                </div>
                            </Panel>

                            <PanelResizeHandle className='w-[2px] hover: hover:bg-blue-100' />

                            <Panel className="h-full flex flex-col">
                                <FormPreview elements={formElements} onSubmit={onSave} 
                                onControlUpdate={setFormElements}
                                />
                            </Panel>
                        </PanelGroup>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default TemplateBuilder;