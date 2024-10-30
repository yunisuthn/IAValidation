import * as React from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { frFR, enUS, nlNL } from '@mui/x-data-grid/locales';
import { useNavigate } from 'react-router-dom';
import { Lock } from '@mui/icons-material'
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';
import useDataGridSettings from '../../../hooks/useDatagridSettings';
import CellRenderer from '../cell-render/CellRenderer';



const paginationModel = { page: 0, pageSize: 20 };

export default function AllDocumentTable({ data = [], version = 'v2', loading = false, pageSize=2, rowCount=5 }) {

    const { t, i18n } = useTranslation();
    const [rows, setRows] = React.useState([]);

    React.useEffect(() => {
        setRows(data);
    }, [data])


    const {
        columnVisibilityModel,
        setColumnVisibilityModel,
        sortModel,
        setSortModel,
        filterModel,
        setFilterModel,
        // pageSize,
        setPageSize,
        density,
        setDensity,
    } = useDataGridSettings('validation2-datagrid-settings', {
        pageSize: 10,
        density: 'standard',
    });
    
    const columns = [
        {
            field: 'isLocked',
            headerName: '',
            renderCell: ({ row }) => (
                <div className="flex items-center gap-2 w-full h-full" title={t('document-is-locked')}>
                    {row.isLocked && <Lock className="text-orange-300" fontSize='medium' />}
                </div>
            ),
            sortable: false,
            width: 40,  // Fixed width for the status column
        },
        {
            field: 'name',
            headerName: t('file-col'),
            renderCell: ({row}) => (
                <CellRenderer.RenderPDFName pdfName={row.name} />
            ),
            minWidth: 400,  // Set a fixed width for the 'name' column
            flex: 1      // Allow proportional resizing based on the container width
        },
        {
            field: 'documentid',
            headerName: t('documentid-col'),
            width: 60,
            flex: 1
        },
        {
            field: 'workflowStatus',
            headerName: t('workflowstatus-col'),
            renderCell: ({row}) => (
                <CellRenderer.RenderWorkflowStatus data={row} />
            ),
            minWidth: 150,
            flex: 1
        },
        {
            field: 'lockedBy',
            headerName: t('current-user-col'),
            renderCell: ({row: { lockedBy} }) => (
                <>
                { lockedBy?.email ? <CellRenderer.RenderUser user={lockedBy} /> : 'N/A' }
                </>
            ),
            minWidth: 150,
            flex: 1
        },
        {
            field: 'validatedBy.v1',
            headerName: t('validation1-col'),
            renderCell: ({row: { validatedBy} }) => (
                <>
                { validatedBy?.v1?.email ? <CellRenderer.RenderUser user={validatedBy.v1} /> : 'N/A' }
                </>
            ),
            minWidth: 150,
            flex: 1
        },
        {
            field: 'validatedBy.v2',
            headerName: t('validation2-col'),
            renderCell: ({row: { validatedBy} }) => (
                <>
                { validatedBy?.v2?.email ? <CellRenderer.RenderUser user={validatedBy.v2} /> : 'N/A' }
                </>
            ),
            minWidth: 150,
            flex: 1
        },
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
                rows={rows.map(d => ({
                    ...d,
                    id: d._id,
                    name: d.name,
                }))}
                columns={columns}
                initialState={{
                    pagination: { paginationModel }
                }}
                pageSize={pageSize}
                // pageSizeOptions={[5, 10]} // Ensures page size options are available
                pagination // Enables pagination controls
                pageSizeOptions={[5, 10, 25, { value: -1, label: 'All' }]}
                checkboxSelection
                localeText={getLocaleText(i18n.language)}
                slots={{
                    toolbar: GridToolbar
                }}
                loading={loading}
                autoHeight
                disableRowSelectionOnClick
                onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                rowsPerPageOptions={[5, 10, 25]} // Adds rows per page options in the UI
                sortingOrder={['asc', 'desc']}
                sortModel={sortModel}
                onSortModelChange={(model) => setSortModel(model)}
                onFilterModelChange={(model) => setFilterModel(model)}
                columnVisibilityModel={columnVisibilityModel}
                onColumnVisibilityModelChange={(newModel) => setColumnVisibilityModel(newModel)}
                density={density}
                onDensityChange={(newDensity) => setDensity(newDensity)}
                components={{
                    Toolbar: GridToolbar,
                }}
                // rowCount={4}
            />
        </Box>
    );
}
