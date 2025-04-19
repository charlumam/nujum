import React from 'react';

export default function Results({ universities }) {
  if (!universities || universities.length === 0) {
    return (
      <div className="max-w-md mx-auto mt-12 p-6 bg-white rounded-lg shadow-lg text-center text-gray-600">
        <p className="text-lg">Belum ada universitas yang sesuai dengan skor Anda.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-8 grid gap-6 md:grid-cols-2">
      {universities.map((u, idx) => (
        <div key={u.id ?? idx} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-2xl transition-shadow">
          <h3 className="text-xl font-semibold text-indigo-600 mb-2">{u.name}</h3>
          <p className="text-gray-700">Min Total Score: <span className="font-medium">{u.min_total_score}</span></p>
          <p className="text-gray-700">Kuota Tahun Ini: <span className="font-medium">{u.spots}</span></p>
        </div>
      ))}
    </div>
  );
}