import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { useTranslation } from 'react-i18next';
const paginationModel = { page: 0, pageSize: 40 };

export default function AllUsers({ data = []}) {


    const { t, i18n } = useTranslation();
    const columns = [
        { field: 'name', headerName: t('nom') },
        { field: 'firstname', headerName: t('prenom') },
        { field: 'role', headerName: t('role') },
        { field: 'email', headerName: t('email') },
    ];



    return (
        <Paper sx={{ width: '100%', height: '100%', overflowX: 'auto', maxWidth: '100%' }} className="custom__header">
            <DataGrid
                rows={data.map(d => ({...d, id: d._id}))}
                columns={columns}
                initialState={{ pagination: { paginationModel } }}
                pageSizeOptions={[5, 10]}
                checkboxSelection
                sx={{ border: 0, width: '100%', fontSize: '0.85rem' }}
                rowHeight={38}
            />
        </Paper>
    );
}
