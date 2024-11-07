import React, { useEffect, useState } from 'react'
import Input from './Input'
import { Add, Clear, Delete, HighlightOff } from '@mui/icons-material'

const LineItemTable = ({ data = [], id}) => {

    const [rows, setRows] = useState(data);

    useEffect(() => {
        setRows(data.map((r, index) => ({
            ...r,
            id: index
        })));
    }, [data]);

    function handleAddNewRow() {
        // rows
        setRows(prev => [...prev, {
            id: rows.length + 1,
            "LineItemProductCode": "",
            "LineItemDescription": "",
            "LineItemUnitPrice": "",
            "LineItemQuantity": "",
            "LineItemAmount": ""
        }]);
    }

    
    function handleDeleteRow(rowId) {
        // rows
        setRows(prev => prev.filter(r => r.id !== rowId));
    }

    function handleUpdateCell(key, value) {
        console.log(key, value)
    }

    return (
        <div className='flex flex-col gap-2 bg-slate-100'>
            <label htmlFor="line-item-table" className='text-sm p-1'>Line Item: </label>
            <table id='line-item-table' className='border w-full p-1'>
                <thead>
                    <tr>
                        <th className='text-sm text-left font-semibold px-1'>
                            <button className='p-1' onClick={() => handleAddNewRow()}>
                                <Add className='text-emerald-500' />
                            </button>
                        </th>
                        <th className='text-sm text-left font-semibold px-1'>Product Code</th>
                        <th className='text-sm text-left font-semibold px-1'>Description</th>
                        <th className='text-sm text-left font-semibold px-1'>Unit Price</th>
                        <th className='text-sm text-left font-semibold px-1 w-[50px]'>Quantity</th>
                        <th className='text-sm text-left font-semibold px-1'>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        rows.map((lineItem, index) => (
                            <LineItemRow
                                index={index}
                                row={lineItem}
                                onDeleteRow={handleDeleteRow}
                                id={id}
                                onUpdateCell={handleUpdateCell}
                            />
                        ))
                    }
                </tbody>
            </table>
        </div>
    )
}

function LineItemRow({ row, onDeleteRow, id, onUpdateCell, index }) {
    

    return (

        <tr>
            <td>
                <button className='p-1' onClick={() => onDeleteRow(row.id)}>
                    <Clear className='text-rose-500' />
                </button>
            </td>
            <td>
                <LineItemCell
                    id={`${id}.${row.id}.LineItemProductCode`}
                    value={row.LineItemProductCode}
                    onUpdate={onUpdateCell}
                />
            </td>
            <td>
                <LineItemCell
                    id={`${id}.${row.id}.LineItemDescription`}
                    value={row.LineItemDescription}
                    onUpdate={onUpdateCell}
                />
            </td>
            <td>
                <LineItemCell
                    id={`${id}.${row.id}.LineItemUnitPrice`}
                    value={row.LineItemUnitPrice}
                    onUpdate={onUpdateCell}
                />
            </td>
            <td>
                <LineItemCell
                    id={`${id}.${row.id}.LineItemQuantity`}
                    value={row.LineItemQuantity}
                    onUpdate={onUpdateCell}
                />
            </td>
            <td>
                <LineItemCell
                    id={`${id}.${row.id}.LineItemAmount`}
                    value={row.LineItemAmount}
                    onUpdate={onUpdateCell}
                />
            </td>
        </tr>
    )

}

function LineItemCell({ value = '', className = '', id='', onUpdate}) {
    const [val, setVal] = useState(value);

    function handleChange(newVal) {
        setVal(newVal);
        onUpdate && onUpdate(id, newVal);
    }

    return (
        <div className="px-1 w-full" title={val}>
            <input className={`form_controller w-full ${className}`}
                id={id}
                value={value}
                onChange={(e) => handleChange(e.target.value)}
            />
        </div>
    )
}

export default LineItemTable