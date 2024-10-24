import * as React from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { frFR, enUS, nlNL } from '@mui/x-data-grid/locales';
import { useNavigate } from 'react-router-dom';
import { Lock } from '@mui/icons-material'
import { useTranslation } from 'react-i18next';
import { Box, Button } from '@mui/material';
import { UserCell } from '../user/UserProfile';
import useDataGridSettings from '../../../hooks/useDatagridSettings';
import CellRenderer from '../cell-render/CellRenderer';



const paginationModel = { page: 0, pageSize: 20 };

export default function PrevalidationTable({ data = [], version = 'v2', loading = false }) {

    const { t, i18n } = useTranslation();
    const navigate = useNavigate();


    const {
        columnVisibilityModel,
        setColumnVisibilityModel,
        sortModel,
        setSortModel,
        filterModel,
        setFilterModel,
        pageSize,
        setPageSize,
        density,
        setDensity,
    } = useDataGridSettings('prevalidation-datagrid-settings', {
        pageSize: 10,
        density: 'standard',
    });
    
    const columns = [
        {
            field: 'Status',
            headerName: '',
            renderCell: ({ row }) => (
                <div className="flex items-center gap-2 w-full h-full">
                    {row.isLocked && <Button title={t('document-is-locked')}><Lock className="text-orange-300" fontSize='medium' /></Button>}
                </div>
            ),
            sortable: false,
            minWidth: 50,  // Fixed width for the status column
        },
        {
            field: 'name',
            headerName: t('file-col'),
            renderCell: ({row}) => (
                <CellRenderer.RenderPDFName pdfName={row.name} />
            ),
            minWidth: 300,  // Set a fixed width for the 'name' column
            flex: 1      // Allow proportional resizing based on the container width
        },
        {
            field: 'documentid',
            headerName: t('documentid-col'),
            minWidth: 150,
            flex: 1
        },
        {
            field: 'workflowstatus',
            headerName: t('workflowstatus-col'),
            renderCell: ({row}) => (
                <div>Worked</div>
            ),
            minWidth: 150,
            flex: 1
        },
        {
            field: 'current-user',
            headerName: t('current-user-col'),
            renderCell: ({row: { lockedBy} }) => (
                <>
                { lockedBy?.email ? <CellRenderer.RenderUser user={lockedBy} /> : 'N/A' }
                </>
            ),
            minWidth: 150,
            flex: 1
        },
        // {
        //     field: 'validation1',
        //     headerName: t('validation1-col'),
        //     minWidth: 150,
        //     flex: 1
        // },
        // {
        //     field: 'validation2',
        //     headerName: t('validation2-col'),
        //     minWidth: 150,
        //     flex: 1
        // },
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

    const handleOpenDocument = ({ row }) => {
        if (!row.isLocked)
            navigate(`/document/${version}/${row._id}`);
    }

    return (
        <Box
            style={{
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                flexGrow: 1,
                width: '100%'
            }}
            className="custom__header"
        >
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
                onRowDoubleClick={handleOpenDocument}
                localeText={getLocaleText(i18n.language)}
                slots={{
                    toolbar: GridToolbar
                }}
                loading={loading}
                autoHeight

                onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                rowsPerPageOptions={[5, 10, 25]}
                sortingOrder={['asc', 'desc']}
                sortModel={sortModel}
                onSortModelChange={(model) => setSortModel(model)}
                // filterModel={filterModel}
                onFilterModelChange={(model) => setFilterModel(model)}
                columnVisibilityModel={columnVisibilityModel}
                onColumnVisibilityModelChange={(newModel) => setColumnVisibilityModel(newModel)}
                density={density}
                onDensityChange={(newDensity) => setDensity(newDensity)}
                components={{
                    Toolbar: GridToolbar,
                }}
            />
        </Box>
    );
}
