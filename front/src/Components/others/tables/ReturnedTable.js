import * as React from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { frFR, enUS, nlNL } from '@mui/x-data-grid/locales';
import Paper from '@mui/material/Paper';
import { useNavigate } from 'react-router-dom';
import { Lock, Check, KeyboardReturn, Comment, PictureAsPdf } from '@mui/icons-material'
import { useTranslation } from 'react-i18next';
import { UserCell } from '../user/UserProfile';
import useDataGridSettings from '../../../hooks/useDatagridSettings';
import CellRenderer from '../cell-render/CellRenderer';
import { Box } from '@mui/material';



const paginationModel = { page: 0, pageSize: 20 };

export default function ReturnedTable({ data = [], version = 'v1', loading = false }) {

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
    } = useDataGridSettings('returnedvalidations-datagrid-settings', {
        pageSize: 10,
        density: 'standard',
    });
    

        
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
            sortable: false,
            flex: 0
        },
        {
            field: 'name', headerName: t('file-col'),
            renderCell: ({row}) => (
                <CellRenderer.RenderPDFName pdfName={row.name} />
            ),
            flex: 1
        },
        { field: 'documentid', headerName: t('documentid-col'), flex: 1 },
        {
            field: 'validation1',
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
            field: 'comment', headerName: t('comments-col'),
            renderCell: ({row}) => (
                <CellRenderer.RenderComment comment={row.comment} />
            ),
            flex: 2
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

    const handleOpenDocument = ({row}) => {
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
