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



// import React, { useState, useEffect } from 'react';
// import BottomNav from '../components/shared/BottomNav';
// import BackButton from '../components/shared/BackButton';
// import TableCard from '../components/tables/TableCard';
// import { useQuery, useQueryClient } from '@tanstack/react-query';
// import { getTable } from '../https';
// import { enqueueSnackbar } from 'notistack';
// import { FaSpinner, FaWifi, FaCircle } from 'react-icons/fa';
// import { MdCloudOff } from 'react-icons/md';
// import { useOfflineMode } from '../constants/OfflineModeContext';
// import { fetchAndCacheTables, getCachedTables } from '../utils/offlineTable';

// const Tables = () => {
//   const [status, setStatus] = useState('All');
//   const { isOfflineMode } = useOfflineMode();
//   const queryClient = useQueryClient();

//   // ============================================
//   // FETCH TABLES WITH OFFLINE SUPPORT
//   // ============================================
//   const {
//     data: resData,
//     isError,
//     isLoading,
//     refetch,
//   } = useQuery({
//     queryKey: ['tables'],
//     queryFn: async () => {
//       if (isOfflineMode || !navigator.onLine) {
//         // ✅ OFFLINE MODE - Load from cache
//         console.log('📦 [TABLES] Loading from cache (offline)');
//         const cachedTables = await getCachedTables();

//         // Return in same format as API response
//         return {
//           data: {
//             data: cachedTables
//           }
//         };
//       }

//       // ✅ ONLINE MODE - Fetch from API and cache
//       console.log('🌐 [TABLES] Fetching from API (online)');
//       try {
//         const response = await getTable();
//         const tables = response.data?.data || [];

//         // Cache the fetched tables
//         await fetchAndCacheTables(tables);
//         console.log(`✅ [TABLES] Cached ${tables.length} tables`);

//         return response;
//       } catch (error) {
//         console.warn('⚠️ [TABLES] API failed, using cache:', error);

//         // Fallback to cache if API fails
//         const cachedTables = await getCachedTables();

//         if (cachedTables.length > 0) {
//           enqueueSnackbar('Using cached tables data', { 
//             variant: 'info',
//             autoHideDuration: 3000 
//           });

//           return {
//             data: {
//               data: cachedTables
//             }
//           };
//         }

//         throw error;
//       }
//     },
//     staleTime: 5 * 60 * 1000, // 5 minutes
//     gcTime: 30 * 60 * 1000, // 30 minutes (formerly cacheTime)
//     refetchOnWindowFocus: true,
//     retry: 2
//   });

//   // ============================================
//   // AUTO-REFRESH WHEN COMING ONLINE
//   // ============================================
//   useEffect(() => {
//     const handleOnline = () => {
//       console.log('🌐 [TABLES] Network restored, refreshing...');
//       refetch();
//     };

//     window.addEventListener('online', handleOnline);
//     return () => window.removeEventListener('online', handleOnline);
//   }, [refetch]);

//   // ============================================
//   // SHOW ERROR MESSAGE
//   // ============================================
//   useEffect(() => {
//     if (isError) {
//       enqueueSnackbar('Failed to fetch tables. Please try again.', { 
//         variant: 'error',
//         autoHideDuration: 4000
//       });
//     }
//   }, [isError]);

//   // ============================================
//   // FILTER TABLES BY STATUS
//   // ============================================
//   const filteredTables = resData?.data?.data?.filter((table) => {
//     if (status === 'All') {
//       return true;
//     } else if (status === 'Booked') {
//       return table.status?.toLowerCase() === 'booked';
//     } else if (status === 'Available') {
//       const tableStatus = table.status?.toLowerCase() || '';
//       return tableStatus === 'available' || tableStatus === 'avaliable';
//     }
//     return true;
//   }) || [];

//   // ============================================
//   // RENDER
//   // ============================================
//   return (
//     <section className="bg-[#1f1f1f] h-[calc(100vh-5rem)] overflow-hidden">
//       {/* Header */}
//       <div className="flex items-center justify-between px-5 sm:px-10 py-4 mt-2">
//         <div className="flex items-center">
//           <BackButton />
//           <h1 className="text-[#f5f5f5] text-2xl font-bold tracking-wider">
//             Tables
//           </h1>

