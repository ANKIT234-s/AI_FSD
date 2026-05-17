const Candidate = require('../models/Candidate');

exports.matchCandidates = async (req, res) => {
  try {
    const { requiredSkills, preferredSkills, minExperience } = req.body;

    if (!requiredSkills || !Array.isArray(requiredSkills)) {
      return res.status(400).json({ message: 'requiredSkills array is required' });
    }

    const candidates = await Candidate.find();

    const matchedCandidates = candidates.map(candidate => {
      // Experience check (we don't strictly filter them out, just might note it, or filter if requested)
      const meetsExperience = candidate.experience >= (minExperience || 0);

      // Required Skills matching
      const reqSkillsMatched = candidate.skills.filter(skill =>
        requiredSkills.map(s => s.toLowerCase()).includes(skill.toLowerCase())
      );
      
      const missingSkills = requiredSkills.filter(reqSkill => 
        !candidate.skills.some(skill => skill.toLowerCase() === reqSkill.toLowerCase())
      );

      // Score calculation (basic: based on required skills only)
      let score = 0;
      if (requiredSkills.length > 0) {
        score = reqSkillsMatched.length / requiredSkills.length;
      } else if (meetsExperience) {
        score = 1;
      }

      // Add a tiny bit of score for preferred skills
      let prefSkillsMatched = [];
      if (preferredSkills && Array.isArray(preferredSkills)) {
        prefSkillsMatched = candidate.skills.filter(skill =>
          preferredSkills.map(s => s.toLowerCase()).includes(skill.toLowerCase())
        );
        // Small bump for preferred skills (max 20% extra)
        if (preferredSkills.length > 0) {
          const prefScore = prefSkillsMatched.length / preferredSkills.length;
          score = Math.min(score + (prefScore * 0.2), 1); 
        }
      }

      const matchScore = Math.round(score * 100);

      let ranking = 'Low Match';
      if (matchScore >= 80) ranking = 'High Match';
      else if (matchScore >= 50) ranking = 'Medium Match';

      return {
        _id: candidate._id,
        name: candidate.name,
        email: candidate.email,
        experience: candidate.experience,
        skills: candidate.skills,
        projects: candidate.projects,
        matchedSkills: [...reqSkillsMatched, ...prefSkillsMatched],
        missingSkills,
        matchScore,
        ranking,
        meetsExperience
      };
    }).sort((a, b) => b.matchScore - a.matchScore);

    res.status(200).json(matchedCandidates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
