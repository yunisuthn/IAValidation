import axios from 'axios';
import { API_BASE_URL } from './fileService';
const API_URL = `${API_BASE_URL}/api/ocr-template`; // Change this to your actual API endpoint

const token = () => localStorage.getItem('token');

const templateService = {
    getAll: async () => {
        const response = await axios.get(API_URL, {
            headers: {
                'Authorization': `Bearer ${token()}`,
            },
        });
        return response.data;
    },

    getById: async (id) => {
        const response = await axios.get(`${API_URL}/${id}`, {
            headers: {
                'Authorization': `Bearer ${token()}`,
            },
        });
        return response.data;
    },

    create: async (data) => {
        const response = await axios.post(API_URL, data, {
            headers: {
                'Authorization': `Bearer ${token()}`,
            },
        });
        return response.data;
    },

    update: async (id, data) => {
        const response = await axios.put(`${API_URL}/${id}`, data, {
            headers: {
                'Authorization': `Bearer ${token()}`,
            },
        });
        return response.data;
    },

    delete: async (id) => {
        const response = await axios.delete(`${API_URL}/${id}`, {
            headers: {
                'Authorization': `Bearer ${token()}`,
            },
        });
        return response.data;
    }
};

export default templateService;