//           {/* Offline Indicator */}
//           {isOfflineMode && (
//             <div className="ml-3 flex items-center gap-2 bg-yellow-600/20 px-3 py-1 rounded-full">
//               <MdCloudOff className="text-yellow-500 text-sm" />
//               <span className="text-yellow-500 text-xs font-semibold">
//                 Offline Mode
//               </span>
//             </div>
//           )}

//           {/* Online Indicator (when just came back online) */}
//           {!isOfflineMode && navigator.onLine && (
//             <div className="ml-3 flex items-center gap-2 opacity-50">
//               <FaWifi className="text-green-500 text-sm" />
//             </div>
//           )}
//         </div>

//         {/* Filter Buttons */}
//         <div className="flex items-center justify-around gap-2 sm:gap-4">
//           <button
//             onClick={() => setStatus('All')}
//             className={`text-[#ababab] text-lg rounded-lg px-5 py-1 font-semibold tracking-wide transition-all duration-200 hover:bg-[#2f2f2f] ${
//               status === 'All' ? 'bg-[#383838]' : ''
//             }`}
//           >
//             All
//             <span className="ml-2 text-sm">
//               ({resData?.data?.data?.length || 0})
//             </span>
//           </button>
//           <button
//             onClick={() => setStatus('Booked')}
//             className={`text-[#ababab] text-lg rounded-lg px-5 py-1 font-semibold tracking-wide transition-all duration-200 hover:bg-[#2f2f2f] ${
//               status === 'Booked' ? 'bg-[#383838]' : ''
//             }`}
//           >
//             Booked
//             <span className="ml-2 text-sm">
//               ({resData?.data?.data?.filter(t => t.status?.toLowerCase() === 'booked').length || 0})
//             </span>
//           </button>
//           <button
//             onClick={() => setStatus('Available')}
//             className={`text-[#ababab] text-lg rounded-lg px-5 py-1 font-semibold tracking-wide transition-all duration-200 hover:bg-[#2f2f2f] ${
//               status === 'Available' ? 'bg-[#383838]' : ''
//             }`}
//           >
//             Available
//             <span className="ml-2 text-sm">
//               ({resData?.data?.data?.filter(t => {
//                 const s = t.status?.toLowerCase() || '';
//                 return s === 'available' || s === 'avaliable';
//               }).length || 0})
//             </span>
//           </button>
//         </div>
//       </div>

//       {/* ============================================ */}
//       {/* LOADING STATE */}
//       {/* ============================================ */}
//       {isLoading && (
//         <div className="flex flex-col justify-center items-center h-[calc(100vh-14rem)] gap-4">
//           <FaSpinner className="animate-spin text-4xl text-[#f5f5f5]" />
//           <p className="text-[#ababab] text-sm">
//             {isOfflineMode ? 'Loading cached tables...' : 'Loading tables...'}
//           </p>
//         </div>
//       )}

//       {/* ============================================ */}
//       {/* ERROR STATE */}
//       {/* ============================================ */}
//       {isError && (
//         <div className="flex flex-col justify-center items-center h-[calc(100vh-14rem)]">
//           <div className="text-center mb-6">
//             <MdCloudOff className="text-red-500 text-5xl mx-auto mb-4" />
//             <p className="text-[#f5f5f5] text-lg mb-2">
//               Failed to load tables
//             </p>
//             <p className="text-[#ababab] text-sm mb-4">
//               {isOfflineMode 
//                 ? 'No cached data available. Please connect to the internet.'
//                 : 'Please check your connection and try again.'}
//             </p>
//           </div>
//           <button
//             onClick={() => refetch()}
//             className="bg-[#383838] text-[#f5f5f5] px-6 py-2 rounded-lg hover:bg-[#484848] transition-all font-semibold"
//           >
//             Retry
//           </button>
//         </div>
//       )}

//       {/* ============================================ */}
//       {/* DISPLAY TABLES */}
//       {/* ============================================ */}
//       {!isLoading && !isError && (
//         <div className="flex flex-wrap justify-center gap-6 px-4 py-4 overflow-y-scroll hidden-scrollbar h-[calc(100vh-14rem)]">
//           {filteredTables.length > 0 ? (
//             filteredTables.map((table) => (
//               <TableCard
//                 key={table._id || table.tableId}
//                 id={table._id}
//                 name={table.tableNo}
//                 status={table.status}
//                 initials={table?.currentOrder?.customerDetails?.name}
//                 seats={table.seats}
//               />
//             ))
//           ) : (
//             <div className="flex flex-col items-center justify-center h-full">
//               <p className="text-[#ababab] text-lg mb-2">
//                 No {status !== 'All' ? status.toLowerCase() : ''} tables found
//               </p>
//               {status !== 'All' && (
//                 <button
//                   onClick={() => setStatus('All')}
//                   className="text-[#f5f5f5] underline text-sm hover:text-[#ababab] transition-colors"
//                 >
//                   View all tables
//                 </button>
//               )}
//             </div>
//           )}
//         </div>
//       )}

