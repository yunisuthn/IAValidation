import React, { useRef, useState } from 'react'
import { makeReadable } from '../../utils/utils';

const Input = React.memo(({label = '', id, value = '', defaultValue = '', onInput, onFocus, onBlur, ...props}) => {

    const [val, setVal] = useState(value);
    const ref = useRef(null);

    function handleChange(newVal) {
        setVal(newVal)
        onInput && onInput(id, newVal);
    }

    function handleFocus() {
        onFocus && onFocus(val);
        setTimeout(() => {
            ref.current?.focus();
        }, 10)
    }

    function handleBlur() {
        onBlur && onBlur('');
    }
    
    return (
        <div className='input__form'>
            <label htmlFor={id}>{makeReadable(label)}</label>
            <input
                ref={ref}
                id={id}
                class="form_controller"
                name={label}
                {...props}
                value={val}
                onChange={(e) => handleChange(e.currentTarget.value)}
                autoComplete='off'
                autoCorrect='off'
                onClick={handleFocus}
                onBlur={handleBlur}
            />
        </div>
    )
})

export default Input