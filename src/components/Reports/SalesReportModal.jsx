// import React, { useState } from 'react';
// import { generateSalesReportExcel } from '../Reports/utils/excelExport';
// import { useSalesReport } from '../../hooks/Reports/useSalesReport';
// import { enqueueSnackbar } from 'notistack';

// const SalesReportModal = ({ isOpen, onClose }) => {
//   const [startDate, setStartDate] = useState('');
//   const [endDate, setEndDate] = useState('');
//   const { generateReport, isLoading } = useSalesReport();

//   const handleGenerateReport = async () => {
//     if (!startDate || !endDate) {
//       enqueueSnackbar('Please select both start and end dates', { variant: 'warning' });
//       return;
//     }

//     if (new Date(startDate) > new Date(endDate)) {
//       enqueueSnackbar('Start date must be before end date', { variant: 'error' });
//       return;
//     }

//     try {
//       // ✅ Fetch data from API
//       const result = await generateReport(startDate, endDate);
      
//       if (result.isError) {
//         throw new Error('Failed to fetch report data');
//       }

//       const reportData = result.data;

//       if (!reportData || !reportData.orders || reportData.orders.length === 0) {
//         enqueueSnackbar('No orders found for the selected date range', { variant: 'info' });
//         return;
//       }
      
//       // ✅ Generate Excel
//       generateSalesReportExcel(reportData, { startDate, endDate });
      
//       enqueueSnackbar(`Report generated! ${reportData.summary.totalOrders} orders exported.`, { 
//         variant: 'success' 
//       });
      
//       // Reset and close
//       setStartDate('');
//       setEndDate('');
//       onClose();
//     } catch (error) {
//       console.error('Report generation error:', error);
//       enqueueSnackbar('Failed to generate report. Please try again.', { variant: 'error' });
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
//       <div className="bg-gradient-to-br from-[#2a2a2a] to-[#1f1f1f] rounded-2xl w-full max-w-md border border-[#333333] shadow-2xl">
//         {/* Header */}
//         <div className="p-6 border-b border-[#333333]">
//           <div className="flex items-center justify-between">
//             <div>
//               <h2 className="text-2xl font-bold text-[#f5f5f5] mb-1">
//                 📊 Generate Sales Report
//               </h2>
//               <p className="text-sm text-[#ababab]">
//                 Export completed orders to Excel
//               </p>
//             </div>
//             <button
//               onClick={onClose}
//               disabled={isLoading}
//               className="text-[#ababab] hover:text-[#f5f5f5] transition-colors disabled:opacity-50"
//             >
//               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//               </svg>
//             </button>
//           </div>
//         </div>

