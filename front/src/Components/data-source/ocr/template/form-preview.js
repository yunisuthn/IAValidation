import React, { useMemo } from 'react';
import { TextField, NumberField, TimeField, DateField, PickListField, CheckboxField, ImageField, MultiPickListField, NumericField, DroppableNumericField } from '../fields';
import { DragDropContext } from '@hello-pangea/dnd';
import { Add, AddCircleOutline, Close, RemoveCircleOutline } from '@mui/icons-material';
import { deleteObjectFoundByName, replaceObjectFoundByName } from '../../../../utils/utils';


const FieldGroup = ({ field, onChange, onControlUpdate, onAddField, onDeleteField, ...props }) => {
    // Process fields only once per render
    const processedFields = useMemo(() => 
        field.elements?.map((subElement, index) => ({
            ...subElement,
            isControlled: index !== 0 && field.controlled === "true" ? "true" : "false"
        })), 
        [field.elements, field.controlled]
    );

    return (
        <fieldset
            className={`m-0 ${field.display === "inline" ? 
                "flex gap-4 items-start justify-between flex-wrap" : 
                "space-y-1"} !border !border-dotted px-1 group-[field]:focus-within:bg-green-300 relative w-full`}
        >
            <legend className="text-sm font-semibold text-gray-700 justify-between flex mb-1 group-focus-within:text-red-600">
                <span>{field.label}:</span>
            </legend>
            {/* Render Fields */}
            <div className={field.display === "inline" ? 
                "flex gap-4 items-center justify-between flex-wrap" : 
                "space-y-4"}
            >
                {processedFields?.map((subField, index) => (
                    <OCRTemplateFieldRenderer
                        key={index}
                        field={subField}
                        onChange={onChange}
                        onAddField={onAddField}
                        onDeleteField={onDeleteField}
                        onControlUpdate={onControlUpdate}
                        {...props}
                    />
                ))}
            </div>

            {/* Add New Field Button */}
            {field.controlled === "true" && (
                <button
                    type="button"
                    onClick={() => onAddField?.(field)}
                    className="flex items-center text-sm gap-2 text-blue-400 hover:bg-blue-100 px-2 py-1 rounded-none bg-blue-50 transition-colors duration-200"
                    title={`Add new fields for ${field.label}`}
                >
                    <AddCircleOutline fontSize="small" />
                    <span className="line-clamp-1 text-left">Add new fields for {field.label}</span>
                </button>
            )}
        </fieldset>
    );
};

// HOC
const withRemovable = (WrappedXField) => {

    return function RemovableXField({ onDeleteField, ...props}) {
        const { field } = props;

        return (
            <div className="relative w-full flex items-stretch justify-between">
                <div className="bg-amber-50">

                    <button
                        type="button"
                        onDoubleClick={() => onDeleteField?.(field)}
                        className="flex items-center text-sm gap-2 text-amber-300 hover:text-amber-500 px-2 py-1 rounded-none transition-colors duration-200"
                        title={`Double click to remove field ${field.label}`}
                    >
                        <RemoveCircleOutline fontSize="small" />
                    </button>
                </div>
                <WrappedXField {...props} />
            </div>
        )
    }

}

// Map field types to components (OCP applied)
const fieldComponents = {
    text: TextField,
    number: NumberField,
    numeric: DroppableNumericField,
    time: TimeField,
    date: DateField,
    picklist: PickListField,
    multipicklist: MultiPickListField,
    checkbox: CheckboxField,
    image: ImageField,
    group:FieldGroup
};

export function OCRTemplateFieldRenderer({ field, onChange, onControlUpdate, onAddField, onDeleteField, ...rest }) {

    // implement removable if field is controlled
    const Component = field.isControlled === "true" ?
        withRemovable(fieldComponents[field.type]) :
        fieldComponents[field.type];

    
    const handleAddSubField = (field) => {
        // get last element child
        const { elements } = field;
        const length = elements.length;
        const lastElement = elements[length - 1];

        // clone last element 
        const newElement = JSON.parse(JSON.stringify(lastElement));

        // Calculate the next index
        const newIndex = length + 1;

        // Function to recursively update names inside the object
        function updateKeys(obj, oldIndex, newIndex) {
            if (typeof obj === "object" && obj !== null) {
                for (const key in obj) {
                    if (typeof obj[key] === "string") {
                        // Update the name if it contains the old index
                        obj[key] = obj[key].replace(oldIndex, newIndex);
                    } else {
                        // Recursively update nested objects and arrays
                        updateKeys(obj[key], oldIndex, newIndex);
                    }
                }
            }
        }

        // Find the old index (assuming it’s the last part of the name)
        const oldIndex = length.toString();

        // Apply the updates recursively
        updateKeys(newElement, oldIndex, newIndex.toString());


        const newField = JSON.parse(JSON.stringify(field));
        newField.elements.push(newElement);
        onControlUpdate?.(prev =>
            replaceObjectFoundByName(prev, field.name, newField)
        );

        console.log(typeof onControlUpdate)

    }

    // method to delete field (object)
    const handleDeleteSubField = (field) => {
        onControlUpdate?.(prev =>
            deleteObjectFoundByName(prev, field.name)
        );
    }
    
    if (!Component) {
        console.warn("Unsupported field :" + field.type)
        return null;
    };


    return <Component
        field={field}
        onChange={onChange}
        onAddField={handleAddSubField}
        onDeleteField={handleDeleteSubField}
        onControlUpdate={onControlUpdate}
        {...rest}
    />;
}


export function FormPreview({ elements, onControlUpdate }) {

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
                                    <OCRTemplateFieldRenderer
                                        key={index} field={element}
                                        onControlUpdate={onControlUpdate}
                                    />
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