//       <BottomNav />
//     </section>
//   );
// };

// export default Tables;


// import React, { useState, useEffect } from 'react';
// import BottomNav from '../components/shared/BottomNav';
// import BackButton from '../components/shared/BackButton';
// import TableCard from '../components/tables/TableCard';
// import { useQuery, useQueryClient } from '@tanstack/react-query';
// import { getTable } from '../https';
// import { enqueueSnackbar } from 'notistack';
// import { FaSpinner, FaWifi, FaCircle } from 'react-icons/fa';
// import { MdCloudOff } from 'react-icons/md';
// import { useOfflineMode } from '../constants/OfflineModeContext';
// import { fetchAndCacheTables, getCachedTables } from '../utils/offlineTable';

// const Tables = () => {
//   const [status, setStatus] = useState('All');

//   // 🎯 USE OFFLINE CONTEXT
//   const { isOfflineMode, hasInternetConnection, manualOfflineMode } = useOfflineMode();
//   const queryClient = useQueryClient();

//   // 🔍 DEBUG: Log offline state changes
//   useEffect(() => {
//     console.log('🔍 [TABLES DEBUG] Offline state changed:', {
//       isOfflineMode,
//       manualOfflineMode,
//       hasInternetConnection,
//       timestamp: new Date().toLocaleTimeString()
//     });
//   }, [isOfflineMode, manualOfflineMode, hasInternetConnection]);

//   // ============================================
//   // FETCH TABLES WITH OFFLINE SUPPORT
//   // ============================================
//   const {
//     data: resData,
//     isError,
//     isLoading,
//     refetch,
//     isFetching,
//     dataUpdatedAt,
//   } = useQuery({
//     queryKey: ['tables'],
//     queryFn: async () => {
//       console.log('🔍 [TABLES QUERY] queryFn called with:', {
//         isOfflineMode,
//         manualOfflineMode,
//         hasInternetConnection,
//         timestamp: new Date().toLocaleTimeString()
//       });

//       // 🎯 CHECK OFFLINE MODE
//       if (isOfflineMode) {
//         console.log('📦 [TABLES] Loading from cache (offline mode detected)');

//         try {
//           const cachedTables = await getCachedTables();
//           console.log('📦 [TABLES] Cache result:', {
//             found: cachedTables.length > 0,
//             count: cachedTables.length,
//             sample: cachedTables[0] || null
//           });

//           if (cachedTables.length > 0) {
//             console.log(`✅ [TABLES] Returning ${cachedTables.length} cached tables`);

//             // Return in same format as API response
//             return {
//               data: {
//                 data: cachedTables
//               }
//             };
//           } else {
//             console.warn('⚠️ [TABLES] No cached tables found');
//             throw new Error('No cached tables available');
//           }
//         } catch (error) {
//           console.error('❌ [TABLES] Cache read error:', error);
//           throw error;
//         }
//       }

//       // ✅ ONLINE MODE - Fetch from API and cache
//       console.log('🌐 [TABLES] Fetching from API (online mode)');
//       try {
//         const response = await getTable();
//         const tables = response.data?.data || [];

//         console.log(`🌐 [TABLES] API returned ${tables.length} tables`);

//         // Cache the fetched tables in background
//         fetchAndCacheTables(tables)
//           .then(() => console.log(`✅ [TABLES] Successfully cached ${tables.length} tables`))
//           .catch(err => console.error('❌ [TABLES] Cache write failed:', err));

//         return response;
//       } catch (error) {
//         console.error('❌ [TABLES] API failed:', error.message);

//         // Fallback to cache if API fails
//         console.log('🔄 [TABLES] Attempting fallback to cache...');
//         try {
//           const cachedTables = await getCachedTables();

