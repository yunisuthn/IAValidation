import React, { useState } from 'react'
import { makeReadable } from '../../utils/utils';

const Input = ({label = '', id, value = '', defaultValue = '', ...props}) => {

    const [val, setVal] = useState(value);
    
    return (
        <div className='input__form'>
            <label htmlFor={id}>{makeReadable(label)}</label>
            <input
                id={id}
                class="form_controller"
                {...props}
                value={val}
                onChange={(e) => setVal(e.currentTarget.value)}
            />
        </div>
    )
}

export default Input