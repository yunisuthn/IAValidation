import * as React from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { frFR, enUS, nlNL } from '@mui/x-data-grid/locales';
import { useNavigate } from 'react-router-dom';
import { Lock } from '@mui/icons-material'
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';
import useDataGridSettings from '../../../hooks/useDatagridSettings';
import CellRenderer from '../cell-render/CellRenderer';
import useUser from '../../../hooks/useLocalStorage';

const paginationModel = { page: 0, pageSize: 20 };

export default function PrevalidationTable({ data = [], version = 'v2', loading = false }) {

    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const { user } = useUser();
    const [rows, setRows] = React.useState(data);
    
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
            field: 'isLocked',
            headerName: '',
            renderCell: ({ row }) => (
                <div className="flex items-center gap-2 w-full h-full" title={t('document-is-locked')}>
                    {row.isLocked && <Lock className={row.lockedBy?._id === user._id ? 'text-emerald-300' : 'text-orange-300'} fontSize='medium' />}
                </div>
            ),
            sortable: false,
            width: 50,  // Fixed width for the status column
        },
        {
            field: 'name',
            headerName: t('file-col'),
            renderCell: ({row}) => (
                <CellRenderer.RenderPDFName
                    pdfName={row.name}
                    version={version}
                    id={row._id}
                    isLocked={row.isLocked}
                    isGranted={row.lockedBy?._id === user._id}
                />
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
                key={JSON.stringify(rows.map(d => d._id))}
                rows={rows.map((d) => ({
                    ...d,
                    id: d._id,
                    documentid: parseInt(d._id),
                    name: d.name,
                }))}
                columns={columns}
                initialState={{ pagination: { paginationModel } }}
                pageSizeOptions={[5, 10]}
                checkboxSelection
                localeText={getLocaleText(i18n.language)}
                slots={{
                    toolbar: GridToolbar
                }}
                loading={loading}
                autoHeight
                disableRowSelectionOnClick
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
