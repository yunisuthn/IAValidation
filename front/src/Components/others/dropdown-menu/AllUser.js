import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { useTranslation } from 'react-i18next';
import { Link } from '@mui/material';
import { AccountCircle } from '@mui/icons-material';
const paginationModel = { page: 0, pageSize: 40 };

export default function AllUsers({ data = [], loading=false}) {


    const { t, i18n } = useTranslation();
    const columns = [
        {
            field: 'image', headerName: '', sortable: false,
            renderCell: ({row}) => (
                <AccountCircle color='primary' />
            )

        },
        { field: 'name', headerName: t('nom'), flex: 1 },
        { field: 'firstname', headerName: t('prenom'), flex: 1 },
        {
            field: 'role', headerName: t('role'), flex: 1,
            renderCell: ({row}) => (
                <span className='capitalize'>{row.role}</span>
            )
        },
        {
            field: 'email', headerName: t('email'), flex: 1,
            renderCell: ({row}) => (
                <Link href={`mailto:${row.email}`}>{row.email}</Link>
            )
        },
    ];



    return (
        <Paper sx={{ width: '100%', height: '100%', overflowX: 'auto', maxWidth: '100%' }} className="custom__header">
            <DataGrid
                rows={data.map(d => ({...d, id: d._id}))}
                columns={columns}
                initialState={{ pagination: { paginationModel } }}
                pageSizeOptions={[5, 10]}
                disableRowSelectionOnClick
                checkboxSelection
                sx={{ border: 0, width: '100%', fontSize: '0.85rem' }}
                rowHeight={38}
                loading={loading}
            />
        </Paper>
    );
}
