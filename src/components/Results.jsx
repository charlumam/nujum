import React from 'react';

export default function Results({ universities }) {
  if (!universities || universities.length === 0) {
    return (
      <div className="p-6 bg-white rounded-lg shadow text-gray-700">
        Belum ada universitas yang sesuai dengan skor Anda.
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Universitas yang Bisa Kamu Pilih</h2>
      <ul className="space-y-4">
        {universities.map((u, idx) => (
          <li key={u.id ?? idx} className="border rounded-md p-4">
            <h3 className="text-lg font-medium text-indigo-600">{u.name}</h3>
            <p>Min Total Score: <span className="font-semibold">{u.min_total_score}</span></p>
            <p>Kuota Tahun Ini: <span className="font-semibold">{u.spots}</span></p>
          </li>
        ))}
      </ul>
    </div>
  );
}