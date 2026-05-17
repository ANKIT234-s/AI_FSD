const Candidate = require('../models/Candidate');

// Add Candidate
exports.addCandidate = async (req, res) => {
  try {
    const { name, email, skills, experience, projects } = req.body;
    
    if (!name || !email || experience === undefined) {
      return res.status(400).json({ message: 'Name, email, and experience are required' });
    }

    const candidate = new Candidate({
      name,
      email,
      skills: Array.isArray(skills) ? skills : [],
      experience,
      projects
    });

    await candidate.save();
    res.status(201).json(candidate);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Candidates
exports.getAllCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.find().sort({ createdAt: -1 });
    res.status(200).json(candidates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
