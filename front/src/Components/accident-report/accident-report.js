import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import jsonFields from './accient-report-fields.json'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { AutoHeightTextarea } from '../orderable/orderable-value';
import _, { isEqual } from 'lodash';
import { deepMergeArray } from '../../utils/utils';
import { isValid, format} from 'date-fns'

function updateObjectByName(obj, targetName, newValue) {
    return obj.map(item => {
        if (item.name === targetName) {
            return { ...item, value: newValue }; // Return updated item
        }
        if (item.type === "group" && Array.isArray(item.elements)) {
            return { 
                ...item, 
                elements: updateObjectByName(item.elements, targetName, newValue) 
            }; // Recursively update nested groups
        }
        return item; // Return unchanged item
    });
}


const MemoizedDraggableBlock = memo(({ block, index, activeItem, onClick }) => {
    return (
        <Draggable key={block.id} draggableId={block.id.toString()} index={index}>
            {(provided, snapshot) => (
            <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                onClick={onClick}
                className={`
                flex items-start gap-1 p-2 text-sm text-slate-900 whitespace-break-spaces
                ${snapshot.isDragging ? 'bg-indigo-50 !h-auto !line-clamp-2' : ''}
                my-1 border border-indigo-100
                ${activeItem?.id === block.id ? '!bg-blue-50 !border-slate-400' : 'hover:bg-indigo-50 hover:border-indigo-200 bg-white'}
                `.replace(/\n/g, '')}
            >
                {block.value}
            </div>
            )}
        </Draggable>
    );
});