//           if (cachedTables.length > 0) {
//             console.log(`📦 [TABLES] Fallback: Using ${cachedTables.length} cached tables`);
//             enqueueSnackbar('Using cached tables data', { 
//               variant: 'info',
//               autoHideDuration: 3000 
//             });

//             return {
//               data: {
//                 data: cachedTables
//               }
//             };
//           } else {
//             console.warn('⚠️ [TABLES] Fallback failed: No cache available');
//           }
//         } catch (cacheError) {
//           console.error('❌ [TABLES] Fallback cache read error:', cacheError);
//         }

//         throw error;
//       }
//     },
//     staleTime: 5 * 60 * 1000, // 5 minutes
//     gcTime: 30 * 60 * 1000, // 30 minutes
//     refetchOnWindowFocus: false, // Disable auto refetch
//     refetchOnMount: true, // Always fetch on mount
//     retry: false, // Disable retries for clearer debugging
//     enabled: true, // Always enabled
//   });

//   // 🔍 DEBUG: Log query state changes
//   useEffect(() => {
//     console.log('🔍 [TABLES QUERY STATE]', {
//       isLoading,
//       isError,
//       isFetching,
//       hasData: !!resData,
//       dataCount: resData?.data?.data?.length || 0,
//       lastUpdate: dataUpdatedAt ? new Date(dataUpdatedAt).toLocaleTimeString() : 'never'
//     });
//   }, [isLoading, isError, isFetching, resData, dataUpdatedAt]);

//   // ============================================
//   // MANUAL REFETCH WHEN TOGGLING OFFLINE MODE
//   // ============================================
//   useEffect(() => {
//     console.log('🔄 [TABLES] Offline mode changed, triggering refetch...');
//     // Invalidate and refetch when offline state changes
//     queryClient.invalidateQueries(['tables']);
//     refetch();
//   }, [isOfflineMode, queryClient, refetch]);

//   // ============================================
//   // AUTO-REFRESH WHEN COMING ONLINE
//   // ============================================
//   useEffect(() => {
//     if (!isOfflineMode && hasInternetConnection) {
//       console.log('🌐 [TABLES] Back online, refreshing...');
//       queryClient.invalidateQueries(['tables']);
//       refetch();
//     }
//   }, [isOfflineMode, hasInternetConnection, queryClient, refetch]);

//   // ============================================
//   // SHOW ERROR MESSAGE
//   // ============================================
//   useEffect(() => {
//     if (isError) {
//       console.error('❌ [TABLES] Error state detected');
//       if (!isOfflineMode) {
//         enqueueSnackbar('Failed to fetch tables. Please try again.', { 
//           variant: 'error',
//           autoHideDuration: 4000
//         });
//       } else {
//         enqueueSnackbar('No cached tables available', { 
//           variant: 'warning',
//           autoHideDuration: 4000
//         });
//       }
//     }
//   }, [isError, isOfflineMode]);

//   // ============================================
//   // FILTER TABLES BY STATUS
//   // ============================================
//   const filteredTables = resData?.data?.data?.filter((table) => {
//     if (status === 'All') {
//       return true;
//     } else if (status === 'Booked') {
//       return table.status?.toLowerCase() === 'booked';
//     } else if (status === 'Available') {
//       const tableStatus = table.status?.toLowerCase() || '';
//       return tableStatus === 'available' || tableStatus === 'avaliable';
//     }
//     return true;
//   }) || [];

//   // 🔍 DEBUG: Log filtered tables
//   useEffect(() => {
//     console.log('🔍 [TABLES FILTERED]', {
//       status,
//       totalTables: resData?.data?.data?.length || 0,
//       filteredCount: filteredTables.length,
//       isOfflineMode
//     });
//   }, [filteredTables.length, status, resData, isOfflineMode]);

//   // Count tables by status
//   const allTablesCount = resData?.data?.data?.length || 0;
//   const bookedCount = resData?.data?.data?.filter(t => t.status?.toLowerCase() === 'booked').length || 0;
//   const availableCount = resData?.data?.data?.filter(t => {
//     const s = t.status?.toLowerCase() || '';
//     return s === 'available' || s === 'avaliable';
//   }).length || 0;

//   // ============================================
//   // RENDER
//   // ============================================
//   return (
//     <section className="bg-[#1f1f1f] h-[calc(100vh-5rem)] overflow-hidden">
//       {/* Header */}
//       <div className="flex items-center justify-between px-5 sm:px-10 py-4 mt-2">
//         <div className="flex items-center">
//           <BackButton />
//           <h1 className="text-[#f5f5f5] text-2xl font-bold tracking-wider">
//             Tables
//           </h1>

