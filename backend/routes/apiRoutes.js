const express = require('express');
const router = express.Router();

const { addCandidate, getAllCandidates } = require('../controllers/candidateController');
const { matchCandidates } = require('../controllers/matchController');
const { aiShortlist } = require('../controllers/aiController');

// Candidate routes
router.post('/candidates', addCandidate);
router.get('/candidates', getAllCandidates);

// Match route (basic logic)
router.post('/match', matchCandidates);

// AI route (OpenRouter)
router.post('/ai/shortlist', aiShortlist);

module.exports = router;
