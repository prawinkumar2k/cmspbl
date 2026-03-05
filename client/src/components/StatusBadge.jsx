import React from 'react';

const STATUS_COLORS = {
  'New': 'bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 border-blue-300 shadow-md',
  'Interested': 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-300 shadow-md',
  'Partial': 'bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border-yellow-300 shadow-md',
  'Not Interested': 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border-gray-300 shadow-md',
  'Converted': 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-300 shadow-lg',
  'Rejected': 'bg-gradient-to-r from-red-100 to-orange-100 text-red-800 border-red-300 shadow-md',
  'Closed': 'bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border-red-300 shadow-md',
};

export function StatusBadge({ status }) {
  const colors = STATUS_COLORS[status] || 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border-gray-300';
  return (
    <span className={`px-8 py-4 rounded-full text-md font-bold border ${colors} inline-flex items-center gap-1`}>
      {status === 'Converted' && '✓'}
      {status === 'Interested' && '👁️'}
      {status === 'New' && '🆕'}
      {status === 'Partial' && '⚙️'}
      {status === 'Not Interested' && '❌'}
      {status === 'Closed' && '🚫'}
      {status === 'Rejected' && '❌'}
      {status}
    </span>
  );
}
