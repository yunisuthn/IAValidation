import React, { useEffect, useMemo, useState } from 'react'
import "react-datepicker/dist/react-datepicker.css";
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import _, { isEqual } from 'lodash';
import { deepCloneArray, deepMergeArray, findItemByName, removeDuplicatedData, updateObjectByName,escapeRegExp } from '../../utils/utils';
import { DragIndicator } from '@mui/icons-material';
import { OCRTemplateFieldRenderer } from '../data-source/ocr/template/form-preview';
import templateService from '../services/template-service'
import SkeletonLoading from '../ui/skeleton-loading';
import { t } from 'i18next';


const MemoizedDraggableBlock = ({ block, index, activeItem, onClick, query }) => {
    const q = useMemo(() => query, [query]);
    
    return (
        <Draggable key={block.id} draggableId={block.id.toString()} index={index}>
            {(provided, snapshot) => (
            <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                onClick={onClick}
                className={`p-2 text-sm text-slate-900 whitespace-break-spaces flex items-start gap-1
                ${snapshot.isDragging ? 'bg-indigo-50' : ''}
                my-1 border border-indigo-100
                ${activeItem?.id === block.id ? '!bg-blue-50 !border-slate-400' : 'hover:bg-indigo-50 hover:border-indigo-200 bg-white'}
                `.replace(/\n/g, '')}
            >
                
                <DragIndicator className='text-slate-300' />
                <span
                    className={`${(snapshot.isDragging) ? 'line-clamp-2' : ''}`}
                    dangerouslySetInnerHTML={{ __html: q
                        ? block.value?.replace(new RegExp(escapeRegExp(q), "gi"), "<b style='background-color: yellow;'>$&</b>")
                        : block.value,}}
                />
            </div>
            )}
        </Draggable>
    );
};

