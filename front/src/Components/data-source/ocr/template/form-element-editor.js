import React from 'react';
import { DeleteOutline, Add, DragIndicator} from '@mui/icons-material'

export function FormElementEditor({ element, onUpdate, onDelete, level = 0 }) {
    const handleChange = (field, value) => {
        onUpdate({ ...element, [field]: value });
    };

    const handleAddSubElement = () => {
        const newElements = [...(element.elements || []), {
            name: '',
            label: '',
            type: 'text'
        }];
        onUpdate({ ...element, elements: newElements });
    };

    const handleUpdateSubElement = (index, updated) => {
        const newElements = [...(element.elements || [])];
        newElements[index] = updated;
        onUpdate({ ...element, elements: newElements });
    };

    const handleDeleteSubElement = (index) => {
        const newElements = [...(element.elements || [])];
        newElements.splice(index, 1);
        onUpdate({ ...element, elements: newElements });
    };

    return (
        <div className={`bg-white rounded-lg border border-gray-200 shadow-sm transition-all duration-200 hover:shadow-md ${level > 0 ? 'ml-6' : ''}`}>
            <div className="p-2">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <span className="text-gray-400 cursor-move">
                            <DragIndicator fontSize='small' />
                        </span>
                        <h3 className="text-sm font-semibold text-gray-900">
                            {element.label || 'New Field'}
                        </h3>
                    </div>
                    <button
                        onClick={onDelete}
                        className="text-gray-400 hover:text-red-500 transition-colors duration-200"
                        title="Delete field"
                    >
                        <DeleteOutline fontSize='small' />
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">

                    <div>
                        <label className="ocr-template__form-label">
                            Label
                        </label>
                        <input
                            type="text"
                            value={element.label}
                            onChange={(e) => handleChange('label', e.target.value)}
                            className="ocr-template__form-control"
                            placeholder="Enter label text"
                        />
                    </div>

                    <div>
                        <label className="ocr-template__form-label">
                            Field Name
                        </label>
                        <input
                            type="text"
                            value={element.name}
                            onChange={(e) => {
                                const newValue = e.target.value.replace(/[^a-z0-9-_]/g, '');
                                handleChange('name', newValue);
                            }}
                            className="ocr-template__form-control"
                            placeholder="Enter field name"
                        />
                    </div>

                    <div>
                        <label className="ocr-template__form-label">
                            Field Type
                        </label>
                        <select
                            value={element.type}
                            onChange={(e) => handleChange('type', e.target.value)}
                            className="ocr-template__form-control"
                        >
                            <option value="text">Text</option>
                            <option value="number">Number</option>
                            <option value="date">Date</option>
                            <option value="time">Time</option>
                            <option value="picklist">Picklist</option>
                            <option value="multipicklist">Multicklist</option>
                            <option value="checkbox">Checkbox</option>
                            <option value="group">Group</option>
                            <option value="image">Image</option>
                        </select>
                    </div>

                    {element.type === 'picklist' && (
                        <div className="md:col-span-2">
                            <label className="ocr-template__form-label">
                                Options (comma-separated)
                            </label>
                            <input
                                type="text"
                                value={element.options?.join(', ') || ''}
                                onChange={(e) => handleChange('options', e.target.value.split(',').map(s => s.trim()))}
                                className="ocr-template__form-control"
                                placeholder="Option 1, Option 2, Option 3"
                            />
                        </div>
                    )}
                    
                    {element.type === 'multipicklist' && (
                        <div className="md:col-span-2">
                            <label className="ocr-template__form-label">
                                Options (comma-separated)
                            </label>
                            <input
                                type="text"
                                value={element.options?.join(', ') || ''}
                                onChange={(e) => handleChange('options', e.target.value.split(',').map(s => s.trim()))}
                                className="ocr-template__form-control"
                                placeholder="Option 1, Option 2, Option 3"
                            />
                        </div>
                    )}

                    {element.type === 'date' && (
                        <div className="">
                            <label className="ocr-template__form-label">
                                Format
                            </label>
                            <select
                                value={element.format || 'yyyy-MM-dd'}
                                onChange={(e) => handleChange('format', e.target.value)}
                                className="ocr-template__form-control"
                            >
                                <option value="yyyy-MM-dd">yyyy-MM-dd (2025-02-04)</option>
                                <option value="dd-MM-yyyy">dd-MM-yyyy (04-02-2025)</option>
                                <option value="MM-dd-yyyy">MM-dd-yyyy (02-04-2025)</option>
                                <option value="yyyy/MM/dd">yyyy/MM/dd (2025/02/04)</option>
                                <option value="dd/MM/yyyy">dd/MM/yyyy (04/02/2025)</option>
                                <option value="MM/dd/yyyy">MM/dd/yyyy (02/04/2025)</option>
                                <option value="yyyy.MM.dd">yyyy.MM.dd (2025.02.04)</option>
                                <option value="dd.MM.yyyy">dd.MM.yyyy (04.02.2025)</option>
                                <option value="MM.dd.yyyy">MM.dd.yyyy (02.04.2025)</option>
                                <option value="dd MMMM yyyy">dd MMMM yyyy (04 February 2025)</option>
                                <option value="MMMM dd, yyyy">MMMM dd, yyyy (February 04, 2025)</option>
                                <option value="yyyy-MM-dd HH:mm:ss">yyyy-MM-dd HH:mm:ss (2025-02-04 14:30:00)</option>
                                <option value="dd/MM/yyyy HH:mm:ss">dd/MM/yyyy HH:mm:ss (04/02/2025 14:30:00)</option>
                                <option value="MM/dd/yyyy HH:mm:ss">MM/dd/yyyy HH:mm:ss (02/04/2025 14:30:00)</option>
                            </select>
                        </div>
                    )}

                    {element.type === 'group' && (
                        <div className="md:col-span-2">
                            <label className="ocr-template__form-label">
                                Display Mode
                            </label>
                            <select
                                value={element.display || 'block'}
                                onChange={(e) => handleChange('display', e.target.value)}
                                className="ocr-template__form-control"
                            >
                                <option value="block">Block</option>
                                <option value="inline">Inline</option>
                            </select>
                        </div>
                    )}
                </div>

                {element.type === 'group' && (
                    <div className="mt-6 border-t pt-4">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="text-sm font-semibold text-gray-700">Sub Elements</h4>
                            <button
                                onClick={handleAddSubElement}
                                className="flex items-center text-sm gap-2 bg-gray-100 text-gray-700 px-3 py-2 rounded-md hover:bg-gray-200 transition-colors duration-200"
                            >
                                <Add fontSize='small' /> Add Sub-field
                            </button>
                        </div>
                        <div className="space-y-4">
                            {element.elements?.map((subElement, index) => (
                                <FormElementEditor
                                    key={index}
                                    element={subElement}
                                    onUpdate={(updated) => handleUpdateSubElement(index, updated)}
                                    onDelete={() => handleDeleteSubElement(index)}
                                    level={level + 1}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}