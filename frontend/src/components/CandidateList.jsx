import React from 'react';

const CandidateList = ({ candidates }) => {
  if (!candidates || candidates.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center text-gray-500">
        No candidates found. Add some to get started.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">Candidate Database ({candidates.length})</h2>
      </div>
      <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
        {candidates.map((candidate) => (
          <div key={candidate._id} className="p-4 hover:bg-gray-50 transition-colors">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-medium text-gray-900">{candidate.name}</h3>
                <p className="text-sm text-gray-500">{candidate.email}</p>
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {candidate.experience} yrs exp
              </span>
            </div>
            
            <div className="mb-2">
              <div className="flex flex-wrap gap-1 mt-1">
                {candidate.skills.map((skill, idx) => (
                  <span key={idx} className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            
            {candidate.projects && (
              <p className="text-sm text-gray-600 line-clamp-2 mt-2 bg-gray-50 p-2 rounded">
                {candidate.projects}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CandidateList;
