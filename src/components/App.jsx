import React, { useState } from 'react';
import ScoreForm from './ScoreForm.jsx';
import Results from './Results.jsx';
import universities from '../data/universities.json';

export default function App() {
  const [eligibleUnis, setEligibleUnis] = useState([]);

  const handleScoresSubmit = (scores) => {
    // sum all scores
    const total = Object.values(scores).reduce((sum, val) => sum + val, 0);
    // filter universities by minimum total score
    const filtered = universities.filter(u => total >= u.min_total_score);
    setEligibleUnis(filtered);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      <ScoreForm onSubmit={handleScoresSubmit} />
      <Results universities={eligibleUnis} />
    </div>
  );
}