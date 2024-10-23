import * as React from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { frFR, enUS, nlNL } from '@mui/x-data-grid/locales';
import Paper from '@mui/material/Paper';
import { useNavigate } from 'react-router-dom';
import { Lock, Check, KeyboardReturn } from '@mui/icons-material'
import { useTranslation } from 'react-i18next';



const paginationModel = { page: 0, pageSize: 20 };

export default function ReturnedTable({ data = [], version = 'v1' }) {

    const { t, i18n } = useTranslation();
    const navigate = useNavigate();

        
    const columns = [
        {
            field: 'Status',
            headerName: '',
            renderCell: ({row}) => (
                <div className="flex items-center gap-2 w-full h-full">
                    { row.isLocked && <Lock className="text-orange-300" fontSize='medium' />}
                    { row.status === 'validated' && <Check className="text-emerald-300" fontSize='medium' />}
                    { row.status === 'returned' && <KeyboardReturn className="text-rose-300" fontSize='medium' />}
                </div>
            ),
            flex: 0
        },
        { field: 'name', headerName: t('file-col'), flex: 1 },
        { field: 'documentid', headerName: t('documentid-col'), flex: 1 },
        { field: 'comments', headerName: t('comments-col'), flex: 2 },
    ];


    const getLocaleText = (language) => {
        switch (language) {
            case 'fr':
                return frFR.components.MuiDataGrid.defaultProps.localeText;
            case 'en':
            default:
                return enUS.components.MuiDataGrid.defaultProps.localeText;
        }
    };

    const handleOpenDocument = ({row}) => {
        if (!row.isLocked)
            navigate(`/document/${version}/${row._id}`);
    }

    return (
        <Paper sx={{ width: '100%', height: '100%', overflowX: 'auto', maxWidth: '100%' }} className="custom__header">
            <DataGrid
                rows={data.map(d => ({
                    ...d,
                    id: d._id,
                    documentid: parseInt(d._id),
                    name: d.name,
                    ...(d.versions.v1 ? d.versions.v1.Invoice : JSON.parse(d.dataXml).Invoice),
                }))}
                columns={columns}
                initialState={{ pagination: { paginationModel } }}
                pageSizeOptions={[5, 10]}
                checkboxSelection
                sx={{ border: 0, width: '100%', fontSize: '0.85rem' }}
                onRowDoubleClick={handleOpenDocument}
                rowHeight={38}
                
                localeText={getLocaleText(i18n.language)}

                
                
                slots={{
                    toolbar: GridToolbar
                }}

                componentsProps={{
                    toolbar: {
                        sx: {
                            '&  *': {
                                fontFamily: '"Hanken Grotesk", sans-serif', // Apply the font
                            },
                        }
                    },
                }}
            />
        </Paper>
    );
}