//         {/* Body */}
//         <div className="p-6 space-y-5">
//           {/* Date Range Section */}
//           <div>
//             <label className="text-sm font-semibold text-[#ababab] mb-3 block uppercase tracking-wide">
//               📅 Select Date Range
//             </label>
//             <div className="space-y-3">
//               <div>
//                 <label className="text-xs text-[#7a7a7a] mb-1.5 block">
//                   Start Date
//                 </label>
//                 <input
//                   type="date"
//                   value={startDate}
//                   onChange={(e) => setStartDate(e.target.value)}
//                   max={new Date().toISOString().split('T')[0]}
//                   disabled={isLoading}
//                   className="w-full bg-[#333333] text-[#f5f5f5] rounded-lg px-4 py-3 border-2 border-[#444444] focus:border-[#02ca3a] outline-none transition-all text-sm disabled:opacity-50"
//                 />
//               </div>
//               <div>
//                 <label className="text-xs text-[#7a7a7a] mb-1.5 block">
//                   End Date
//                 </label>
//                 <input
//                   type="date"
//                   value={endDate}
//                   onChange={(e) => setEndDate(e.target.value)}
//                   min={startDate}
//                   max={new Date().toISOString().split('T')[0]}
//                   disabled={isLoading}
//                   className="w-full bg-[#333333] text-[#f5f5f5] rounded-lg px-4 py-3 border-2 border-[#444444] focus:border-[#02ca3a] outline-none transition-all text-sm disabled:opacity-50"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* File Type Section */}
//           <div>
//             <label className="text-sm font-semibold text-[#ababab] mb-3 block uppercase tracking-wide">
//               📄 File Format
//             </label>
//             <div className="bg-[#333333] rounded-lg p-4 border-2 border-[#02ca3a]">
//               <div className="flex items-center gap-3">
//                 <div className="w-10 h-10 bg-[#02ca3a]/20 rounded-lg flex items-center justify-center">
//                   <span className="text-2xl">📊</span>
//                 </div>
//                 <div>
//                   <p className="text-[#f5f5f5] font-semibold text-sm">
//                     Microsoft Excel (.xlsx)
//                   </p>
//                   <p className="text-xs text-[#ababab]">
//                     Completed orders only
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Report Contents Preview */}
//           <div>
//             <label className="text-sm font-semibold text-[#ababab] mb-3 block uppercase tracking-wide">
//               📋 Report Contents
//             </label>
//             <div className="bg-[#333333] rounded-lg p-4 space-y-2">
//               <div className="flex items-center gap-2 text-sm text-[#ababab]">
//                 <span className="text-[#02ca3a]">✓</span>
//                 <span>Date & Order ID</span>
//               </div>
//               <div className="flex items-center gap-2 text-sm text-[#ababab]">
//                 <span className="text-[#02ca3a]">✓</span>
//                 <span>Gross Amount (Before VAT)</span>
//               </div>
//               <div className="flex items-center gap-2 text-sm text-[#ababab]">
//                 <span className="text-[#02ca3a]">✓</span>
//                 <span>VAT Amount (10%)</span>
//               </div>
//               <div className="flex items-center gap-2 text-sm text-[#ababab]">
//                 <span className="text-[#02ca3a]">✓</span>
//                 <span>Net Amount (Total with VAT)</span>
//               </div>
//               <div className="flex items-center gap-2 text-sm text-[#ababab]">
//                 <span className="text-[#02ca3a]">✓</span>
//                 <span>Summary Totals</span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="p-6 border-t border-[#333333] flex gap-3">
//           <button
//             onClick={onClose}
//             disabled={isLoading}
//             className="flex-1 px-4 py-3 bg-[#333333] hover:bg-[#444444] text-[#f5f5f5] font-semibold rounded-lg transition-all text-sm disabled:opacity-50"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleGenerateReport}
//             disabled={isLoading || !startDate || !endDate}
//             className="flex-1 px-4 py-3 bg-gradient-to-r from-[#02ca3a] to-[#029c2e] hover:from-[#029c2e] hover:to-[#02ca3a] text-black font-bold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center justify-center gap-2"
//           >
//             {isLoading ? (
//               <>
//                 <div className="animate-spin rounded-full h-4 w-4 border-2 border-black border-t-transparent"></div>
//                 <span>Generating...</span>
//               </>
//             ) : (
//               <>
//                 <span>📥</span>
//                 <span>Download Report</span>
//               </>
//             )}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SalesReportModal;



import React, { useState } from 'react';
import { generateSalesReportExcel } from '../Reports/utils/excelExport';
import { generateSalesReportPDF } from '../Reports/utils/pdfExport';
import { useSalesReport } from '../../hooks/Reports/useSalesReport';
import { enqueueSnackbar } from 'notistack';

