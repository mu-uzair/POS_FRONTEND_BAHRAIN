// import React from 'react';
// import BottomNav from '../components/shared/BottomNav';
// import BackButton from '../components/shared/BackButton';
// import TableCard from '../components/tables/TableCard';
// import { useState } from 'react';
// import { keepPreviousData, useQuery } from '@tanstack/react-query';
// import { getTable } from '../https';
// import { enqueueSnackbar } from 'notistack';
// import { FaSpinner } from 'react-icons/fa'; // For loading spinner

// const Tables = () => {
//   const [status, setStatus] = useState('All'); // State to track the selected status

//   // Fetch tables data
//   const {
//     data: resData,
//     isError,
//     isLoading,
//     refetch, // Function to retry fetching data
//   } = useQuery({
//     queryKey: ['tables'],
//     queryFn: async () => {
//       return await getTable();
//     },
//     placeholderData: keepPreviousData,
//   });

//   // Show error message if data fetch fails
//   if (isError) {
//     enqueueSnackbar('Failed to fetch tables. Please try again.', { variant: 'error' });
//   }

//   // Filter tables based on the selected status
//   const filteredTables = resData?.data.data.filter((table) => {
//     if (status === 'All') {
//       return true; // Show all tables
//     } else if (status === 'Booked') {
//       return table.status.toLowerCase() === 'booked'; // Match 'booked' (case-insensitive)
//     } else if (status === 'Available') {
//       // Match both 'avaliable' (misspelled) and 'Avaliable' (capitalized)
//       return table.status.toLowerCase() === 'avaliable' || table.status.toLowerCase() === 'available' ||table.status.toLowerCase() === 'Available';
//     }
//     return true; // Default to showing all tables
//   });

//   return (
//     <section className="bg-[#1f1f1f] h-[calc(100vh-5rem)] overflow-hidden">
//       <div className="flex items-center justify-between px-5 sm:px-10 py-4 mt-2">
//         <div className="flex items-center">
//           <BackButton />
//           <h1 className="text-[#f5f5f5] text-2xl font-bold tracking-wider">Tables</h1>
//         </div>
//         <div className="flex items-center justify-around gap-2 sm:gap-4">
//           <button
//             onClick={() => setStatus('All')}
//             className={`text-[#ababab] text-lg rounded-lg px-5 py-1 font-semibold tracking-wide transition-all duration-200 ${
//               status === 'All' ? 'bg-[#383838]' : ''
//             }`}
//           >
//             All
//           </button>
//           <button
//             onClick={() => setStatus('Booked')}
//             className={`text-[#ababab] text-lg rounded-lg px-5 py-1 font-semibold tracking-wide transition-all duration-200 ${
//               status === 'Booked' ? 'bg-[#383838]' : ''
//             }`}
//           >
//             Booked
//           </button>
//           <button
//             onClick={() => setStatus('Available')}
//             className={`text-[#ababab] text-lg rounded-lg px-5 py-1 font-semibold tracking-wide transition-all duration-200 ${
//               status === 'Available' ? 'bg-[#383838]' : ''
//             }`}
//           >
//             Available
//           </button>
//         </div>
//       </div>

//       {/* Loading State */}
//       {isLoading && (
//         <div className="flex justify-center items-center h-[calc(100vh-14rem)]">
//           <FaSpinner className="animate-spin text-4xl text-[#f5f5f5]" />
//         </div>
//       )}

//       {/* Error State */}
//       {isError && (
//         <div className="flex flex-col justify-center items-center h-[calc(100vh-14rem)]">
//           <p className="text-[#f5f5f5] text-lg mb-4">Failed to load tables. Please try again.</p>
//           <button
//             onClick={() => refetch()} // Retry fetching data
//             className="bg-[#383838] text-[#f5f5f5] px-4 py-2 rounded-lg hover:bg-[#484848] transition-all"
//           >
//             Retry
//           </button>
//         </div>
//       )}

//       {/* Display Tables */}
//       {!isLoading && !isError && (
//         <div className="flex flex-wrap justify-center gap-6 px-4 py-4 overflow-y-scroll hidden-scrollbar h-[calc(100vh-14rem)]">
//           {filteredTables?.length > 0 ? (
//             filteredTables.map((table) => (
//               <TableCard
//                 key={table._id}
//                 id={table._id}
//                 name={table.tableNo}
//                 status={table.status}
//                 initials={table?.currentOrder?.customerDetails.name}
//                 seats={table.seats}
//               />
//             ))
//           ) : (
//             <p className="text-[#f5f5f5] text-lg">No tables found.</p>
//           )}
//         </div>
//       )}

