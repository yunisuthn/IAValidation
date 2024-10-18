import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
const columns = [
    { field: 'company', headerName: 'Company' },
    { field: 'id', headerName: 'Id' },
    { field: 'workflowStatus', headerName: 'Workflow status' },
    { field: 'currentUsers', headerName: 'Current users' },
    { field: 'documentId', headerName: 'Document ID' },
    { field: 'companyVAT', headerName: 'Company VAT' },
    { field: 'invoiceType', headerName: 'Invoice type' },
    { field: 'supplier', headerName: 'Supplier' },
    // { field: 'supplierName', headerName: 'Supplier name' },
    { field: 'invoiceNumber', headerName: 'Invoice number' },
    {
        field: 'invoiceDate',
        headerName: 'Invoice date',
        // type: 'date',
        width: 130,
    },
    {
        field: 'dueDate',
        headerName: 'Due date',
        // type: 'date',
        width: 130,
    },
    { field: 'currency', headerName: 'Currency' },
    {
        field: 'netAmount',
        headerName: 'Net amount',
        type: 'number',
        width: 130,
    },
    {
        field: 'totalAmount',
        headerName: 'Total amount',
        type: 'number',
        width: 130,
    },
];

const rows = [
    {
        company: 'Company B',
        id: 1,
        workflowStatus: 'In Progress',
        currentUsers: 14,
        documentId: 'DOC1001',
        companyVAT: 'VAT2001',
        invoiceType: 'Standard',
        supplier: 'Supplier E',
        supplierName: 'Supplier E',
        invoiceNumber: 'INV3001',
        invoiceDate: '2024-01-02',
        dueDate: '2024-02-01',
        currency: 'AUD',
        netAmount: 360.76,
        totalAmount: 976.71
    },
    {
        company: 'Company C',
        id: 2,
        workflowStatus: 'In Progress',
        currentUsers: 42,
        documentId: 'DOC1002',
        companyVAT: 'VAT2002',
        invoiceType: 'Standard',
        supplier: 'Supplier D',
        supplierName: 'Supplier D',
        invoiceNumber: 'INV3002',
        invoiceDate: '2024-01-03',
        dueDate: '2024-02-04',
        currency: 'EUR',
        netAmount: 102.23,
        totalAmount: 995.36
    },
    {
        company: 'Company A',
        id: 3,
        workflowStatus: 'In Progress',
        currentUsers: 60,
        documentId: 'DOC1003',
        companyVAT: 'VAT2003',
        invoiceType: 'Standard',
        supplier: 'Supplier C',
        supplierName: 'Supplier C',
        invoiceNumber: 'INV3003',
        invoiceDate: '2024-01-03',
        dueDate: '2024-02-05',
        currency: 'JPY',
        netAmount: 976.91,
        totalAmount: 682.71
    },
    {
        company: 'Company A',
        id: 4,
        workflowStatus: 'In Progress',
        currentUsers: 90,
        documentId: 'DOC1004',
        companyVAT: 'VAT2004',
        invoiceType: 'Standard',
        supplier: 'Supplier D',
        supplierName: 'Supplier D',
        invoiceNumber: 'INV3004',
        invoiceDate: '2024-01-04',
        dueDate: '2024-02-06',
        currency: 'USD',
        netAmount: 608.54,
        totalAmount: 1177.61
    },
    {
        company: 'Company D',
        id: 5,
        workflowStatus: 'In Progress',
        currentUsers: 15,
        documentId: 'DOC1005',
        companyVAT: 'VAT2005',
        invoiceType: 'Standard',
        supplier: 'Supplier D',
        supplierName: 'Supplier D',
        invoiceNumber: 'INV3005',
        invoiceDate: '2024-01-06',
        dueDate: '2024-02-05',
        currency: 'AUD',
        netAmount: 92.89,
        totalAmount: 467.92
    },
    {
        company: 'Company D',
        id: 6,
        workflowStatus: 'In Progress',
        currentUsers: 96,
        documentId: 'DOC1006',
        companyVAT: 'VAT2006',
        invoiceType: 'Standard',
        supplier: 'Supplier E',
        supplierName: 'Supplier E',
        invoiceNumber: 'INV3006',
        invoiceDate: '2024-01-09',
        dueDate: '2024-02-07',
        currency: 'GBP',
        netAmount: 608.35,
        totalAmount: 344.54
    },
    {
        company: 'Company A',
        id: 7,
        workflowStatus: 'In Progress',
        currentUsers: 76,
        documentId: 'DOC1007',
        companyVAT: 'VAT2007',
        invoiceType: 'Standard',
        supplier: 'Supplier C',
        supplierName: 'Supplier C',
        invoiceNumber: 'INV3007',
        invoiceDate: '2024-01-07',
        dueDate: '2024-02-08',
        currency: 'AUD',
        netAmount: 566.26,
        totalAmount: 855.82
    },
    {
        company: 'Company B',
        id: 8,
        workflowStatus: 'In Progress',
        currentUsers: 12,
        documentId: 'DOC1008',
        companyVAT: 'VAT2008',
        invoiceType: 'Standard',
        supplier: 'Supplier B',
        supplierName: 'Supplier B',
        invoiceNumber: 'INV3008',
        invoiceDate: '2024-01-10',
        dueDate: '2024-02-09',
        currency: 'GBP',
        netAmount: 755.82,
        totalAmount: 877.54
    },
    {
        company: 'Company B',
        id: 9,
        workflowStatus: 'In Progress',
        currentUsers: 93,
        documentId: 'DOC1009',
        companyVAT: 'VAT2009',
        invoiceType: 'Standard',
        supplier: 'Supplier B',
        supplierName: 'Supplier B',
        invoiceNumber: 'INV3009',
        invoiceDate: '2024-01-09',
        dueDate: '2024-02-09',
        currency: 'EUR',
        netAmount: 699.54,
        totalAmount: 478.02
    },
    {
        company: 'Company A',
        id: 10,
        workflowStatus: 'In Progress',
        currentUsers: 39,
        documentId: 'DOC1010',
        companyVAT: 'VAT2010',
        invoiceType: 'Standard',
        supplier: 'Supplier A',
        supplierName: 'Supplier A',
        invoiceNumber: 'INV3010',
        invoiceDate: '2024-01-13',
        dueDate: '2024-02-11',
        currency: 'AUD',
        netAmount: 126.12,
        totalAmount: 932.10
    }
];


const paginationModel = { page: 0, pageSize: 20 };

export default function DataTable() {
    return (
        <Paper sx={{ height: 500, width: '100%', overflow: 'hidden' }}>
            <DataGrid
                rows={rows}
                columns={columns}
                initialState={{ pagination: { paginationModel } }}
                pageSizeOptions={[5, 10]}
                checkboxSelection
                sx={{ border: 0, width: '100%', fontSize: '0.85rem' }}
            />
        </Paper>
    );
}
