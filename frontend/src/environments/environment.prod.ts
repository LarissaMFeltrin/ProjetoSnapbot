// A URL será injetada pelo script de build do Render
declare const window: any;
const apiUrl = window.__API_URL__ || 'https://snapbot-backend.onrender.com/api';

export const environment = {
    production: true,
    apiUrl: apiUrl
};