const AccidentReportForm = React.memo(({ hideLeftPanel = false, data, onClick, onUpdate }) => {

    const [formFields, setFormFields] = useState([]);

    const [blockData, setBlockData] = useState([]);
    const activeItemLocal = localStorage.getItem('ar_active_item') || '{}';
    const [activeItem, setActiveItem] = useState(() => JSON.parse(activeItemLocal));

    const memoizedData = useMemo(() => data, [data]);
    const memoizedOnClick = (block) => {
        setActiveItem(block);
        onClick?.(block);
    };

    useEffect(() => {
        if (Array.isArray(memoizedData.OCR))
            setBlockData(memoizedData.OCR);
        const mergedData = deepMergeArray(jsonFields, memoizedData.OCRData);
        console.log(mergedData);
        setFormFields(mergedData);
    }, [memoizedData]);




    const handleDragEnd = (result) => {
        if (!result.destination) return;

        const { source, destination, draggableId } = result;

        if (destination.droppableId === "text-fragments") {
            return; // Do nothing if dropped back into the text list
        }

        const block = blockData[source.index]
        if (block) {
            setFormFields(prev => {
                const updated = updateObjectByName(prev, destination.droppableId, block.value?.trimEnd());
                onUpdate?.(updated);
                return updated;
            });
        }

    };

    
    // Debounce the handleUpdate function with a 300ms delay
    const debouncedHandleUpdate = _.debounce((name, value) => {
        setFormFields(prev => {
            const updated = updateObjectByName(prev, name, value);
            onUpdate?.(updated);
            return updated;
        });
    }, 300);

    // Cleanup the debounced function on component unmount
    React.useEffect(() => {
        return () => {
            debouncedHandleUpdate.cancel(); // Cancel any pending debounced calls
        };
    }, [debouncedHandleUpdate]);

    return (
        <div className='h-full bg-gray-100'>
            <DragDropContext onDragEnd={handleDragEnd}>
                <div className='flex items-stretch flex-grow h-full w-full'>

                    <PanelGroup autoSaveId='ar_panel' direction="horizontal"  className="w-full flex gap-2 flex-grow">
                        { !hideLeftPanel && <Panel className='flex-1'> 
                            {/* Draggable Text Fragments */}
                            <Droppable droppableId="text-fragments" isDropDisabled={true}>
                                {(provided) => (
                                    <div ref={provided.innerRef} {...provided.droppableProps} className="text-list overflow-y-scroll h-full p-2">
                                        {blockData.map((block, index) => (
                                            <MemoizedDraggableBlock
                                                key={block.id}
                                                block={block}
                                                index={index}
                                                activeItem={activeItem}
                                                onClick={() => memoizedOnClick(block)}  // Assuming memoizedOnClick is defined
                                            />
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </Panel> }
                        <PanelResizeHandle className='hover:bg-blue-200 border border-gray-200 hover:w-1' />
                        <Panel className='flex-1'>
                            <div className=" overflow-y-scroll h-full">
                                {
                                    formFields.map((field, index) => (
                                        <DynamicField key={index} field={field} onChange={debouncedHandleUpdate}/>
                                    ))
                                }
                            </div>
                        </Panel>
                    </PanelGroup>
                </div>
            </DragDropContext>
        </div>
    )
},
    (prevProps, nextProps) => {
        return (
        prevProps.hideLeftPanel === nextProps.hideLeftPanel &&
        isEqual(prevProps.data, nextProps.data) && // Deep comparison for `data`
        prevProps.onClick === nextProps.onClick
    );
})

export const ARTextField = ({ field, groupment, onChange }) => {
    const [value, setValue] = useState(field.value || "");
    
    useEffect(() => {
        setValue(field.value || ""); // Update state when field.value changes
    }, [field.value]);

    const inputID = groupment + field.name;

    const inputElement = (
        <AutoHeightTextarea
            rows={1}
            id={inputID}
            className={`ar-input w-full`}
            type='text'
            name={inputID}
            value={value}
            {...(field.length && {
                style: {
                    width: `${field.length + 4}ch`,
                    textAlign: 'center',
                },
                maxLength: field.length,
                placeholder: '_'.repeat(field.length)
            })}
            autoCorrect="off"        // Disables autocorrect
            autoComplete="off"       // Disables autocomplete
            spellCheck="false"       // Disables spellcheck
            onUpdate={(v) => {
                setValue(v);
                onChange?.(inputID, v);
            }}
        />
    );

    return (
        <Droppable droppableId={inputID} isDropDisabled={false} isCombineEnabled={true} >
            {
                (provided, sp) => (
                    <div ref={provided.innerRef} {...provided.droppableProps} >
                        <div className={`ar-form-group p-1 ${sp.isDraggingOver ? 'bg-yellow-100 border border-dashed border-yellow-400 py-2 cursor-grabbing' : ''}`}>
                            { field.label && <label htmlFor={inputID} className='text-sm'>{field.label}</label>}
                            { inputElement }
                        </div>
                        {/* Custom Placeholder */}
                        <div 
                            style={{
                                maxHeight: "1px", // Set fixed height or use dynamic calculation
                                background: "rgba(0, 0, 0, 0.05)", // Light gray background for visibility
                                borderRadius: "4px"
                            }}
                        >
                            {provided.placeholder}
                        </div>
                    </div>
                )
            }
        </Droppable>
    )
};


export const ARDateField = ({ field, groupment, onChange }) => {
    const [value, setValue] = useState(null); // Use `null` for compatibility with react-datepicker

    useEffect(() => {
        const convertToDate = (dateStr) => {
            const [day, month, year] = dateStr.split("/").map(Number);
            return new Date(year, month - 1, day); // Month is 0-based
        };
        if (!field.value) return;
        let date = new Date(field.value);
        if (isValid(date))
            setValue(date);
        else 
            setValue(convertToDate(field.value))

    }, [field.value])

    const inputID = groupment + field.name;
    
    return (
        <div className='ar-form-group'>
            {field.label && <label htmlFor={inputID} className='text-sm'>{field.label}</label>}
            <DatePicker
                id={inputID}
                name={inputID}
                selected={value}
                onChange={(date) => {
                    setValue(date)
                    onChange?.(inputID, format(date, field.format || "dd/MM/yyyy"))
                }}
                placeholderText={(field.format || '').toLocaleUpperCase()}
                dateFormat={(field.format || "yyyy-MM-dd")} // Customize the date format as needed
                className="ar-input" // Add your custom class for styling
                {...(field.size && { size: field.size })} // Pass size if available
            />
        </div>
    );
};


export const ARNumberField = ({ field, groupment, onChange }) => {

    const [value, setValue] = useState("");

    const inputID = groupment + field.name;

    return (
        <div className='ar-form-group'>
            <label htmlFor={inputID} className='text-sm'>{field.label}</label>
            <input
                id={inputID}
                type='number'
                className='ar-input'
                name={inputID}
                value={value}
                onChange={(e) => {
                    setValue(e.target.value);
                    onChange?.(inputID, e.target.value);
                }}
            />
        </div>
    )
};


export const ARTimeField = ({ field, groupment, onChange }) => {

    const [value, setValue] = useState("");

    useEffect(() => {
        setValue(field.value);
        console.log(field.value)
    }, [field.value])
    
    const inputID = groupment + field.name;

    return (
        <div className='ar-form-group'>
            <label htmlFor={inputID} className='text-sm'>{field.label}</label>
            <input
                id={inputID}
                type='time'
                className='ar-input'
                name={inputID}
                value={value}
                onChange={(e) => {
                    setValue(e.target.value);
                    onChange?.(inputID, e.target.value);
                }}
            />
        </div>
    )
};


export const ARCheckboxField = ({ field, groupment, onChange }) => {

    const [value, setValue] = useState(false);
    
    useEffect(() => {
        setValue(field.value);
    }, [field.value])

    const inputID = groupment + field.name;

    return (
        <div className='ar-form-group'>
            <label htmlFor={inputID} className='text-sm'>{field.label}</label>
            <input
                id={inputID}
                type='checkbox'
                className='ar-input-check'
                name={inputID}
                value={value}
                checked={value}
                onChange={(e) => {
                    setValue(e.target.checked);
                    onChange?.(inputID, e.target.checked);
                }}
            />
        </div>
    )
};

export const ARPickListField = ({ field, groupment, onChange }) => {
    const [value, setValue] = useState("");
    
    useEffect(() => {
        setValue(field.value);
    }, [field.value])
    
    const inputID = groupment + field.name;

    const selectInput = (
        <>
            <select
                id={inputID}
                name={inputID}
                className='ar-input'
                onChange={(e) => {
                    setValue(e.target.value);
                    onChange?.(inputID, e.target.value)
                }}
                value={value}
            >
                {field.options.map((option, idx) => (
                    <option key={idx} value={option} {...(value === option) && { selected: true }}>
                        {option}
                    </option>
                ))}
            </select>
            {
                value === field.fallback?.target && (
                    <DynamicField field={field.fallback} />
                )
            }
        </>
    )

    return field.label ? (
        <div className='ar-form-group'>
            <label htmlFor={inputID} className='text-sm'>{field.label}</label>
            {selectInput}
        </div>
    ) : (
        selectInput
    );
}

export const ARGroupField = ({ field, groupment, onChange }) => {
    
    const inputID = groupment + field.name;
    return (
        <fieldset id={inputID} className={`ar-group ${field.display || ''}`}>
            <legend className=''>{field.label}</legend>
            {field.elements.map((element, idx) => (
                <DynamicField key={idx} field={element} groupment={groupment} onChange={onChange} />
            ))}
        </fieldset>
    )
}



/**
 * 
 * FIELDS RENDERERs
 */
const fieldRenderers = {
    text:     (props) => <ARTextField {...props} />,
    number:   (props) => <ARNumberField {...props} />,
    checkbox: (props) => <ARCheckboxField {...props} />,
    time:     (props) => <ARTimeField {...props} />,
    date:     (props) => <ARDateField {...props} />,
    picklist: (props) => <ARPickListField {...props} />,
    group:    (props) => <ARGroupField {...props} />,
};


export const DynamicField = ({ field, groupment='', onChange }) => {

    const FieldComponent = fieldRenderers[field?.type];
    if (!FieldComponent) {
        console.warn("Unsupported field type " + field?.type);
        return null;
    }

    if (Array.isArray(field.groupments)) {
        return (
            <div className='flex flex-col gap-2'>
                {
                    field.groupments.map((group, index) => {
                        return (
                            <div key={index} className='flex flex-col'>
                                <DynamicField field={group} groupment={group.name + '-'} onChange={onChange}/>
                                <FieldComponent field={field} groupment={group.name + '-'} />
                            </div>
                        )
                    })
                }
            </div>
        )
    }

    return <FieldComponent field={field} groupment={groupment} onChange={onChange}/>
}

export default AccidentReportForm