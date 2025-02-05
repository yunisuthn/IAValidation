import React from 'react';
import { TextField, NumberField, TimeField, DateField, PickListField, CheckboxField, ImageField, MultiPickListField } from '../fields';
import { DragDropContext } from '@hello-pangea/dnd';

export function FormPreview({ elements }) {
    
    const renderElement = (element) => {
        switch (element.type) {
            case 'group':
                return (
                    <fieldset className={`mb-6 ${element.display === 'inline' ? 'flex gap-4 items-start' : 'space-y-4'}`}>
                        <legend className="block text-sm font-medium text-gray-700 mb-1">{element.label}:</legend>
                        <div className={element.display === 'inline' ? 'flex gap-4 flex-wrap' : 'space-y-4'}>
                            {element.elements?.map((subElement, index) => (
                                <div key={index} className={element.display === 'inline' ? 'flex-1 min-w-[200px]' : ''}>
                                    {renderElement(subElement)}
                                </div>
                            ))}
                        </div>
                    </fieldset>
                );

            case 'text':
                return (
                    <TextField field={{...element, value: ['']}} />
                );
            case 'number':
                return (
                    <NumberField field={element} />
                );

            case 'time':
                return (
                    <TimeField field={element} />
                );
            case 'date':
                return (
                    <DateField field={element} />
                );

            case 'picklist':
                return (
                    <PickListField field={element} />
                );

            case 'multipicklist':
                return (
                    <MultiPickListField field={element} />
                );

            case 'checkbox':
                return (
                    <CheckboxField field={element} />
                );

            case 'image':
                return (
                    <ImageField field={element} />
                );

            default:
                return null;
        }
    };

    return (
        
        <DragDropContext>
            <div className="bg-white rounded-lg shadow-sm py-6 flex-grow border">
                <h2 className="text-lg font-bold mb-6 text-slate-700 px-6">Form Preview</h2>
                <div className='h-full relative overflow-y-auto'> 
                    <div className="absolute inset-6">
                        {elements.length === 0 ? (
                            <div className="text-center py-12 text-slate-500">
                                <p>No fields added yet.</p>
                                <p className="text-sm mt-2">Add some fields to see the preview here.</p>
                            </div>
                        ) : (
                            <form className="space-y-4">
                                {elements.map((element, index) => (
                                    <div key={index}>{renderElement(element)}</div>
                                ))}
                                
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </DragDropContext>
    );
}