import React, { useEffect, useMemo, useState } from "react";
import { updateCustomerDynamicKeys } from "../../services/customer-service";
import { CircularProgress } from "@mui/material";
import { t } from "i18next";

export const DynamicKeysAddForm = ({ customerId = '67514c02a36d01d14c04de95', onSuccess, formAction='add', currentItem=null, onCancel }) => {
    const [key, setKey] = useState('');
    const [value, setValue] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setLoading] = useState(false);
    
    const cItem = useMemo(() => currentItem, [currentItem]);

    const action = useMemo(() => formAction, [formAction]);

    useEffect(() => {
        setKey(currentItem?.key || '');
    }, [currentItem])


    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await updateCustomerDynamicKeys(customerId, {
                key: action === 'add' ? key : cItem.key,
                ...(action === 'update') && { newKey: key },
                value: value.split(','), // Split value into an array
                action
            }, action);

            setMessage(response.message);
            if (response.customer) onSuccess?.(response.customer.dynamicKeys);    
            setKey('');
            setValue('');
        } catch (error) {
            console.log(error)
            setMessage(error.response?.data?.message || 'An error occurred');
        }

        setTimeout(() => {
            setMessage('')
        }, 5000);
    };

    return (
        <div className="w-full">
            <form onSubmit={handleSubmit}>
                <div className="input__form">
                    <label htmlFor="key">Key<span className="text-rose-600">*</span>:</label>
                    <input
                        className="form_controller text-base"
                        type="text"
                        id="key"
                        value={key}
                        onChange={(e) => setKey(e.target.value.toLowerCase())}
                        required
                    />
                </div>
                <div className="input__form">
                    <label htmlFor="value">Value (comma-separated):</label>
                    <input
                        className="form_controller text-base"
                        type="text"
                        id="value"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        disabled={action === 'remove'}
                    />
                </div>
                <div className="mt-4 flex items-center gap-4">
                    <button
                        disabled={isLoading}
                        type="submit"
                        className=" disabled:opacity-80 flex items-center gap-1 bg-blue-500 text-white py-2 px-4 rounded-md shadow hover:bg-blue-600 transition text-sm" 
                    >
                        
                        {isLoading && <CircularProgress color='' size="20px" />}
                        { action === "add" ? t('submit') : t('update')}
                    </button>
                    {
                        action === 'update' &&
                        <button
                            type="button"
                            className="bg-gray-300 text-black py-2 px-4 rounded-md shadow hover:bg-gray-400 transition text-sm" 
                            onClick={() => onCancel?.()}
                        >
                            {t('cancel')}
                        </button>
                    }
                </div>
            </form>
            {message && <p className="my-3 p-2 bg-orange-100 text-orange-600 rounded-sm text-sm">{message}</p>}
        </div>
    );
};

