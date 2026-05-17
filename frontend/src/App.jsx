import React, { useState, useEffect } from 'react';
import { getCandidates, matchCandidates, aiShortlistCandidates } from './services/api';
import CandidateForm from './components/CandidateForm';
import CandidateList from './components/CandidateList';
import JobRequirementForm from './components/JobRequirementForm';
import ShortlistedCandidates from './components/ShortlistedCandidates';
import { Users, Briefcase, Bot } from 'lucide-react';

function App() {
  const [candidates, setCandidates] = useState([]);
  const [shortlisted, setShortlisted] = useState([]);
  const [isAiMatch, setIsAiMatch] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('job'); // 'job' or 'database'

  const fetchCandidates = async () => {
    try {
      const res = await getCandidates();
      setCandidates(res.data);
    } catch (err) {
      console.error("Error fetching candidates:", err);
      setError("Failed to fetch candidates from server.");
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const handleBasicMatch = async (jobData) => {
    setLoading(true);
    setError('');
    setIsAiMatch(false);
    try {
      const res = await matchCandidates(jobData);
      setShortlisted(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error during matching');
    } finally {
      setLoading(false);
    }
  };

  const handleAiMatch = async (jobData) => {
    setLoading(true);
    setError('');
    setIsAiMatch(true);
    try {
      const res = await aiShortlistCandidates(jobData);
      setShortlisted(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error communicating with AI service');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <header className="bg-indigo-900 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Bot className="w-8 h-8 text-indigo-300" />
            <h1 className="text-2xl font-bold tracking-tight">AI-Powered Shortlisting System</h1>
          </div>
          <nav className="flex space-x-4">
            <button 
              onClick={() => setActiveTab('job')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'job' ? 'bg-indigo-800 text-white' : 'text-indigo-200 hover:bg-indigo-800 hover:text-white'}`}
            >
              <div className="flex items-center gap-2"><Briefcase size={16}/> Match Candidates</div>
            </button>
            <button 
              onClick={() => setActiveTab('database')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'database' ? 'bg-indigo-800 text-white' : 'text-indigo-200 hover:bg-indigo-800 hover:text-white'}`}
            >
              <div className="flex items-center gap-2"><Users size={16}/> Database</div>
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded shadow-sm">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700 font-medium">{error}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'job' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4">
              <JobRequirementForm 
                onMatch={handleBasicMatch} 
                onAiMatch={handleAiMatch} 
                loading={loading}
              />
            </div>
            <div className="lg:col-span-8">
              {loading ? (
                <div className="bg-white p-12 rounded-lg shadow-sm border border-gray-100 flex flex-col items-center justify-center min-h-[400px]">
                  <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600 mb-4"></div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {isAiMatch ? 'AI is analyzing candidates...' : 'Calculating match scores...'}
                  </h3>
                  <p className="text-gray-500 mt-2 text-center max-w-sm">
                    {isAiMatch ? 'Using advanced natural language processing to evaluate skills, experience, and project relevance against your requirements.' : 'Running basic skill intersection algorithms.'}
                  </p>
                </div>
              ) : (
                <ShortlistedCandidates results={shortlisted} isAiMatch={isAiMatch} />
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <CandidateForm onCandidateAdded={fetchCandidates} />
            </div>
            <div>
              <CandidateList candidates={candidates} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