//           {/* 🎯 Offline Indicator */}
//           {isOfflineMode && (
//             <div className="ml-3 flex items-center gap-2 bg-yellow-600/20 px-3 py-1 rounded-full border border-yellow-500/30">
//               <MdCloudOff className="text-yellow-500 text-sm" />
//               <span className="text-yellow-500 text-xs font-semibold">
//                 Offline Mode {manualOfflineMode ? '(Manual)' : '(Auto)'}
//               </span>
//             </div>
//           )}

//           {/* Online Indicator */}
//           {!isOfflineMode && hasInternetConnection && (
//             <div className="ml-3 flex items-center gap-2 bg-green-600/20 px-3 py-1 rounded-full border border-green-500/30">
//               <FaWifi className="text-green-500 text-sm animate-pulse" />
//               <span className="text-green-500 text-xs font-semibold">
//                 Live
//               </span>
//             </div>
//           )}

//           {/* 🔍 DEBUG: Data Status */}
//           <div className="ml-3 text-xs text-[#ababab]">
//             ({allTablesCount} tables loaded)
//           </div>
//         </div>

//         {/* Filter Buttons */}
//         <div className="flex items-center justify-around gap-2 sm:gap-4">
//           <button
//             onClick={() => setStatus('All')}
//             className={`text-[#ababab] text-lg rounded-lg px-5 py-1 font-semibold tracking-wide transition-all duration-200 hover:bg-[#2f2f2f] ${
//               status === 'All' ? 'bg-[#383838]' : ''
//             }`}
//           >
//             All
//             <span className="ml-2 text-sm">
//               ({allTablesCount})
//             </span>
//           </button>
//           <button
//             onClick={() => setStatus('Booked')}
//             className={`text-[#ababab] text-lg rounded-lg px-5 py-1 font-semibold tracking-wide transition-all duration-200 hover:bg-[#2f2f2f] ${
//               status === 'Booked' ? 'bg-[#383838]' : ''
//             }`}
//           >
//             Booked
//             <span className="ml-2 text-sm">
//               ({bookedCount})
//             </span>
//           </button>
//           <button
//             onClick={() => setStatus('Available')}
//             className={`text-[#ababab] text-lg rounded-lg px-5 py-1 font-semibold tracking-wide transition-all duration-200 hover:bg-[#2f2f2f] ${
//               status === 'Available' ? 'bg-[#383838]' : ''
//             }`}
//           >
//             Available
//             <span className="ml-2 text-sm">
//               ({availableCount})
//             </span>
//           </button>
//         </div>
//       </div>

//       {/* 🔍 DEBUG BAR */}
//       <div className="px-5 sm:px-10 pb-2 text-xs text-[#ababab] bg-[#252525] py-2 border-b border-[#3a3a3a]">
//         <div className="flex gap-4 flex-wrap">
//           <span>Mode: {isOfflineMode ? '🔴 OFFLINE' : '🟢 ONLINE'}</span>
//           <span>Manual: {manualOfflineMode ? 'YES' : 'NO'}</span>
//           <span>Internet: {hasInternetConnection ? 'YES' : 'NO'}</span>
//           <span>Loading: {isLoading ? 'YES' : 'NO'}</span>
//           <span>Error: {isError ? 'YES' : 'NO'}</span>
//           <span>Fetching: {isFetching ? 'YES' : 'NO'}</span>
//           <span>Tables: {allTablesCount}</span>
//         </div>
//       </div>

//       {/* ============================================ */}
//       {/* LOADING STATE */}
//       {/* ============================================ */}
//       {isLoading && (
//         <div className="flex flex-col justify-center items-center h-[calc(100vh-18rem)] gap-4">
//           <FaSpinner className="animate-spin text-4xl text-[#f5f5f5]" />
//           <p className="text-[#ababab] text-sm">
//             {isOfflineMode ? 'Loading cached tables...' : 'Loading tables...'}
//           </p>
//           {isOfflineMode && (
//             <p className="text-[#ababab] text-xs">
//               Working offline with local data
//             </p>
//           )}
//         </div>
//       )}

