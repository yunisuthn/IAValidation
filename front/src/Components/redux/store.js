// store.js
import { configureStore, createSlice } from '@reduxjs/toolkit';

const documentSlice = createSlice({
    name: 'documents',
    initialState: {
        prevalidationCount: 0,
        returnedCount: 0,
        validationV2Count: 0,
    },
    reducers: {
        incrementPrevalidation: (state, action) => {
            const incrementValue = action.payload ?? 1;
            state.prevalidationCount += incrementValue;
        },
        decrementPrevalidation: (state) => {
            if (state.prevalidationCount > 0) state.prevalidationCount -= 1;
        },
        incrementReturned: (state, action) => {
            const incrementValue = action.payload ?? 1;
            state.returnedCount += incrementValue;
        },
        decrementReturned: (state) => {
            if (state.returnedCount > 0) state.returnedCount -= 1;
        },
        incrementValidationV2: (state, action) => {
            const incrementValue = action.payload ?? 1;
            state.validationV2Count += incrementValue;
        },
        decrementValidationV2: (state) => {
            if (state.validationV2Count > 0) state.validationV2Count -= 1;
        },
        resetCounts: (state) => {
            state.prevalidationCount = 0;
            state.returnedCount = 0;
            state.validationV2Count = 0;
        },
    },
});

export const {
    incrementPrevalidation,
    decrementPrevalidation,
    incrementReturned,
    decrementReturned,
    incrementValidationV2,
    decrementValidationV2,
    resetCounts,
} = documentSlice.actions;

const store = configureStore({
    reducer: {
        documents: documentSlice.reducer,
    },
});

export default store;