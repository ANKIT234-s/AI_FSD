import React from 'react';
import { CheckCircle, XCircle, Award } from 'lucide-react';

const ShortlistedCandidates = ({ results, isAiMatch }) => {
  if (!results || results.length === 0) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 flex flex-col items-center justify-center text-gray-500 min-h-[300px]">
        <Award className="w-12 h-12 text-gray-300 mb-3" />
        <p>No results yet. Run a match to see shortlisted candidates.</p>
      </div>
    );
  }

  const getRankColor = (ranking) => {
    switch (ranking) {
      case 'High Match': return 'bg-green-100 text-green-800 border-green-200';
      case 'Medium Match': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low Match': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 border-b border-gray-100 bg-indigo-50 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-indigo-900">
          {isAiMatch ? 'AI Shortlisted Candidates' : 'Basic Match Results'}
        </h2>
        <span className="text-sm text-indigo-700 font-medium">{results.length} found</span>
      </div>
      
      <div className="divide-y divide-gray-100 max-h-[800px] overflow-y-auto">
        {results.map((candidate, idx) => (
          <div key={candidate.candidateId || candidate._id || idx} className="p-5 hover:bg-gray-50 transition-colors">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                  <span className="bg-indigo-100 text-indigo-800 w-6 h-6 rounded-full flex items-center justify-center text-xs">
                    {idx + 1}
                  </span>
                  {candidate.name}
                </h3>
              </div>
              
              <div className="flex flex-col items-end gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getRankColor(candidate.ranking)}`}>
                  {candidate.ranking}
                </span>
                <span className="text-lg font-black text-gray-700">
                  {candidate.matchScore}% Match
                </span>
              </div>
            </div>

            {/* AI Specific Render */}
            {isAiMatch ? (
              <div className="space-y-3 mt-4">
                <div className="bg-green-50 p-3 rounded border border-green-100">
                  <h4 className="text-xs font-bold text-green-800 uppercase mb-1 flex items-center gap-1">
                    <CheckCircle size={14} /> Strengths
                  </h4>
                  <ul className="list-disc pl-5 text-sm text-green-700 space-y-1">
                    {candidate.strengths?.map((s, i) => <li key={i}>{s}</li>)}
                  </ul>
                </div>
                
                <div className="bg-red-50 p-3 rounded border border-red-100">
                  <h4 className="text-xs font-bold text-red-800 uppercase mb-1 flex items-center gap-1">
                    <XCircle size={14} /> Weaknesses
                  </h4>
                  <ul className="list-disc pl-5 text-sm text-red-700 space-y-1">
                    {candidate.weaknesses?.map((w, i) => <li key={i}>{w}</li>)}
                  </ul>
                </div>

                <div className="bg-indigo-50 p-3 rounded border border-indigo-100 mt-2">
                  <h4 className="text-xs font-bold text-indigo-800 uppercase mb-1">Recommendation</h4>
                  <p className="text-sm text-indigo-900 font-medium mb-2">{candidate.recommendation}</p>
                  <p className="text-sm text-indigo-700 italic border-t border-indigo-200 pt-2 mt-2">
                    {candidate.explanation}
                  </p>
                </div>
              </div>
            ) : (
              /* Basic Match Specific Render */
              <div className="space-y-3 mt-4">
                <div>
                  <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Matched Skills</h4>
                  <div className="flex flex-wrap gap-1">
                    {candidate.matchedSkills?.length > 0 ? (
                      candidate.matchedSkills.map((skill, i) => (
                        <span key={i} className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded border border-green-200 flex items-center gap-1">
                          <CheckCircle size={12} /> {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-gray-400">None</span>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Missing Skills</h4>
                  <div className="flex flex-wrap gap-1">
                    {candidate.missingSkills?.length > 0 ? (
                      candidate.missingSkills.map((skill, i) => (
                        <span key={i} className="px-2 py-1 text-xs bg-red-50 text-red-600 rounded border border-red-100 flex items-center gap-1">
                          <XCircle size={12} /> {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-green-600 font-medium">None! Perfect match for requirements.</span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShortlistedCandidates;
