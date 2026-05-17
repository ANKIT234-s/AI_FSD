import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';

const JobRequirementForm = ({ onMatch, onAiMatch, loading }) => {
  const [formData, setFormData] = useState({
    requiredSkills: '',
    preferredSkills: '',
    minExperience: '',
    jobDescription: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBasicMatch = (e) => {
    e.preventDefault();
    const payload = formatPayload();
    onMatch(payload);
  };

  const handleAiMatch = (e) => {
    e.preventDefault();
    const payload = formatPayload();
    onAiMatch(payload);
  };

  const formatPayload = () => {
    return {
      requiredSkills: formData.requiredSkills.split(',').map(s => s.trim()).filter(s => s),
      preferredSkills: formData.preferredSkills.split(',').map(s => s.trim()).filter(s => s),
      minExperience: Number(formData.minExperience) || 0,
      jobDescription: formData.jobDescription
    };
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Job Requirements</h2>
      
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Required Skills (comma separated)</label>
          <input
            type="text"
            name="requiredSkills"
            value={formData.requiredSkills}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="React, Node.js"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Skills (comma separated)</label>
          <input
            type="text"
            name="preferredSkills"
            value={formData.preferredSkills}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="TypeScript, AWS"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Experience (Years)</label>
          <input
            type="number"
            name="minExperience"
            value={formData.minExperience}
            onChange={handleChange}
            min="0"
            step="0.5"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Job Description (For AI Match)</label>
          <textarea
            name="jobDescription"
            value={formData.jobDescription}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="We are looking for a full stack developer..."
            rows="4"
          ></textarea>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            type="button"
            onClick={handleBasicMatch}
            disabled={loading || !formData.requiredSkills}
            className="flex-1 bg-gray-800 hover:bg-gray-900 text-white font-medium py-2 px-4 rounded transition-colors disabled:opacity-70"
          >
            Basic Match
          </button>
          
          <button
            type="button"
            onClick={handleAiMatch}
            disabled={loading || !formData.requiredSkills || !formData.jobDescription}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
          >
            <Sparkles size={18} />
            AI Shortlist
          </button>
        </div>
        
        {(!formData.jobDescription && !loading) && (
          <p className="text-xs text-amber-600 text-center mt-2">
            * Job description is required for AI shortlisting
          </p>
        )}
      </form>
    </div>
  );
};

export default JobRequirementForm;