const OCRForm = React.memo(({ hideLeftPanel = false, data, onClick, onUpdate, onStartCapture, templateId ='' }) => {

    const [formFields, setFormFields] = useState([]);

    const [blockData, setBlockData] = useState([]);
    const [activeItem, setActiveItem] = useState(null);
    const [jsonFields, setJsonFields] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        templateService.getById(templateId).then(templ => {
            const json = JSON.parse(String.raw`${templ.data}`);
            setJsonFields(json);
        }).catch(() => {
            setJsonFields([]);
        }).finally(() => {
            setLoading(false);
        });

    }, [templateId])

    const memoizedOnClick = (block) => {
        setActiveItem(block);
        onClick?.(block);
    };

    useEffect(() => {
        if (Array.isArray(data.OCR)) {
            let noDuplicata = removeDuplicatedData(data.OCR, ['id'])
            setBlockData(noDuplicata);
        }
        const mergedData = deepMergeArray(deepCloneArray(jsonFields), data.OCRData);
        setFormFields(mergedData);
    }, [data, jsonFields]);


    function filter(array = [], search='') {
        if (!search) return array;
        const escapedInput = escapeRegExp(search); // Escapes the input
        const reg = new RegExp(escapedInput, "gi");
        return array.filter(item => reg.test(item.value))
    }

    const filteredBlocks = useMemo(() => filter(blockData, search), [blockData, search]);
    
    const onDragEnd = (result) => {
        const { source, destination } = result;

        // If dropped outside a valid destination
        if (!destination) return;

        const sourceKey = source.droppableId;
        const destinationKey = destination.droppableId;

        if (sourceKey !== destinationKey) {
            if (sourceKey === 'item') {
                // Moving item from the list to a field
                const [movedItem] = [...filteredBlocks].splice(source.index, 1);
                // setBlockData([...blockData]);

                const field = findItemByName(formFields, destinationKey);
                const fieldValue = Array.isArray(field.value) ? field.value : [];
                const updatedValue = Array.from(fieldValue.filter(f => f).map(e => ({...e})));
                updatedValue.splice(destination.index, 0, movedItem);
                const updated = updateObjectByName(formFields, destinationKey, updatedValue);
            
                setFormFields(updated);
                // update item
                onUpdate?.(updated);

            } else if (destinationKey === 'item') {
                // Moving item from a field back to the list
                const field = findItemByName(formFields, sourceKey);
                const [movedItem] = field.value.splice(source.index, 1);
                setFormFields([...formFields]);

                const updatedItems = Array.from(blockData);
                updatedItems.splice(destination.index, 0, movedItem);
                setBlockData(removeDuplicatedData(updatedItems, ['id']));
            } else {
                // Moving items between fields
                const sourceField = findItemByName(formFields, sourceKey);
                const [movedItem] = sourceField.value.splice(source.index, 1);
                const field = findItemByName(formFields, destinationKey);
                const fieldValue = Array.isArray(field.value) ? field.value : [];
                const updatedValue = Array.from(fieldValue.filter(f => f).map(e => ({...e})));
                updatedValue.splice(destination.index, 0, movedItem);
                const updated = updateObjectByName(formFields, destinationKey, updatedValue);
            
                setFormFields(updated);
                // update item
                onUpdate?.(updated);
            }
        } else {
            // Reordering within the same droppable area
            if (sourceKey === 'item') {
                const updatedItems = Array.from(filteredBlocks);
                const [removed] = updatedItems.splice(source.index, 1);
                updatedItems.splice(destination.index, 0, removed);
                setBlockData(updatedItems);
            } else {

                const field = findItemByName(formFields, sourceKey);
                const fieldValue = Array.isArray(field.value) ? field.value : [];
                const updatedValue = Array.from(fieldValue.filter(f => f).map(e => ({...e})));
                const [removed] = updatedValue.splice(source.index, 1);
                updatedValue.splice(destination.index, 0, removed);
                const updated = updateObjectByName(formFields, destinationKey, updatedValue);
                
                setFormFields(updated);

                // update item
                onUpdate?.(updated);
            }
        }
    };

    
    // Debounce the handleUpdate function with a 300ms delay
    const debouncedHandleUpdate = _.debounce((name, value, idx) => {
        if (typeof idx === "number") { // for input type of text
            let field = findItemByName(formFields, name);
            if (field) {
                
                let val = (field.value && field.value.length > 0) ?
                    field.value.map((v, index) => index === idx ? ({
                        ...v, value: value
                    }): v) :
                    // create a new value if value is undefined
                    [{ id: formFields.length + Date.now(), value: value }];

                setFormFields(prev => {
                    const updated = updateObjectByName(prev, name, val);
                    onUpdate?.(updated);
                    return updated;
                });
            }
        } else {
            setFormFields(prev => {
                const updated = updateObjectByName(prev, name, value);
                onUpdate?.(updated);
                return updated;
            });
        }
    }, 300);

    // Cleanup the debounced function on component unmount
    React.useEffect(() => {
        return () => {
            debouncedHandleUpdate.cancel(); // Cancel any pending debounced calls
        };
    }, [debouncedHandleUpdate]);

    return (
        <div className='h-full bg-gray-100'>
            <DragDropContext onDragEnd={onDragEnd}>
                <div className='flex items-stretch flex-grow h-full w-full'>

                    <PanelGroup autoSaveId='ar_panel' direction="horizontal"  className="w-full flex gap-2 flex-grow">
                        { !hideLeftPanel && <Panel className='flex-1'> 
                            {/* Draggable Text Fragments */}
                            <Droppable droppableId="item">
                                {(provided) => (
                                    <div ref={provided.innerRef} {...provided.droppableProps} className="text-list overflow-y-scroll h-full px-2">
                                        <div className='w-full sticky top-0 py-2 bg-white border-b'>
                                            <input type="search"
                                                className="w-full px-2 py-1 border text-sm ar-input"
                                                onChange={(e) => setSearch(e.target.value)}
                                                placeholder='Search'
                                            />
                                        </div>
                                        {filteredBlocks.map((block, index) => (
                                            <MemoizedDraggableBlock
                                                key={index}
                                                block={block}
                                                index={index}
                                                query={search}
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
                            <div className="bg-white px-2 overflow-x-hidden overflow-y-scroll h-full">
                                {
                                    loading ? (
                                        <SkeletonLoading />
                                    ) : (
                                        
                                        formFields.length > 0 ?
                                            formFields.map((field, index) => (
                                                <OCRTemplateFieldRenderer
                                                    key={index}
                                                    field={field}
                                                    onChange={debouncedHandleUpdate}
                                                    onStartCapture={onStartCapture}
                                                    onClick={memoizedOnClick}
                                                    active={activeItem}
                                                    onControlUpdate={setFormFields}
                                                />
                                            ))
                                        : 
                                        <p className='py-10 px-2 text-gray-700 bg-gray-100 text-center text-xs'>{t('template-no-data')}</p>
                                    )
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
        prevProps.templateId === nextProps.templateId &&
        isEqual(prevProps.data, nextProps.data) && // Deep comparison for `data`
        prevProps.onClick === nextProps.onClick
    );
})

export default OCRForm