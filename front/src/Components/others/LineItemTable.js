import React, { useEffect, useState } from 'react'
import { Add, Clear } from '@mui/icons-material';
import {NumericFormat } from 'react-number-format';

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
            <label htmlFor="line-item-table" className='p-1 text-sm'>Line Item: </label>
            <table id='line-item-table' className='w-full p-1 border'>
                <thead>
                    <tr>
                        <th className='px-1 text-sm font-semibold text-left'>
                            <button className='p-1' onClick={() => handleAddNewRow()}>
                                <Add className='text-emerald-500' />
                            </button>
                        </th>
                        <th className='px-1 text-sm font-semibold text-left'>Product Code</th>
                        <th className='px-1 text-sm font-semibold text-left'>Description</th>
                        <th className='px-1 text-sm font-semibold text-left'>Unit Price</th>
                        <th className='text-sm text-left font-semibold px-1 w-[60px]'>Quantity</th>
                        <th className='px-1 text-sm font-semibold text-left'>Amount</th>
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
                    type='numeric'
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

function LineItemCell({ value = '', className = '', id='', onUpdate, type="text"}) {
    const [val, setVal] = useState(value);

    function handleChange(newVal) {
        setVal(newVal);
        onUpdate && onUpdate(id, newVal);
    }

    return (
        <div className="w-full px-1" title={val}>
            {

                type === 'numeric' ? 
                    <NumericFormat 
                        thousandSeparator={true}
                        className={`form_controller w-full ${className}`}
                        prefix={'$'}
                        
                        decimalScale={2}
                        fixedDecimalScale={true}
                        onValueChange={(values) => {
                            const { formattedValue, value } = values;
                            console.log(formattedValue); // "$1,000.00"
                            console.log(value); // "1000.00"
                        }}
                    />
                :
                
                <input
                    className={`form_controller w-full ${className}`}
                    id={id}
                    value={val}
                    onChange={(e) => handleChange(e.target.value)}
                    type='text'
                    inputMode={type}
                    {...(type === 'numeric') && { pattern:"[0-9]+([.,][0-9]+)?" }}
                />
            }
        </div>
    )
}

export default LineItemTable