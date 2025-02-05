// store.js
import documentReducer from './documentReducer';
import currencyReducer from './currencyReducer';
import sketchReducer from './sketchReducer';
import { configureStore } from '@reduxjs/toolkit';

const store = configureStore({
    reducer: {
        documents: documentReducer,
        currency: currencyReducer,
        sketch: sketchReducer
    },
});

export default store;
