import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Update if backend URL is different
});

export const addCandidate = (candidateData) => api.post('/candidates', candidateData);
export const getCandidates = () => api.get('/candidates');
export const matchCandidates = (jobData) => api.post('/match', jobData);
export const aiShortlistCandidates = (jobData) => api.post('/ai/shortlist', jobData);

export default api;
