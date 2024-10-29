import * as React from 'react';
import { DataGrid, GridToolbar, } from '@mui/x-data-grid';
import { frFR, enUS, nlNL } from '@mui/x-data-grid/locales';
import { useNavigate } from 'react-router-dom';
import { Download } from '@mui/icons-material'
import { useTranslation } from 'react-i18next';
import { Box, Button } from '@mui/material';
import fileService from '../../services/fileService';
import { GenerateXMLFromResponse } from '../../../utils/utils';
import CellRenderer from '../cell-render/CellRenderer';
import useDataGridSettings from '../../../hooks/useDatagridSettings';



const paginationModel = { page: 0, pageSize: 20 };

export default function ValidatedTable({ data = [], version = 'v2', loading = false }) {

    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    
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
        pageSize,
        setPageSize,
        density,
        setDensity,
    } = useDataGridSettings('validated-datagrid-settings', {
        pageSize: 10,
        density: 'standard',
    });
    
    const columns = [
        {
            field: 'name',
            headerName: t('file-col'),
            renderCell: ({row}) => (
                <CellRenderer.RenderPDFName pdfName={row.name} />
            ),
            width: 200,  // Set a fixed width for the 'name' column
            flex: 1      // Allow proportional resizing based on the container width
        },
        {
            field: 'documentid',
            headerName: t('documentid-col'),
            width: 150,
            flex: 1
        },
        {
            field: 'validatedBy.v1',
            headerName: t('validator1-col'),
            renderCell: ({row: { validatedBy} }) => (
                <>
                { validatedBy?.v1?.email ? <CellRenderer.RenderUser user={validatedBy.v1} /> : 'N/A' }
                </>
            ),
            width: 150,
            flex: 1
        },
        {
            field: 'validatedBy.v2',
            headerName: t('validator2-col'),
            renderCell: ({row: { validatedBy} }) => (
                <>
                { validatedBy?.v2?.email ? <CellRenderer.RenderUser user={validatedBy.v2} /> : 'N/A' }
                </>
            ),
            width: 150,
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
            field: 'action',
            headerName: t('download-as-xml'),
            renderCell: ({ row }) => (
                <div className="flex items-center gap-2 w-full h-full">
                    <Button onClick={() => handleDownloadXML(row)} title={t('download-as-xml')}>
                        <Download />
                    </Button>
                </div>
            ),
            width: 100,  // Fixed width for the action column
            flex: 1
        },
    ];



    // method to send request to download xml file
    async function handleDownloadXML(data) {
        const { versions } = data;
        if (versions[1]) {
            const resp = await fileService.downloadXML(versions[1].dataJson);
            if (resp.ok) {
                GenerateXMLFromResponse(resp, 'download.xml');
            }
        }
    }


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
                rows={rows.map(d => ({
                    ...d,
                    id: d._id,
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