const SalesReportModal = ({ isOpen, onClose }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [fileFormat, setFileFormat] = useState('excel'); // 'excel' or 'pdf'
  const { generateReport, isLoading } = useSalesReport();

  const handleGenerateReport = async () => {
    if (!startDate || !endDate) {
      enqueueSnackbar('Please select both start and end dates', { variant: 'warning' });
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      enqueueSnackbar('Start date must be before end date', { variant: 'error' });
      return;
    }

    try {
      // ✅ Fetch data from API
      const result = await generateReport(startDate, endDate);
      
      if (result.isError) {
        throw new Error('Failed to fetch report data');
      }

      const reportData = result.data;

      if (!reportData || !reportData.orders || reportData.orders.length === 0) {
        enqueueSnackbar('No orders found for the selected date range', { variant: 'info' });
        return;
      }
      
      // ✅ Generate report based on selected format
      if (fileFormat === 'excel') {
        generateSalesReportExcel(reportData, { startDate, endDate });
      } else {
        generateSalesReportPDF(reportData, { startDate, endDate });
      }
      
      enqueueSnackbar(`${fileFormat.toUpperCase()} report generated! ${reportData.summary.totalOrders} orders exported.`, { 
        variant: 'success' 
      });
      
      // Reset and close
      setStartDate('');
      setEndDate('');
      onClose();
    } catch (error) {
      console.error('Report generation error:', error);
      enqueueSnackbar('Failed to generate report. Please try again.', { variant: 'error' });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-gradient-to-br from-[#2a2a2a] to-[#1f1f1f] rounded-2xl w-full max-w-md border border-[#333333] shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-[#333333]">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-[#f5f5f5] mb-1">
                📊 Generate Sales Report
              </h2>
              <p className="text-sm text-[#ababab]">
                Export completed orders to Excel or PDF
              </p>
            </div>
            <button
              onClick={onClose}
              disabled={isLoading}
              className="text-[#ababab] hover:text-[#f5f5f5] transition-colors disabled:opacity-50"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Date Range Section */}
          <div>
            <label className="text-sm font-semibold text-[#ababab] mb-3 block uppercase tracking-wide">
              📅 Select Date Range
            </label>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-[#7a7a7a] mb-1.5 block">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  disabled={isLoading}
                  className="w-full bg-[#333333] text-[#f5f5f5] rounded-lg px-4 py-3 border-2 border-[#444444] focus:border-[#02ca3a] outline-none transition-all text-sm disabled:opacity-50"
                />
              </div>
              <div>
                <label className="text-xs text-[#7a7a7a] mb-1.5 block">
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={startDate}
                  max={new Date().toISOString().split('T')[0]}
                  disabled={isLoading}
                  className="w-full bg-[#333333] text-[#f5f5f5] rounded-lg px-4 py-3 border-2 border-[#444444] focus:border-[#02ca3a] outline-none transition-all text-sm disabled:opacity-50"
                />
              </div>
            </div>
          </div>

          {/* File Type Section */}
          <div>
            <label className="text-sm font-semibold text-[#ababab] mb-3 block uppercase tracking-wide">
              📄 File Format
            </label>
            <div className="grid grid-cols-2 gap-3">
              {/* Excel Option */}
              <button
                onClick={() => setFileFormat('excel')}
                disabled={isLoading}
                className={`p-4 rounded-lg border-2 transition-all ${
                  fileFormat === 'excel'
                    ? 'border-[#02ca3a] bg-[#02ca3a]/10'
                    : 'border-[#444444] bg-[#333333] hover:border-[#555555]'
                } disabled:opacity-50`}
              >
                <div className="flex flex-col items-center gap-2">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    fileFormat === 'excel' ? 'bg-[#02ca3a]/20' : 'bg-[#444444]'
                  }`}>
                    <span className="text-2xl">📊</span>
                  </div>
                  <div className="text-center">
                    <p className="text-[#f5f5f5] font-semibold text-sm">
                      Excel
                    </p>
                    <p className="text-xs text-[#ababab]">
                      .xlsx
                    </p>
                  </div>
                </div>
              </button>

              {/* PDF Option */}
              <button
                onClick={() => setFileFormat('pdf')}
                disabled={isLoading}
                className={`p-4 rounded-lg border-2 transition-all ${
                  fileFormat === 'pdf'
                    ? 'border-[#02ca3a] bg-[#02ca3a]/10'
                    : 'border-[#444444] bg-[#333333] hover:border-[#555555]'
                } disabled:opacity-50`}
              >
                <div className="flex flex-col items-center gap-2">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    fileFormat === 'pdf' ? 'bg-[#02ca3a]/20' : 'bg-[#444444]'
                  }`}>
                    <span className="text-2xl">📄</span>
                  </div>
                  <div className="text-center">
                    <p className="text-[#f5f5f5] font-semibold text-sm">
                      PDF
                    </p>
                    <p className="text-xs text-[#ababab]">
                      .pdf
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Report Contents Preview */}
          <div>
            <label className="text-sm font-semibold text-[#ababab] mb-3 block uppercase tracking-wide">
              📋 Report Contents
            </label>
            <div className="bg-[#333333] rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2 text-sm text-[#ababab]">
                <span className="text-[#02ca3a]">✓</span>
                <span>Date & Order ID</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[#ababab]">
                <span className="text-[#02ca3a]">✓</span>
                <span>Gross Amount (Before VAT)</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[#ababab]">
                <span className="text-[#02ca3a]">✓</span>
                <span>VAT Amount (10%)</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[#ababab]">
                <span className="text-[#02ca3a]">✓</span>
                <span>Net Amount (Total with VAT)</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[#ababab]">
                <span className="text-[#02ca3a]">✓</span>
                <span>Summary Totals</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-[#333333] flex gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-4 py-3 bg-[#333333] hover:bg-[#444444] text-[#f5f5f5] font-semibold rounded-lg transition-all text-sm disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleGenerateReport}
            disabled={isLoading || !startDate || !endDate}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-[#02ca3a] to-[#029c2e] hover:from-[#029c2e] hover:to-[#02ca3a] text-black font-bold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-black border-t-transparent"></div>
                <span>Generating...</span>
              </>
            ) : (
              <>
                <span>📥</span>
                <span>Download {fileFormat === 'excel' ? 'Excel' : 'PDF'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SalesReportModal;