import React, { useEffect, useState } from 'react'
import DynamicKeysList from './list'
import { DynamicKeysAddForm } from './forms'
import { getCustomerById } from '../../services/customer-service';

const OCRDynamicKeys = () => {

    const [keys, setKeys] = useState([]);
    const [action, setAction] = useState('add');
    const [currentItem, setCurrentItem] = useState(null);
    const [message, setMessage] = useState('');
    const customerId = '67514c02a36d01d14c04de95';


    function handleUpateKey(item) {
        setAction('update');
        setCurrentItem(item);
    }


    function handleCancel() {
        setAction('add');
        setCurrentItem(null);
    }


    function handleSuccess(data) {
        const dynamicKeys = data.sort((a, b) => a.order - b.order)
        setKeys(dynamicKeys);
    }

    useEffect(() => {
        getCustomerById(customerId).then(data => {
            if (data?._id) {

                const dynamicKeys = data.dynamicKeys.sort((a, b) => a.order - b.order)
                setKeys(dynamicKeys);
            }
        });
    }, []);
    

    return (
        <div className='flex items-stretch gap-5 flex-grow h-full'>
            <div className='w-full max-w-[500px] '>
                <h2 className="text-sm text-gray-600 font-semibold">{action === 'add' ? 'Add' : 'Update'} Dynamic Keys</h2>
                <DynamicKeysAddForm
                    currentItem={currentItem}
                    formAction={action}
                    onCancel={handleCancel}
                    onSuccess={handleSuccess}
                />
            </div>
            <div className='w-full max-w-[500px] h-full flex flex-col border-l border-gray-300 pl-5'>
                <h2 className='px-4 text-sm text-gray-600 font-semibold'>Manage and Order Dynamic Keys</h2>
                <div className='h-full relative sb overflow-y-auto'>
                    <div className='absolute inset-0 w-full h-full p-4'>
                        <DynamicKeysList
                            customerId={customerId}
                            setDynamicKeys={setKeys}
                            currentItem={currentItem}
                            dynamicKeys={keys}
                            onUpdate={handleUpateKey}
                            setMessage={setMessage}
                        />
                    </div>
                </div>
            </div>
            <div className='flex-grow'>
                {message && <p className="my-3 p-2 bg-orange-100 text-orange-600 rounded-sm text-sm">{message}</p>}
            </div>
        </div>
    )
}

export default OCRDynamicKeys