import React, { useState } from 'react'
import { makeReadable } from '../../utils/utils';

const Input = ({label = '', id, value = '', defaultValue = '', onInput, ...props}) => {

    const [val, setVal] = useState(value);

    function handleChange(newVal) {
        setVal(newVal)
        onInput && onInput(id, newVal);
    }
    
    return (
        <div className='input__form'>
            <label htmlFor={id}>{makeReadable(label)}</label>
            <input
                id={id}
                class="form_controller"
                name={label}
                {...props}
                value={val}
                onChange={(e) => handleChange(e.currentTarget.value)}
                autoComplete='off'
            />
        </div>
    )
}

export default Input