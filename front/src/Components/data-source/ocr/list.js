import React, { useMemo, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { updateCustomerDynamicKeysOrder } from '../../services/customer-service';
import { DragIndicator, Edit } from '@mui/icons-material';
import { IconButton } from '@mui/material';

export const DynamicKeysList = ({ customerId, dynamicKeys = [], setDynamicKeys, onUpdate, currentItem=null, setMessage }) => {

    const cItem = useMemo(() => currentItem, [currentItem]);

    const handleDragEnd = async (result) => {
        if (!result.destination) return;

        const reorderedKeys = Array.from(dynamicKeys);
        const [movedItem] = reorderedKeys.splice(result.source.index, 1);
        reorderedKeys.splice(result.destination.index, 0, movedItem);

        // Update order locally
        setDynamicKeys?.(reorderedKeys);

        // Send updated order to backend
        try {
            const order = reorderedKeys.map((item, index) => ({
                key: item.key,
                order: index,
            }));

            await updateCustomerDynamicKeysOrder(customerId, {
                dynamicKeys: order
            });

            setMessage?.('Order updated successfully.');
        } catch (error) {
            setMessage?.('Failed to update order.');
        }

        setTimeout(() => {
            setMessage('');
        }, 5000);
    };

    return (
        <div className='flex flex-col gap-2 h-full w-full'>
            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="dynamicKeysList">
                    {(provided) => (
                        <ul
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            style={{ listStyleType: 'none', padding: 0 }}
                            className='flex flex-col gap-2'
                        >
                            {dynamicKeys.map((item, index) => (
                                <Draggable key={item.key} draggableId={item.key} index={index}>
                                    {(provided) => (
                                        <li
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            style={{
                                                ...provided.draggableProps.style,
                                                ...(cItem?.key === item.key) && { display: 'none'}
                                            }}
                                            className='w-full flex gap-1 items-center p-2 border border-gray-200 bg-gray-100 rounded-sm hover:bg-indigo-100 text-gray-800'
                                        >
                                            <DragIndicator className='text-slate-300 hover:text-slate-600' fontSize='small'/>
                                            <span className='w-full'>{item.key}</span>
                                            <IconButton type='button' size='small' className='ml-auto' onClick={() => onUpdate?.(item)}>
                                                <Edit fontSize='small'/>
                                            </IconButton>
                                        </li>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </ul>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    );
};

export default DynamicKeysList;
