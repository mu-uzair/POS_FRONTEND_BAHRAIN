import React from 'react';
import BottomNav from '../components/shared/BottomNav';
import BackButton from '../components/shared/BackButton';
import TableCard from '../components/tables/TableCard';
import { useState } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getTable } from '../https';
import { enqueueSnackbar } from 'notistack';
import { FaSpinner } from 'react-icons/fa'; // For loading spinner

const Tables = () => {
  const [status, setStatus] = useState('All'); // State to track the selected status

  // Fetch tables data
  const {
    data: resData,
    isError,
    isLoading,
    refetch, // Function to retry fetching data
  } = useQuery({
    queryKey: ['tables'],
    queryFn: async () => {
      return await getTable();
    },
    placeholderData: keepPreviousData,
  });

  // Show error message if data fetch fails
  if (isError) {
    enqueueSnackbar('Failed to fetch tables. Please try again.', { variant: 'error' });
  }

  // Filter tables based on the selected status
  const filteredTables = resData?.data.data.filter((table) => {
    if (status === 'All') {
      return true; // Show all tables
    } else if (status === 'Booked') {
      return table.status.toLowerCase() === 'booked'; // Match 'booked' (case-insensitive)
    } else if (status === 'Available') {
      // Match both 'avaliable' (misspelled) and 'Avaliable' (capitalized)
      return table.status.toLowerCase() === 'avaliable' || table.status.toLowerCase() === 'available' ||table.status.toLowerCase() === 'Available';
    }
    return true; // Default to showing all tables
  });

  return (
    <section className="bg-[#1f1f1f] h-[calc(100vh-5rem)] overflow-hidden">
      <div className="flex items-center justify-between px-5 sm:px-10 py-4 mt-2">
        <div className="flex items-center">
          <BackButton />
          <h1 className="text-[#f5f5f5] text-2xl font-bold tracking-wider">Tables</h1>
        </div>
        <div className="flex items-center justify-around gap-2 sm:gap-4">
          <button
            onClick={() => setStatus('All')}
            className={`text-[#ababab] text-lg rounded-lg px-5 py-1 font-semibold tracking-wide transition-all duration-200 ${
              status === 'All' ? 'bg-[#383838]' : ''
            }`}
          >
            All
          </button>
          <button
            onClick={() => setStatus('Booked')}
            className={`text-[#ababab] text-lg rounded-lg px-5 py-1 font-semibold tracking-wide transition-all duration-200 ${
              status === 'Booked' ? 'bg-[#383838]' : ''
            }`}
          >
            Booked
          </button>
          <button
            onClick={() => setStatus('Available')}
            className={`text-[#ababab] text-lg rounded-lg px-5 py-1 font-semibold tracking-wide transition-all duration-200 ${
              status === 'Available' ? 'bg-[#383838]' : ''
            }`}
          >
            Available
          </button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center h-[calc(100vh-14rem)]">
          <FaSpinner className="animate-spin text-4xl text-[#f5f5f5]" />
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="flex flex-col justify-center items-center h-[calc(100vh-14rem)]">
          <p className="text-[#f5f5f5] text-lg mb-4">Failed to load tables. Please try again.</p>
          <button
            onClick={() => refetch()} // Retry fetching data
            className="bg-[#383838] text-[#f5f5f5] px-4 py-2 rounded-lg hover:bg-[#484848] transition-all"
          >
            Retry
          </button>
        </div>
      )}

      {/* Display Tables */}
      {!isLoading && !isError && (
        <div className="flex flex-wrap justify-center gap-6 px-4 py-4 overflow-y-scroll hidden-scrollbar h-[calc(100vh-14rem)]">
          {filteredTables?.length > 0 ? (
            filteredTables.map((table) => (
              <TableCard
                key={table._id}
                id={table._id}
                name={table.tableNo}
                status={table.status}
                initials={table?.currentOrder?.customerDetails.name}
                seats={table.seats}
              />
            ))
          ) : (
            <p className="text-[#f5f5f5] text-lg">No tables found.</p>
          )}
        </div>
      )}

      <BottomNav />
    </section>
  );
};

export default Tables;
