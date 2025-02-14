import { Draggable, Droppable } from '@hello-pangea/dnd';
import React, { useEffect, useRef, useState } from 'react';
import { useClickAway } from 'use-click-away';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, isValid } from 'date-fns';
import { Button } from '@mui/material';
import { Close, PhotoCamera } from '@mui/icons-material';
import { removeCapturedSketches } from '../../redux/sketchReducer';
import { useDispatch, useSelector } from 'react-redux';
import unitsData from './../../../data-sources-json/units-measurements.json';

export const AutoHeightTextarea = ({ value = '', onUpdate, className = '', ...props }) => {
    const textareaRef = useRef(null);
    const [val, setVal] = useState(value);

    useEffect(() => {
        setVal(value);
    }, [value]);

    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto'; // Reset height to recalculate
            textarea.style.height = `${textarea.scrollHeight}px`; // Set to content height
        }
    }, [val, textareaRef]);

    const handleInputChange = (event) => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto'; // Reset height to recalculate
            textarea.style.height = `${textarea.scrollHeight}px`; // Set to content height
            setVal(event.target.value);
            if (onUpdate) {
                onUpdate(event.target.value);
            }
        }
    };

    return (
        <textarea
            ref={textareaRef}
            value={val}
            rows={1}
            onChange={handleInputChange}
            className={`resize-none overflow-hidden ${className}`}
            style={{ height: 'auto' }}
            {...props}
        />
    );
};


export const TextField = ({ field, groupment = '', onChange, onClick, active }) => {

    const [editing, setEditing] = useState(false);
    const divRef = useRef(null);
    const [value, setValue] = useState([]);

    useEffect(() => {
        if (Array.isArray(field.value)) {
            setValue(field.value.length > 0 ? field.value : ["empty"]) // create empty value
        } else {
            setValue([""]);
        }
    }, [field.value]);

    useClickAway(divRef, () => setEditing(false));

    const inputID = groupment + field.name;


    function handleEditing() {
        if (value.length === 0)
            setValue(['']);
        setEditing(true)
    }

    return (
        <Droppable droppableId={field.name ?? Date.now().toString()}>
            {
                (provided, snapshot) => (
                    <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className={`w-full flex flex-col gap-1 border border-transparent ${snapshot.isDraggingOver ? 'border-indigo-300' : 'border-gray-200'} bg-white`}
                    >
                        {
                            field.label &&
                            <label style={{ textTransform: 'none' }} className={`font-semibold text-sm ${snapshot.isDraggingOver ? 'text-indigo-500' : 'text-gray-800'}`}>
                                {field.label}:
                            </label>
                        }
                        <div ref={divRef} className={`w-full ${editing ? 'h-auto' : 'min-h-[30px]'} flex flex-col border border-[#ccc] focus-within:outline focus-within:outline-1 focus-within:outline-blue-300`} onDoubleClick={handleEditing}>
                            {
                                value?.map((val, idx) => !editing ? (
                                    <Draggable
                                        key={`${field.name}-${idx}`}
                                        draggableId={`${field.name}-${idx}`}
                                        index={idx}
                                    >
                                        {(provided, snapshot) => (
                                            <p
                                                onClick={() => onClick?.(val)}
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                className={`${active?.id === val.id ? 'bg-white hover:bg-indigo-50' : 'bg-white hover:border-indigo-100 hover:bg-indigo-50'} flex items-start gap-1 px-2 mx-0 my-auto text-sm text-slate-900 whitespace-break-spaces ${snapshot.isDragging ? 'bg-indigo-50 border-indigo-100 line-clamp-3' : ''} `}
                                            >{val.value}</p>
                                        )}
                                    </Draggable>
                                ) : (
                                    <AutoHeightTextarea
                                        autoFocus
                                        key={idx}
                                        name={field.name}
                                        value={val.value}
                                        className='form_controller w-full text-sm py-0 outline-none border border-dotted'
                                        onUpdate={(value) => {
                                            onChange?.(inputID, value, idx);
                                        }}
                                    />
                                ))
                            }
                            {/* Drag placeholder */}
                            {provided.placeholder}
                        </div>
                    </div>
                )
            }
        </Droppable>
    )
}