//       <BottomNav />
//     </section>
//   );
// };

// export default Tables;




import React, { useState, useEffect } from 'react';
import BottomNav from '../components/shared/BottomNav';
import BackButton from '../components/shared/BackButton';
import TableCard from '../components/tables/TableCard';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getTable } from '../https';
import { enqueueSnackbar } from 'notistack';
import { FaSpinner, FaWifi } from 'react-icons/fa';
import { MdCloudOff } from 'react-icons/md';
import { useOfflineMode } from '../constants/OfflineModeContext';
import { getCachedTables, saveTablesToCache } from '../utils/offlineTable';

const Tables = () => {
  const [status, setStatus] = useState('All');

  const { isOfflineMode, hasInternetConnection, manualOfflineMode } = useOfflineMode();
  const queryClient = useQueryClient();


  // ============================================
// HYDRATE REACT QUERY FROM CACHE WHEN OFFLINE
// ============================================
useEffect(() => {
  if (!isOfflineMode) return;

  console.log('📦 [TABLES] Hydrating React Query from cache');

  getCachedTables().then((cachedTables) => {
  

    queryClient.setQueryData(['tables'], {
      data: {
        data: cachedTables,
      },
    });
  });
}, [isOfflineMode, queryClient]);

  // ============================================
  // FETCH TABLES WITH OFFLINE SUPPORT
  // ============================================
  const {
    data: resData,
    isError,
    isLoading,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['tables'],
  
    queryFn: async () => {
      // 📴 OFFLINE → CACHE ONLY
      if (isOfflineMode) {
        const cached = await getCachedTables();
        return {
          data: {
            data: cached
          }
        };
      }

      // 🌐 ONLINE → API + CACHE
      const response = await getTable();
      const tables = response.data?.data || [];

      if (tables.length) {
        saveTablesToCache(tables);
      }

      return response;
    },
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false, // ✅ Don't auto-refetch on mount
    retry: false,
    enabled: true, // Always enabled
  });

  useEffect(() => {
    if (!isOfflineMode && hasInternetConnection) {
      // console.log('🌐 [TABLES] Back online, refreshing from API...');
      queryClient.invalidateQueries(['tables']);
      refetch();
    }
  }, [isOfflineMode, hasInternetConnection, queryClient, refetch]);

 
  // DEBUG: Log data changes

  useEffect(() => {
    // console.log('📊 [TABLES STATE]', {
    //   isLoading,
    //   isError,
    //   isFetching,
    //   hasData: !!resData,
    //   dataCount: resData?.data?.data?.length || 0,
    //   isOfflineMode
    // });
  }, [isLoading, isError, isFetching, resData, isOfflineMode]);

  
  // SHOW ERROR MESSAGE

  useEffect(() => {
    if (isError && !isOfflineMode) {
      enqueueSnackbar('Failed to fetch tables', {
        variant: 'error',
        autoHideDuration: 4000
      });
    }
  }, [isError, isOfflineMode]);

  
  // FILTER TABLES BY STATUS
  
  const allTables = resData?.data?.data || [];

  const filteredTables = allTables.filter((table) => {
    if (status === 'All') {
      return true;
    } else if (status === 'Booked') {
      return table.status?.toLowerCase() === 'booked';
    } else if (status === 'Available') {
      const tableStatus = table.status?.toLowerCase() || '';
      return tableStatus === 'available' || tableStatus === 'avaliable';
    }
    return true;
  });

  // Count tables by status
  const allTablesCount = allTables.length;
  const bookedCount = allTables.filter(t => t.status?.toLowerCase() === 'booked').length;
  const availableCount = allTables.filter(t => {
    const s = t.status?.toLowerCase() || '';
    return s === 'available' || s === 'avaliable';
  }).length;


  
  // RENDER
  
  return (
    <section className="bg-[#1f1f1f] h-[calc(100vh-5rem)] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 sm:px-10 py-4 mt-2">
        <div className="flex items-center gap-3">
          <BackButton />
          <h1 className="text-[#f5f5f5] text-2xl font-bold tracking-wider">
            Tables
          </h1>

          {/* Offline Indicator */}
          {isOfflineMode && (
            <div className="flex items-center gap-2 bg-yellow-600/20 px-3 py-1 rounded-full border border-yellow-500/30">
              <MdCloudOff className="text-yellow-500 text-sm" />
              <span className="text-yellow-500 text-xs font-semibold">
                Offline {manualOfflineMode ? '(Manual)' : '(Auto)'}
              </span>
            </div>
          )}

          {/* Online Indicator */}
          {!isOfflineMode && hasInternetConnection && (
            <div className="flex items-center gap-2 bg-green-600/20 px-3 py-1 rounded-full border border-green-500/30">
              <FaWifi className="text-green-500 text-sm animate-pulse" />
              <span className="text-green-500 text-xs font-semibold">
                Live
              </span>
            </div>
          )}

          
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center justify-around gap-2 sm:gap-4">
          <button
            onClick={() => setStatus('All')}
            className={`text-[#ababab] text-lg rounded-lg px-5 py-1 font-semibold tracking-wide transition-all duration-200 hover:bg-[#2f2f2f] ${status === 'All' ? 'bg-[#383838]' : ''
              }`}
          >
            All ({allTablesCount})
          </button>
          <button
            onClick={() => setStatus('Booked')}
            className={`text-[#ababab] text-lg rounded-lg px-5 py-1 font-semibold tracking-wide transition-all duration-200 hover:bg-[#2f2f2f] ${status === 'Booked' ? 'bg-[#383838]' : ''
              }`}
          >
            Booked ({bookedCount})
          </button>
          <button
            onClick={() => setStatus('Available')}
            className={`text-[#ababab] text-lg rounded-lg px-5 py-1 font-semibold tracking-wide transition-all duration-200 hover:bg-[#2f2f2f] ${status === 'Available' ? 'bg-[#383838]' : ''
              }`}
          >
            Available ({availableCount})
          </button>
        </div>
      </div>

      {/* LOADING STATE */}
      {isLoading && (
        <div className="flex flex-col justify-center items-center h-[calc(100vh-18rem)] gap-4">
          <FaSpinner className="animate-spin text-4xl text-[#f5f5f5]" />
          <p className="text-[#ababab] text-sm">
            {isOfflineMode ? 'Loading cached tables...' : 'Loading tables...'}
          </p>
        </div>
      )}

      {/* ERROR STATE */}
      {isError && !isLoading && (
        <div className="flex flex-col justify-center items-center h-[calc(100vh-18rem)]">
          <div className="text-center mb-6">
            <MdCloudOff className="text-red-500 text-5xl mx-auto mb-4" />
            <p className="text-[#f5f5f5] text-lg mb-2">
              Failed to load tables
            </p>
            <p className="text-[#ababab] text-sm mb-4">
              {isOfflineMode
                ? 'No cached data available. Connect to internet and try again.'
                : 'Please check your connection and try again.'}
            </p>
          </div>
          <button
            onClick={() => {
              console.log('🔄 [TABLES] Manual retry');
              queryClient.invalidateQueries(['tables']);
              refetch();
            }}
            className="bg-[#383838] text-[#f5f5f5] px-6 py-2 rounded-lg hover:bg-[#484848] transition-all font-semibold"
          >
            Retry
          </button>
        </div>
      )}

      {/* DISPLAY TABLES */}
      {!isLoading && !isError && (
        <>
         

          <div className="flex flex-wrap justify-center gap-6 px-4 py-4 overflow-y-scroll hidden-scrollbar h-[calc(100vh-18rem)]">
            {filteredTables.length > 0 ? (
              filteredTables.map((table) => (
                <TableCard
                  key={table._id || table.tableId}
                  id={table._id}
                  name={table.tableNo}
                  status={table.status}
                  initials={table?.currentOrder?.customerDetails?.name}
                  seats={table.seats}
                />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <div className="text-center">
                  {isOfflineMode ? (
                    <>
                      <MdCloudOff className="text-[#3a3a3a] text-4xl mx-auto mb-3" />
                      <p className="text-[#ababab] text-lg mb-2">
                        No {status !== 'All' ? status.toLowerCase() : ''} tables in cache
                      </p>
                      <p className="text-[#ababab] text-sm mb-4">
                        Connect to internet to load tables
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-[#ababab] text-lg mb-2">
                        No {status !== 'All' ? status.toLowerCase() : ''} tables found
                      </p>
                    </>
                  )}
                  {status !== 'All' && (
                    <button
                      onClick={() => setStatus('All')}
                      className="text-[#f5f5f5] underline text-sm hover:text-[#ababab] transition-colors"
                    >
                      View all tables
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </>
      )}

      <BottomNav />
    </section>
  );
};

export default Tables;