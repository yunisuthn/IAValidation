import React from 'react';
import { TextField, NumberField, TimeField, DateField, PickListField, CheckboxField, ImageField, MultiPickListField } from '../fields';
import { DragDropContext } from '@hello-pangea/dnd';

// Map field types to components (OCP applied)
const fieldComponents = {
    text: TextField,
    number: NumberField,
    time: TimeField,
    date: DateField,
    picklist: PickListField,
    multipicklist: MultiPickListField,
    checkbox: CheckboxField,
    image: ImageField,
    group: ({ field, onChange, ...props }) => (
        <fieldset className={`m-0 ${field.display === 'inline' ? 'flex gap-4 items-start justify-between flex-wrap' : 'space-y-1'} !border !border-dotted px-1`}>
            <legend className="block text-sm font-medium text-gray-700 mb-1">{field.label}:</legend>
            <div className={field.display === 'inline' ? 'flex gap-4 items-center justify-between flex-wrap' : 'space-y-4'}>
                {field.elements?.map((subElement, index) => (
                    <OCRTemplateFieldRenderer key={index} field={subElement} onChange={onChange} {...props}  />
                ))}
            </div>
        </fieldset>
    ),
};

export function OCRTemplateFieldRenderer({ field, onChange, ...rest }) {
    const Component = fieldComponents[field.type];
    
    if (!Component) {
        console.warn("Unsupported field :" + field.type)
        return null;
    };

    return <Component field={field} onChange={onChange} {...rest} />;
}

export function FormPreview({ elements }) {
    
    return (
        <DragDropContext>
            <div className="bg-white rounded-lg shadow-sm py-6 flex-grow flex flex-col border">
                <h2 className="text-lg font-bold mb-2 text-slate-700 px-6">Form Preview</h2>
                <div className="h-full w-full relative overflow-y-auto">
                    <div className="absolute inset-0 p-6">
                        {elements.length === 0 ? (
                            <div className="text-center py-12 text-slate-500">
                                <p>No fields added yet.</p>
                                <p className="text-sm mt-2">Add some fields to see the preview here.</p>
                            </div>
                        ) : (
                            <form className="space-y-4">
                                {elements.map((element, index) => (
                                    <OCRTemplateFieldRenderer key={index} field={element} />
                                ))}
                            </form>
                        )}
                    </div>
                </div>
                <div className="bg-white h-6 w-full" />
            </div>
        </DragDropContext>
    );
}