export const NumberField = ({ field, groupment = '', onChange }) => {

    const [value, setValue] = useState("");

    useEffect(() => {
        setValue(field.value ?? "");
    }, [field.value]);

    const inputID = groupment + field.name;

    return (
        <div className={`ar-form-group ${field.display}`}>
            <label htmlFor={inputID} className='text-sm'>{field.label} {field.unit && <span>({field.unit})</span>}:</label>
            <input
                id={inputID}
                type='number'
                className='form_controller'
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


export const TimeField = ({ field, groupment = '', onChange }) => {

    const [value, setValue] = useState("");

    useEffect(() => {
        setValue(field.value ?? "");
    }, [field.value])

    const inputID = groupment + field.name;

    return (
        <div className={`ar-form-group ${field.display}`}>
            <label htmlFor={inputID} className='text-sm'>{field.label}</label>
            <input
                id={inputID}
                type='time'
                className='form_controller'
                name={inputID}
                value={value ?? ""}
                onChange={(e) => {
                    setValue(e.target.value);
                    onChange?.(inputID, e.target.value);
                }}
            />
        </div>
    )
};

export const NumericField = ({ field, groupment = "", onChange }) => {
    const [value, setValue] = useState("");

    useEffect(() => {
        setValue(field.value ?? "");
    }, [field.value]);

    const inputID = groupment + field.name;

    // Allowed characters regex: numbers + "-", "'", "é", '"', ",", ".", "²"
    const allowedPattern = /^[0-9\-\sé",.²]*$/;

    const handleInputChange = (e) => {
        const newValue = e.target.value;
        if (allowedPattern.test(newValue)) {
            setValue(newValue);
            onChange?.(inputID, newValue);
        }
    };

    return (
        <div className={`ar-form-group ${field.display}`}>
            <label htmlFor={inputID} className="text-sm">{field.label} {field.unit && <span>({field.unit})</span>}</label>
            <input
                id={inputID}
                type="text"
                className="form_controller"
                name={inputID}
                value={value}
                onChange={handleInputChange}
            />
        </div>
    );
};



export const CheckboxField = ({ field, groupment, onChange }) => {

    const [value, setValue] = useState(false);

    useEffect(() => {
        setValue(field.value ?? false);
    }, [field.value])

    const inputID = groupment + field.name;

    return (
        <div className={`ar-form-group ${field.display}`}>
            <label htmlFor={inputID} className='text-sm'>{field.label}</label>
            <input
                id={inputID}
                type='checkbox'
                className='form_controller-check'
                name={inputID}
                checked={value}
                onChange={(e) => {
                    setValue(e.target.checked);
                    onChange?.(inputID, e.target.checked);
                }}
            />
        </div>
    )
};

export const PickListField = ({ field, groupment = '', onChange, multiple = false }) => {
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
                className='form_controller'
                onChange={(e) => {
                    setValue(e.target.value);
                    onChange?.(inputID, e.target.value)
                }}
                value={value}
                {...(multiple) && { multiple: true }}
            >
                {field.options?.map((option, idx) => (
                    <option key={idx} value={option} {...(value === option) && { selected: true }}>
                        {option}
                    </option>
                ))}
            </select>
            {/* {
                value === field.fallback?.target && (
                    <DynamicField field={field.fallback} />
                )
            } */}
        </>
    )

    return field.label ? (
        <div className={`ar-form-group ${field.display}`}>
            <label htmlFor={inputID} className='text-sm'>{field.label}</label>
            {selectInput}
        </div>
    ) : (
        selectInput
    );
}


export const MultiPickListField = ({ field, groupment = '', onChange }) => {
    const [value, setValue] = useState([]);

    useEffect(() => {
        setValue(Array.isArray(field.value) ? field.value : []);
    }, [field.value])

    const inputID = groupment + field.name;

    return (
        <div className={`ar-form-group ${field.display}`}>
            <label htmlFor={inputID} className='text-sm'>{field.label}</label>

            <select
                id={inputID}
                name={inputID}
                className='form_controller w-full'

                onChange={(e) => {
                    console.log("changed")
                    const selected = Array.from(e.target.selectedOptions, (option) => option.value)
                    console.log(selected)
                    setValue(selected);
                    onChange?.(inputID, selected)
                }}
                value={value}
                multiple
            >
                {field.options?.map((option, idx) => (
                    <option key={idx} value={option} {...(value === option) && { selected: true }}>
                        {option}
                    </option>
                ))}
            </select>
        </div>
    )
}


export const DateField = ({ field, groupment = "", onChange }) => {
    const [value, setValue] = useState(null); // Use `null` for compatibility with react-datepicker

    useEffect(() => {
        const convertToDate = (dateStr) => {
            const [day, month, year] = dateStr.split("/").map(Number);
            return new Date(year, month - 1, day); // Month is 0-based
        };
        if (!field.value) {
            setValue(null);
            return;
        }
        let date = convertToDate(field.value);
        if (isValid(date))
            setValue(date);
        else
            setValue(null)

    }, [field.value])

    const inputID = groupment + field.name;
    const dateFormat = field.format || "yyyy-MM-dd";

    return (
        <div className={`ar-form-group ${field.display}`}>
            {field.label && <label htmlFor={inputID} className='text-sm'>{field.label}</label>}
            <DatePicker
                id={inputID}
                name={inputID}
                selected={value}
                onChange={(date) => {
                    setValue(date)
                    onChange?.(inputID, format(date, dateFormat))
                }}
                placeholderText={dateFormat}
                dateFormat={dateFormat} // Customize the date format as needed
                className="form_controller" // Add your custom class for styling
            />
        </div>
    );
};


export const ImageField = ({ field, groupment = '', onStartCapture, onChange }) => {

    const [value, setValue] = useState(false);
    const { images } = useSelector((state) => state.sketch);
    // redux
    const dispatch = useDispatch();

    const inputID = groupment + field.name;

    useEffect(() => {
        console.log(images)
        let image = images.find(i => i.key === field.name);
        if (image) {
            setValue(image.url);
            onChange?.(inputID, image.url);
        } else {
            setValue('')
        }
    }, [images, field.name, inputID]);


    async function handleClick() {
        await onStartCapture?.(field.name);
    }

    function handleRemoveImage() {
        dispatch(removeCapturedSketches({ key: field.name }))
        setValue("");
    }

    return (
        <div className='ar-form-group flex-col'>
            <label htmlFor={inputID} className='block text-sm font-medium text-gray-700 mb-1'>{field.label}</label>
            {
                !value ? (
                    <div className="mt-1 w-full flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed hover:border-gray-400 transition-colors duration-200">
                        <div className="space-y-1 text-center">
                            <svg
                                className="mx-auto h-12 w-12 text-gray-400"
                                stroke="currentColor"
                                fill="none"
                                viewBox="0 0 48 48"
                                aria-hidden="true"
                            >
                                <path
                                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                            <div className="flex text-sm text-gray-600">
                                <label className="relative w-full cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                                    <button type='button' onClick={handleClick} className='mx-auto text-center'>Start Capture</button>
                                </label>
                            </div>
                            <p className="text-xs text-gray-500">Image viewer for {field.label}</p>
                        </div>
                    </div>
                ) : (
                    <div className="w-full flex flex-col flex-grow gap-1 items-start px-2 border">
                        <img src={value} alt="" className="w-full object-contain h-full max-h-16" />
                        <div className="w-full flex items-center gap-1">
                            <Button variant='outlined' size='small' className='w-fit ml-auto'
                                onClick={handleClick}
                            >
                                <PhotoCamera fontSize='small' />
                            </Button>
                            {
                                value &&
                                <Button variant='outlined' color="warning" size='small' className='w-fit ml-auto'
                                    onClick={handleRemoveImage}
                                >
                                    <Close fontSize='small' />
                                </Button>
                            }
                        </div>
                    </div>
                )
            }
        </div>
    )
};

export const DroppableNumericField = ({ field, groupment = "", onChange, onClick, active }) => {
    const [editing, setEditing] = useState(false);
    const divRef = useRef(null);
    const [value, setValue] = useState([]);

    useEffect(() => {
        if (Array.isArray(field.value)) {
            setValue(field.value.length > 0 ? field.value : ["empty"]);
        } else {
            setValue([""]);
        }
    }, [field.value]);

    useClickAway(divRef, () => setEditing(false));

    const inputID = groupment + field.name;

    const allowedPattern = /^[0-9\-\sé"',.²]*$/;

    function handleEditing() {
        if (value.length === 0) setValue([""]);
        setEditing(true);
    }

    return (
        <Droppable droppableId={field.name ?? Date.now().toString()}>
            {(provided, snapshot) => (
                <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={`w-full flex justify-between gap-5 border border-transparent ${
                        snapshot.isDraggingOver ? "border-indigo-300" : "border-gray-200"
                    } bg-white`}
                >
                    {field.label && (
                        <label
                            style={{ textTransform: "none" }}
                            className={`font-semibold text-nowrap text-sm ${
                                snapshot.isDraggingOver ? "text-indigo-500" : "text-gray-800"
                            }`}
                        >
                            {field.label}:
                        </label>
                    )}
                    <div
                        ref={divRef}
                        className={`w-full ${
                            editing ? "h-auto" : "min-h-[30px]"
                        } flex flex-col border border-[#ccc] focus-within:outline focus-within:outline-1 focus-within:outline-blue-300 max-w-60`}
                        onDoubleClick={handleEditing}
                    >
                        {value?.map((val, idx) =>
                            !editing ? (
                                <Draggable
                                    key={`${field.name}-${idx}`}
                                    draggableId={`${field.name}-${idx}`}
                                    index={idx}
                                >
                                    {(provided, snapshot) => (
                                        <p
                                            onClick={() => onClick?.(val)}
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            className={`${
                                                active?.id === val.id
                                                    ? "bg-white hover:bg-indigo-50"
                                                    : "bg-white hover:border-indigo-100 hover:bg-indigo-50"
                                            } flex items-start gap-1 px-2 mx-0 my-auto text-sm text-slate-900 whitespace-break-spaces ${
                                                snapshot.isDragging
                                                    ? "bg-indigo-50 border-indigo-100 line-clamp-3"
                                                    : ""
                                            } `}
                                        >
                                            {val.value}
                                        </p>
                                    )}
                                </Draggable>
                            ) : (
                                <input
                                    autoFocus
                                    key={idx}
                                    type="text"
                                    name={field.name}
                                    value={val.value}
                                    className="form_controller w-full text-sm py-0 outline-none border border-dotted"
                                    onChange={(e) => {
                                        if (allowedPattern.test(e.target.value)) {
                                            onChange?.(inputID, e.target.value, idx);
                                        }
                                    }}
                                />
                            )
                        )}
                        {/* Drag placeholder */}
                        {provided.placeholder}
                    </div>
                </div>
            )}
        </Droppable>
    );
};