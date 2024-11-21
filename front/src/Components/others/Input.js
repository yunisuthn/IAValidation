import React, { useEffect, useRef, useState } from 'react'
import { makeReadable } from '../../utils/utils';
import { useFloating, autoUpdate, offset, flip, shift } from '@floating-ui/react-dom';

const Input = React.memo(({label = '', id, value = '', defaultValue = '', onInput, onFocus, onBlur, isInvalid = false, suggestions=[], ...props}) => {

    const [val, setVal] = useState(value);
    const ref = useRef(null);
    const [invalidInput, setInvalidInput] = useState(isInvalid);
    const [sugges, setSugges] = useState(suggestions);
    const [openSuggestion, setOpenSuggestion] = useState(false);
    const { refs, floatingStyles } = useFloating({
        placement: 'bottom-end', // Adjust placement as needed
        middleware: [
            offset(4), // Adds space between the input and popup
            flip(), // Ensures the popup stays visible when near the viewport edges
            shift({ padding: 4 }) // Prevents the popup from overflowing the viewport
        ],
        whileElementsMounted: autoUpdate // Updates position on scroll, resize, or DOM changes
    });

    useEffect(() => {
        setVal(value);
        setInvalidInput(isInvalid);
        setSugges(suggestions.filter(s => s !== value));
    }, [value, isInvalid, suggestions]);


    function handleChange(newVal) {
        setVal(newVal)
        onInput && onInput(id, newVal);
    }

    function handleFocus() {
        onInput && onInput(id, val);
        setTimeout(() => {
            onFocus && onFocus(id, val);
        }, 10);
        setOpenSuggestion(true);
    }

    function handleBlur() {
        setTimeout(() => {
            onBlur && onBlur('');
            setOpenSuggestion(false);
        }, 500);
    }

    const handleUseSuggestion = (value) => {
        setOpenSuggestion(false);
        onInput && onInput(id, value);
    }
    
    return (
        <div className='grid items-center grid-cols-3 input__form place-items-start'>
            {
                label && <label className='col-span-1' htmlFor={id}>{makeReadable(label)}:</label>
            }
            <div ref={refs.setReference}  className={`w-full flex items-stretch col-span-2 relative`}>
                <input
                    ref={ref}
                    id={id}
                    className={`w-full col-span-2 form_controller ${invalidInput ? '!border-rose-600 focus:!outline-rose-300' : ''}`}
                    name={label}
                    {...props}
                    value={val}
                    onChange={(e) => handleChange(e.currentTarget.value)}
                    autoComplete='off'
                    autoCorrect='off'
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                />
                {
                    (openSuggestion && sugges.length !== 0) && 
                    <div
                        ref={refs.setFloating} 
                        style={floatingStyles} 
                        className='absolute top-0 right-0 p-2 bg-white border border-[#ccc] shadow-lg z-50'
                    >
                        {
                            sugges.map((sugg, index) => (
                                <div
                                    key={index}
                                    className='text-sm text-green-600 hover:bg-green-200 hover:cursor-pointer p-1'
                                    onClick={() => handleUseSuggestion(sugg)}
                                >{sugg}</div>
                            )) 
                        }
                    </div>
                }
            </div>
        </div>
    )
}, (prevProps, nextProps) => {
    // Only re-render if `value` or other critical props change
    return (prevProps.value === nextProps.value && prevProps.id === nextProps.id && nextProps.onFocus === prevProps.onFocus
        && nextProps.isInvalid === prevProps.isInvalid
        && nextProps.suggestions === prevProps.suggestions
    );
})

export default Input