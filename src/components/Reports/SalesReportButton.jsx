import React, { useState } from 'react';
import SalesReportModal from './SalesReportModal';

const SalesReportButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="px-6 py-3 bg-gradient-to-r from-[#02ca3a] to-[#029c2e] text-black font-bold rounded-xl hover:shadow-lg hover:scale-105 transition-all flex items-center gap-2"
      >
        <span>📊</span>
        <span>Sales Report</span>
      </button>

      <SalesReportModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
};

export default SalesReportButton;