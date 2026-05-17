import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : 'http://localhost:5000/api';

const api = axios.create({
  baseURL
});

export const addCandidate = (candidateData) => api.post('/candidates', candidateData);
export const getCandidates = () => api.get('/candidates');
export const matchCandidates = (jobData) => api.post('/match', jobData);
export const aiShortlistCandidates = (jobData) => api.post('/ai/shortlist', jobData);

export default api;
