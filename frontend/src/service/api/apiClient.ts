// apiClient.ts
import axios from 'axios';

const BASE_URL = 'https://www.thesportsdb.com/api/v1/json/722804';

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});



export default apiClient;