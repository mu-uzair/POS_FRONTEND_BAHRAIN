
import React from 'react';

const DineInTakeAwayModal = ({ isOpen, onClose, onDineIn, handleTakeAway, handleDelivery  }) => {
  if (!isOpen) return null; // Ensure modal only renders when isOpen is true

  return (
    <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
      <div className='bg-[#1a1a1a] shadow-lg w-full max-w-lg mx-4 rounded-lg p-4'>
        <div className='flex justify-between items-center px-6 py-4 border-b border-[#333]'>
          <h2 className='text-lg text-[#f5f5f5]'>Choose Order Option</h2>
          <button className='text-gray-500 text-2xl hover:text-gray-300' onClick={onClose}>
            &times;
          </button>
        </div>
        <div className='p-6'>
          <button
            onClick={onDineIn}
            className="w-full bg-[#F6B100] text-[#f5f5f5] rounded-lg py-3 mb-4 hover:bg-yellow-700"
          >
            Dine-In
          </button>
          <button
            onClick={handleTakeAway}
            className="w-full bg-[#F6B100] text-[#f5f5f5] rounded-lg py-3 mb-4 hover:bg-yellow-700"
          >
            Take Away
          </button>
          <button
            onClick={handleDelivery }
            className="w-full bg-[#F6B100] text-[#f5f5f5] rounded-lg py-3 hover:bg-yellow-700"
          >
            Delivery
          </button>
        </div>
      </div>
    </div>
  );
};

export default DineInTakeAwayModal;