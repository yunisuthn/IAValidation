// currencySlice.js
import { createSlice } from '@reduxjs/toolkit';

// Define initial state
const initialState = {
    currency: "EUR", // Default currency
};

// Create the slice
const currencySlice = createSlice({
    name: 'currency', // Name of the slice
    initialState: initialState,
    reducers: {
        // Set the selected currency
        setCurrency: (state, action) => {
            state.currency = action.payload; // Update currency
        },
    },
});

// Export actions automatically generated by createSlice
export const { setCurrency } = currencySlice.actions;

// Export the reducer to be included in the store
export default currencySlice.reducer;
