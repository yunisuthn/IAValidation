import { useState, useEffect } from 'react';

// Custom hook to manage DataGrid settings with localStorage
const useDataGridSettings = (storageKey, defaultSettings = {}) => {
    const [columnVisibilityModel, setColumnVisibilityModel] = useState(defaultSettings.columnVisibilityModel || {});
    const [sortModel, setSortModel] = useState(defaultSettings.sortModel || []);
    const [filterModel, setFilterModel] = useState(defaultSettings.filterModel || {});
    const [pageSize, setPageSize] = useState(defaultSettings.pageSize || 10);
    const [density, setDensity] = useState(defaultSettings.density || 'standard');

    // Load saved settings from localStorage when the component mounts
    useEffect(() => {
        const savedSettings = JSON.parse(localStorage.getItem(storageKey));
        if (savedSettings) {
            setColumnVisibilityModel(savedSettings.columnVisibilityModel || {});
            setSortModel(savedSettings.sortModel || []);
            setFilterModel(savedSettings.filterModel || {});
            setPageSize(savedSettings.pageSize || 5);
            setDensity(savedSettings.density || 'standard');
        }
    }, [storageKey]);

    // Save settings to localStorage whenever any setting changes
    useEffect(() => {
        const settings = {
            columnVisibilityModel,
            sortModel,
            filterModel,
            pageSize,
            density,
        };
        localStorage.setItem(storageKey, JSON.stringify(settings));
    }, [columnVisibilityModel, sortModel, filterModel, pageSize, density, storageKey]);

    return {
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
    };
};

export default useDataGridSettings;
