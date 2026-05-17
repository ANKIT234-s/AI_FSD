const axios = require('axios');
const Candidate = require('../models/Candidate');

exports.aiShortlist = async (req, res) => {
  try {
    const { requiredSkills, preferredSkills, minExperience, jobDescription } = req.body;

    if (!requiredSkills || !jobDescription) {
      return res.status(400).json({ message: 'requiredSkills and jobDescription are required' });
    }

    // Fetch all candidates (in a real app, maybe only fetch basic matched ones to save tokens)
    const candidates = await Candidate.find().select('name skills experience projects');

    if (candidates.length === 0) {
      return res.status(400).json({ message: 'No candidates available to match' });
    }

    const openRouterApiKey = process.env.OPENROUTER_API_KEY;
    if (!openRouterApiKey) {
      return res.status(500).json({ message: 'OPENROUTER_API_KEY is not configured' });
    }

    const systemPrompt = `You are an advanced AI recruitment assistant.
Analyze candidates based on:
- Required skills
- Preferred skills
- Experience
- Project relevance
- Overall suitability

Provide:
- Ranking (High Match, Medium Match, Low Match)
- Match percentage
- Strengths
- Weaknesses
- Hiring recommendation
- Explanation

Return the response STRICTLY as a valid JSON array of objects.
Do not wrap it in markdown blockquotes like \`\`\`json.
Each object must have these exact keys:
- candidateId (string)
- name (string)
- ranking (string)
- matchScore (number)
- strengths (array of strings)
- weaknesses (array of strings)
- recommendation (string)
- explanation (string)
`;

    const userPrompt = `
Job Requirements:
- Required Skills: ${requiredSkills.join(', ')}
- Preferred Skills: ${preferredSkills ? preferredSkills.join(', ') : 'None'}
- Minimum Experience: ${minExperience || 0} years
- Job Description: ${jobDescription}

Candidates:
${candidates.map(c => `ID: ${c._id}\nName: ${c.name}\nSkills: ${c.skills.join(', ')}\nExperience: ${c.experience} years\nProjects/Bio: ${c.projects}`).join('\n\n')}

Analyze these candidates and return the JSON array.`;

    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'openai/gpt-4o', // Using gpt-4o as default capable model
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        response_format: { type: 'json_object' } // Help ensure JSON format
      },
      {
        headers: {
          'Authorization': `Bearer ${openRouterApiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:5173', // Adjust as needed
          'X-Title': 'Candidate Shortlisting System'
        }
      }
    );

    const aiContent = response.data.choices[0].message.content;
    let parsedData = [];
    
    try {
      // Try to parse direct JSON, handling potential markdown wrappers
      let cleanedContent = aiContent.trim();
      if (cleanedContent.startsWith('```json')) {
        cleanedContent = cleanedContent.substring(7, cleanedContent.length - 3);
      } else if (cleanedContent.startsWith('```')) {
        cleanedContent = cleanedContent.substring(3, cleanedContent.length - 3);
      }
      
      const parsed = JSON.parse(cleanedContent);
      // Sometimes models wrap the array in an object like { "candidates": [...] }
      if (Array.isArray(parsed)) {
        parsedData = parsed;
      } else if (parsed.candidates && Array.isArray(parsed.candidates)) {
        parsedData = parsed.candidates;
      } else {
        // Fallback or error case
        throw new Error('Unexpected JSON structure from AI');
      }
    } catch (parseErr) {
      console.error('Failed to parse AI response:', aiContent);
      return res.status(500).json({ message: 'Failed to parse AI response', raw: aiContent });
    }

    // Sort by match score
    parsedData.sort((a, b) => b.matchScore - a.matchScore);

    res.status(200).json(parsedData);
  } catch (error) {
    console.error('AI Shortlist Error:', error.response?.data || error.message);
    res.status(500).json({ message: 'Error communicating with AI service' });
  }
};
