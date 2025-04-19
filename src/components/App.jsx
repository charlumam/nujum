import React, { useState } from 'react';
import ScoreForm from './ScoreForm.jsx';
import Results from './Results.jsx';

// load all JSON data under data/ptn on component initialization using Vite glob with eager option
const modules = import.meta.glob('../data/ptn/**/*.json', { eager: true, as: 'json' });
const allData = Object.values(modules);
const allUnis = allData.map(data => {
  const info = data.informasi_universitas;
  const prodiList = (data.daftar_prodi || []).map(p => ({
    nama: p.NAMA,
    dayaTampung: p['SEBARAN DATA']['Daya Tampung']['2025'],
  }));
  return { name: info['Nama Universitas'], prodi: prodiList };
});

export default function App() {
  // will hold null before search and array of results after
  const [eligibleUnis, setEligibleUnis] = useState(null);

  const handleScoresSubmit = (scores) => {
    console.log('Scores submitted:', scores);
    alert('Mencari universitas berdasarkan skor Anda...');
    // For now, just display all loaded universities to confirm data load
    console.log('Loaded universities count:', allUnis.length);
    console.log('Sample university names:', allUnis.slice(0,5).map(u => u.name));
    setEligibleUnis(allUnis);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      <ScoreForm onSubmit={handleScoresSubmit} />
      {eligibleUnis !== null && <Results universities={eligibleUnis} />}
    </div>
  );
}