//       {/* ============================================ */}
//       {/* ERROR STATE */}
//       {/* ============================================ */}
//       {isError && !isLoading && (
//         <div className="flex flex-col justify-center items-center h-[calc(100vh-18rem)]">
//           <div className="text-center mb-6">
//             <MdCloudOff className="text-red-500 text-5xl mx-auto mb-4" />
//             <p className="text-[#f5f5f5] text-lg mb-2">
//               Failed to load tables
//             </p>
//             <p className="text-[#ababab] text-sm mb-4">
//               {isOfflineMode 
//                 ? 'No cached data available. Please connect to the internet and try again.'
//                 : 'Please check your connection and try again.'}
//             </p>
//           </div>
//           <button
//             onClick={() => {
//               console.log('🔄 [TABLES] Manual retry clicked');
//               queryClient.invalidateQueries(['tables']);
//               refetch();
//             }}
//             className="bg-[#383838] text-[#f5f5f5] px-6 py-2 rounded-lg hover:bg-[#484848] transition-all font-semibold"
//           >
//             Retry
//           </button>
//         </div>
//       )}

//       {/* ============================================ */}
//       {/* DISPLAY TABLES */}
//       {/* ============================================ */}
//       {!isLoading && !isError && (
//         <>
//           {/* Table count info */}
//           {isOfflineMode && filteredTables.length > 0 && (
//             <div className="px-5 sm:px-10 pb-2">
//               <p className="text-[#ababab] text-xs">
//                 📦 Showing {filteredTables.length} cached {status !== 'All' ? status.toLowerCase() : ''} table{filteredTables.length !== 1 ? 's' : ''}
//               </p>
//             </div>
//           )}

//           <div className="flex flex-wrap justify-center gap-6 px-4 py-4 overflow-y-scroll hidden-scrollbar h-[calc(100vh-18rem)]">
//             {filteredTables.length > 0 ? (
//               filteredTables.map((table) => {
//                 console.log('🔍 [RENDERING TABLE]', table.tableNo, table._id);
//                 return (
//                   <TableCard
//                     key={table._id || table.tableId}
//                     id={table._id}
//                     name={table.tableNo}
//                     status={table.status}
//                     initials={table?.currentOrder?.customerDetails?.name}
//                     seats={table.seats}
//                   />
//                 );
//               })
//             ) : (
//               <div className="flex flex-col items-center justify-center h-full">
//                 <div className="text-center">
//                   {isOfflineMode ? (
//                     <>
//                       <MdCloudOff className="text-[#3a3a3a] text-4xl mx-auto mb-3" />
//                       <p className="text-[#ababab] text-lg mb-2">
//                         No {status !== 'All' ? status.toLowerCase() : ''} tables in cache
//                       </p>
//                       <p className="text-[#ababab] text-sm mb-4">
//                         Connect to the internet to load tables
//                       </p>
//                     </>
//                   ) : (
//                     <>
//                       <p className="text-[#ababab] text-lg mb-2">
//                         No {status !== 'All' ? status.toLowerCase() : ''} tables found
//                       </p>
//                     </>
//                   )}
//                   {status !== 'All' && (
//                     <button
//                       onClick={() => setStatus('All')}
//                       className="text-[#f5f5f5] underline text-sm hover:text-[#ababab] transition-colors"
//                     >
//                       View all tables
//                     </button>
//                   )}
//                 </div>
//               </div>
//             )}
//           </div>
//         </>
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
      console.log('🌐 [TABLES] Back online, refreshing from API...');
      queryClient.invalidateQueries(['tables']);
      refetch();
    }
  }, [isOfflineMode, hasInternetConnection, queryClient, refetch]);

  // ============================================
  // DEBUG: Log data changes
  // ============================================
  useEffect(() => {
    console.log('📊 [TABLES STATE]', {
      isLoading,
      isError,
      isFetching,
      hasData: !!resData,
      dataCount: resData?.data?.data?.length || 0,
      isOfflineMode
    });
  }, [isLoading, isError, isFetching, resData, isOfflineMode]);

  // ============================================
  // SHOW ERROR MESSAGE
  // ============================================
  useEffect(() => {
    if (isError && !isOfflineMode) {
      enqueueSnackbar('Failed to fetch tables', {
        variant: 'error',
        autoHideDuration: 4000
      });
    }
  }, [isError, isOfflineMode]);

  // ============================================
  // FILTER TABLES BY STATUS
  // ============================================
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


  // ============================================
  // RENDER
  // ============================================
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