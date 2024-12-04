import React, { useState } from 'react';
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import { DragIndicator } from '@mui/icons-material';

export const DraggableList = () => {

    const [items, setItems] = useState([
        "Item 1",
        "Item 2",
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        "Vivamus lacinia odio vitae vestibulum vestibulum.",
        "Cras pulvinar, mi at dictum blandit, turpis nunc consequat massa, ut aliquam purus odio non sem."
    ]);

    const [droppableItems, setDroppableItems] = useState([
        {
            key: "Description",
            value: []
        },
        {
            key: "Rollup",
            value: []
        },
        {
            key: "Number",
            value: []
        },
        {
            key: "Korting",
            value: []
        }
    ]);

    const onDragEnd = (result) => {
        const { source, destination } = result;

        console.log(source, destination)

        // If dropped outside a valid destination
        if (!destination) return;

        const sourceKey = source.droppableId;
        const destinationKey = destination.droppableId;

        if (sourceKey !== destinationKey) {
            if (sourceKey === 'item') {
                // Moving item from the list to a field
                const [movedItem] = items.splice(source.index, 1);
                setItems([...items]);

                setDroppableItems(prev => prev.map(field => {
                    if (field.key === destinationKey) {
                        const updatedValue = Array.from(field.value);
                        updatedValue.splice(destination.index, 0, movedItem);
                        return { ...field, value: updatedValue };
                    }
                    return field;
                }));
            } else if (destinationKey === 'item') {
                // Moving item from a field back to the list
                const field = droppableItems.find(field => field.key === sourceKey);
                const [movedItem] = field.value.splice(source.index, 1);
                setDroppableItems([...droppableItems]);

                const updatedItems = Array.from(items);
                updatedItems.splice(destination.index, 0, movedItem);
                setItems(updatedItems);
            } else {
                console.log('ato')
                // Moving items between fields
                const sourceField = droppableItems.find(field => field.key === sourceKey);
                const [movedItem] = sourceField.value.splice(source.index, 1);
    
                setDroppableItems(prev => prev.map(field => {
                    if (field.key === destinationKey) {
                        const updatedValue = Array.from(field.value);
                        updatedValue.splice(destination.index, 0, movedItem);
                        return { ...field, value: updatedValue };
                    }
                    return field;
                }));
            }
        } else {
            // Reordering within the same droppable area
            if (sourceKey === 'item') {
                const updatedItems = Array.from(items);
                const [removed] = updatedItems.splice(source.index, 1);
                updatedItems.splice(destination.index, 0, removed);
                setItems(updatedItems);
            } else {
                setDroppableItems(prev => prev.map(field => {
                    if (field.key === sourceKey) {
                        const updatedValue = Array.from(field.value);
                        const [removed] = updatedValue.splice(source.index, 1);
                        updatedValue.splice(destination.index, 0, removed);
                        return { ...field, value: updatedValue };
                    }
                    return field;
                }));
            }
        }
    };

    return (
        <div className='h-screen bg-gray-100'>
            <DragDropContext onDragEnd={onDragEnd}>
                <div className='flex items-stretch flex-grow h-full w-full gap-2'>
                    {/* Create droppable items */}
                    <div className='flex flex-col gap-1 h-full p-2 w-full max-w-[400px] overflow-x-hidden overflow-y-auto sb custom__scrollbar'>
                        {
                            droppableItems.map((item, index) => (
                                <Droppable key={index} droppableId={item.key}>
                                    {
                                        (provided, snapshot) => (
                                            <fieldset
                                                {...provided.droppableProps}
                                                ref={provided.innerRef}
                                                className={`w-full max-w-[400px] overflow-hidden flex flex-col gap-2 border ${snapshot.isDraggingOver ? 'border-indigo-300' : 'border-gray-200'} p-2 bg-white`}
                                            >
                                                <legend style={{ textTransform: 'none' }} className={`font-bold text-sm ${snapshot.isDraggingOver ? 'text-indigo-500' : 'text-gray-800'}`}>{item.key}:</legend>
                                                <div className='w-full empty:min-h-[50px] border border-dashed border-gray-200 px-[2px]'>
                                                    {
                                                        item.value.map((val, idx) => (
                                                            <Draggable
                                                                key={`${item.key}-${idx}`}
                                                                draggableId={`${item.key}-${idx}`}
                                                                index={idx}
                                                            >
                                                                {(provided, snapshot) => (
                                                                    <p
                                                                        ref={provided.innerRef}
                                                                        {...provided.draggableProps}
                                                                        {...provided.dragHandleProps}
                                                                        className={`flex items-start gap-1 p-2 m-0 text-sm text-slate-900 whitespace-break-spaces ${snapshot.isDragging ? 'bg-indigo-50 border-indigo-100' : 'bg-indigo-50 hover:border-indigo-100'} hover:bg-indigo-50 my-1 border-2 border-transparent`}
                                                                    >{val}</p>
                                                                )}
                                                            </Draggable>
                                                        ))
                                                    }
                                                    {/* Drag placeholder */}
                                                    {provided.placeholder}
                                                </div>
                                            </fieldset>
                                        )
                                    }
                                </Droppable>
                            ))
                        }
                    </div>

                    {/* Separator */}
                    <div className='border-l border-gray-300 flex flex-col flex-none' />

                    {/* List of items */}
                    <div className='flex flex-grow h-full flex-col p-2 flex-1 w-full max-w-[400px] relative overflow-y-auto custom__scroll sb'>
                        <Droppable droppableId='item'>
                            {
                                (provided) => (
                                    <div
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        className='w-full h-full absolute inset-0 p-2'
                                    >
                                        <div className="h-2" />
                                        {
                                            items.map((item, index) => (
                                                <Draggable
                                                    key={index}
                                                    draggableId={index.toString()}
                                                    index={index}
                                                >
                                                    {
                                                        (provided, snapshot) => (
                                                            <p
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                                className={`flex items-start gap-1 p-2 text-sm text-slate-900 whitespace-break-spaces ${snapshot.isDragging ? 'bg-indigo-50' : 'bg-slate-50 hover:border-indigo-200'} hover:bg-indigo-50 my-1 border-2 border-indigo-100 `}
                                                            >
                                                                <DragIndicator className='text-slate-300' />
                                                                <span>{item}</span>
                                                            </p>
                                                        )
                                                    }
                                                </Draggable>
                                            ))
                                        }

                                        {/* Drag placeholder */}
                                        {provided.placeholder && (
                                            <div className="!w-full">
                                                {provided.placeholder}
                                            </div>
                                        )}
                                        
                                        <div className="h-2" />
                                    </div>
                                )
                            }
                        </Droppable>
                    </div>
                </div>
            </DragDropContext>
        </div>
    );
};

export default DraggableList;
