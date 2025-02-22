import React from 'react'
import Tabs from '../data-source/tabs'
import SupplierPage from '../data-source/supplier/page'
import OCRDynamicKeys from '../data-source/ocr/page'
import TemplateManager from '../data-source/ocr/template/template-manager'

export const DataSource = () => {

    const tabs = [
        {
            label: "Supplier",
            content: <SupplierPage />
        },
        // {
        //     label: "OCR Dynamic Keys",
        //     content: <OCRDynamicKeys />
        // },
        {
            label: "OCR Templates",
            content: <TemplateManager />
        }
    ]
    return (
        <div className='flex flex-col h-full flex-grow'>
            <Tabs tabs={tabs} />
        </div>
    )
}

export default DataSource