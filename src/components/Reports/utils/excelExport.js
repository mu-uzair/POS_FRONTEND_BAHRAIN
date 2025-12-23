

// import * as XLSX from 'xlsx';

// export const generateSalesReportExcel = (reportData, dateRange) => {
//   const { orders, summary } = reportData;

//   // Create workbook
//   const wb = XLSX.utils.book_new();

//   // Summary section
//   const summaryData = [
//     ['SALES REPORT - COMPLETED ORDERS'],
//     ['Report Period:', `${new Date(dateRange.startDate).toLocaleDateString()} to ${new Date(dateRange.endDate).toLocaleDateString()}`],
//     ['Generated On:', new Date().toLocaleString()],
//     [],
//     ['SUMMARY TOTALS'],
//     ['Total Orders:', summary.totalOrders],
//     ['Total Gross Amount (Before VAT):', `BHD ${summary.totalGross.toFixed(3)}`],
//     ['Total VAT Amount (10%):', `BHD ${summary.totalVAT.toFixed(3)}`],
//     ['Total Net Amount (With VAT):', `BHD ${summary.totalNet.toFixed(3)}`],
//     [],
//     ['ORDER DETAILS']
//   ];

//   // Order details header
//   const orderHeader = [
//     ['Date', 'Order ID', 'Gross Amount (BHD)', 'VAT Amount (BHD)', 'Net Amount (BHD)']
//   ];

//   // Order details data - FIX: Handle numbers properly
//   const orderData = orders.map(order => [
//     new Date(order.createdAt).toLocaleDateString(),
//     order.orderId,
//     parseFloat(order.grossAmount).toFixed(3),
//     parseFloat(order.vatAmount).toFixed(3),
//     parseFloat(order.netAmount).toFixed(3)
//   ]);

//   // Combine all data
//   const wsData = [...summaryData, ...orderHeader, ...orderData];

//   // Create worksheet
//   const ws = XLSX.utils.aoa_to_sheet(wsData);

//   // Set column widths
//   ws['!cols'] = [
//     { wch: 15 },  // Date
//     { wch: 20 },  // Order ID
//     { wch: 20 },  // Gross Amount
//     { wch: 20 },  // VAT Amount
//     { wch: 20 }   // Net Amount
//   ];

//   // Add worksheet to workbook
//   XLSX.utils.book_append_sheet(wb, ws, 'Sales Report');

//   // Generate filename
//   const filename = `Alsayeda_Sales_Report_${dateRange.startDate}_to_${dateRange.endDate}.xlsx`;

//   // Download file
//   XLSX.writeFile(wb, filename);
// };


// import ExcelJS from 'exceljs';

// export const generateSalesReportExcel = async (reportData, dateRange) => {
//   const { orders, summary } = reportData;

//   // Create workbook and worksheet
//   const workbook = new ExcelJS.Workbook();
//   const worksheet = workbook.addWorksheet('Sales Report');

//   // Set column widths
//   worksheet.columns = [
//     { width: 15 },  // Date
//     { width: 20 },  // Order ID
//     { width: 22 },  // Gross Amount
//     { width: 22 },  // VAT Amount
//     { width: 25 }   // Net Amount
//   ];

//   // Title Row (Merged)
//   worksheet.mergeCells('A1:E1');
//   const titleCell = worksheet.getCell('A1');
//   titleCell.value = 'SALES REPORT - COMPLETED ORDERS';
//   titleCell.font = { bold: true, size: 14, color: { argb: 'FFFFFFFF' } };
//   titleCell.fill = {
//     type: 'pattern',
//     pattern: 'solid',
//     fgColor: { argb: 'FF4472C4' }
//   };
//   titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
//   worksheet.getRow(1).height = 25;

//   // Empty row
//   worksheet.addRow([]);

//   // Report Info
//   worksheet.addRow(['Report Period:', `${new Date(dateRange.startDate).toLocaleDateString()} to ${new Date(dateRange.endDate).toLocaleDateString()}`]);
//   worksheet.addRow(['Generated On:', new Date().toLocaleString()]);
  
//   // Empty row
//   worksheet.addRow([]);

//   // Summary Section
//   const summaryTitle = worksheet.addRow(['SUMMARY TOTALS']);
//   summaryTitle.font = { bold: true, size: 12 };
  
//   worksheet.addRow(['Total Orders:', summary.totalOrders]);
//   worksheet.addRow(['Total Gross Amount (Before VAT):', `BHD ${summary.totalGross.toFixed(3)}`]);
//   worksheet.addRow(['Total VAT Amount (10%):', `BHD ${summary.totalVAT.toFixed(3)}`]);
//   worksheet.addRow(['Total Net Amount (With VAT):', `BHD ${summary.totalNet.toFixed(3)}`]);

//   // Empty rows
//   worksheet.addRow([]);
//   worksheet.addRow([]);

//   // Order Details Header
//   const detailsTitle = worksheet.addRow(['ORDER DETAILS']);
//   detailsTitle.font = { bold: true, size: 12 };

//   // Table Header
//   const headerRow = worksheet.addRow(['Date', 'Order ID', 'Gross Amount (BHD)', 'VAT Amount (BHD)', 'Net Amount (BHD)']);
//   headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
//   headerRow.fill = {
//     type: 'pattern',
//     pattern: 'solid',
//     fgColor: { argb: 'FF4472C4' }
//   };
//   headerRow.alignment = { horizontal: 'center', vertical: 'middle' };
//   headerRow.height = 20;

//   // Add borders to header
//   headerRow.eachCell((cell) => {
//     cell.border = {
//       top: { style: 'thin' },
//       left: { style: 'thin' },
//       bottom: { style: 'thin' },
//       right: { style: 'thin' }
//     };
//   });

//   // Add order data
//   orders.forEach(order => {
//     const row = worksheet.addRow([
//       new Date(order.createdAt).toLocaleDateString(),
//       order.orderId,
//       parseFloat(order.grossAmount).toFixed(3),
//       parseFloat(order.vatAmount).toFixed(3),
//       parseFloat(order.netAmount).toFixed(3)
//     ]);

//     // Right-align numbers
//     row.getCell(3).alignment = { horizontal: 'right' };
//     row.getCell(4).alignment = { horizontal: 'right' };
//     row.getCell(5).alignment = { horizontal: 'right' };

//     // Add borders
//     row.eachCell((cell) => {
//       cell.border = {
//         top: { style: 'thin' },
//         left: { style: 'thin' },
//         bottom: { style: 'thin' },
//         right: { style: 'thin' }
//       };
//     });
//   });

//   // Empty row
//   worksheet.addRow([]);

//   // Totals Row
//   const totalsRow = worksheet.addRow([
//     '',
//     'TOTAL:',
//     summary.totalGross.toFixed(3),
//     summary.totalVAT.toFixed(3),
//     summary.totalNet.toFixed(3)
//   ]);
//   totalsRow.font = { bold: true };
//   totalsRow.fill = {
//     type: 'pattern',
//     pattern: 'solid',
//     fgColor: { argb: 'FFD9D9D9' }
//   };
//   totalsRow.getCell(3).alignment = { horizontal: 'right' };
//   totalsRow.getCell(4).alignment = { horizontal: 'right' };
//   totalsRow.getCell(5).alignment = { horizontal: 'right' };

//   // Generate filename
//   const filename = `Alsayeda_Sales_Report_${dateRange.startDate}_to_${dateRange.endDate}.xlsx`;

//   // Download file
//   const buffer = await workbook.xlsx.writeBuffer();
//   const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
//   const url = window.URL.createObjectURL(blob);
//   const link = document.createElement('a');
//   link.href = url;
//   link.download = filename;
//   link.click();
//   window.URL.revokeObjectURL(url);
// };



// import ExcelJS from 'exceljs';

// export const generateSalesReportExcel = async (reportData, dateRange) => {
//   const { orders, summary } = reportData;

//   // Create workbook and worksheet
//   const workbook = new ExcelJS.Workbook();
//   const worksheet = workbook.addWorksheet('Sales Report', {
//     pageSetup: { 
//       paperSize: 9, 
//       orientation: 'landscape',
//       fitToPage: true,
//       fitToWidth: 1,
//       fitToHeight: 0
//     }
//   });

//   // Set column widths
//   worksheet.columns = [
//     { width: 18 },  // Date
//     { width: 22 },  // Order ID
//     { width: 24 },  // Gross Amount
//     { width: 24 },  // VAT Amount
//     { width: 26 }   // Net Amount
//   ];

//   // Company Header (Row 1-2)
//   worksheet.mergeCells('A1:E2');
//   const companyCell = worksheet.getCell('A1');
//   companyCell.value = 'ALSAYEDA RESTAURANT';
//   companyCell.font = { bold: true, size: 18, color: { argb: 'FF1F4E78' } };
//   companyCell.alignment = { horizontal: 'center', vertical: 'middle' };
//   worksheet.getRow(1).height = 35;

//   // Report Title (Row 3)
//   worksheet.mergeCells('A3:E3');
//   const titleCell = worksheet.getCell('A3');
//   titleCell.value = 'SALES REPORT';
//   titleCell.font = { bold: true, size: 14, color: { argb: 'FFFFFFFF' } };
//   titleCell.fill = {
//     type: 'pattern',
//     pattern: 'solid',
//     fgColor: { argb: 'FF2E75B6' }
//   };
//   titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
//   titleCell.border = {
//     top: { style: 'thin', color: { argb: 'FF1F4E78' } },
//     bottom: { style: 'thin', color: { argb: 'FF1F4E78' } }
//   };
//   worksheet.getRow(3).height = 25;

//   // Empty row
//   worksheet.addRow([]);

//   // Report Info Section (Styled)
//   const dateRow = worksheet.addRow(['Report Period:', `${new Date(dateRange.startDate).toLocaleDateString('en-GB')} to ${new Date(dateRange.endDate).toLocaleDateString('en-GB')}`]);
//   dateRow.getCell(1).font = { bold: true };
//   dateRow.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF2F2F2' } };
  
//   const generatedRow = worksheet.addRow(['Generated On:', new Date().toLocaleString('en-GB')]);
//   generatedRow.getCell(1).font = { bold: true };
//   generatedRow.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF2F2F2' } };

//   // Empty row
//   worksheet.addRow([]);

//   // Summary Section Header
//   worksheet.mergeCells(`A${worksheet.lastRow.number + 1}:E${worksheet.lastRow.number + 1}`);
//   const summaryHeader = worksheet.getRow(worksheet.lastRow.number + 1);
//   summaryHeader.getCell(1).value = '📊 SUMMARY TOTALS';
//   summaryHeader.getCell(1).font = { bold: true, size: 12, color: { argb: 'FF1F4E78' } };
//   summaryHeader.getCell(1).fill = {
//     type: 'pattern',
//     pattern: 'solid',
//     fgColor: { argb: 'FFE7F3FF' }
//   };
//   summaryHeader.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };
//   summaryHeader.height = 22;

//   // Summary Data
//   const summaryData = [
//     ['Total Orders:', summary.totalOrders, '', '', ''],
//     ['Total Gross Amount (Before VAT):', '', `${summary.totalGross.toFixed(3)} BHD`, '', ''],
//     ['Total VAT Amount (10%):', '', `${summary.totalVAT.toFixed(3)} BHD`, '', ''],
//     ['Total Net Amount (With VAT):', '', `${summary.totalNet.toFixed(3)} BHD`, '', '']
//   ];

//   summaryData.forEach((data, index) => {
//     const row = worksheet.addRow(data);
//     row.getCell(1).font = { bold: true };
//     row.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF8F9FA' } };
    
//     if (index === summaryData.length - 1) {
//       row.getCell(3).font = { bold: true, size: 11, color: { argb: 'FF1F4E78' } };
//       row.getCell(3).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFD966' } };
//     }
    
//     row.getCell(3).alignment = { horizontal: 'right', vertical: 'middle' };
//     row.height = 20;
//   });

//   // Empty rows
//   worksheet.addRow([]);
//   worksheet.addRow([]);

//   // Order Details Header
//   worksheet.mergeCells(`A${worksheet.lastRow.number + 1}:E${worksheet.lastRow.number + 1}`);
//   const detailsHeader = worksheet.getRow(worksheet.lastRow.number + 1);
//   detailsHeader.getCell(1).value = '📋 ORDER DETAILS';
//   detailsHeader.getCell(1).font = { bold: true, size: 12, color: { argb: 'FF1F4E78' } };
//   detailsHeader.getCell(1).fill = {
//     type: 'pattern',
//     pattern: 'solid',
//     fgColor: { argb: 'FFE7F3FF' }
//   };
//   detailsHeader.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };
//   detailsHeader.height = 22;

//   // Table Header
//   const headerRow = worksheet.addRow(['Date', 'Order ID', 'Gross Amount (BHD)', 'VAT Amount (BHD)', 'Net Amount (BHD)']);
//   headerRow.font = { bold: true, size: 11, color: { argb: 'FFFFFFFF' } };
//   headerRow.fill = {
//     type: 'pattern',
//     pattern: 'solid',
//     fgColor: { argb: 'FF2E75B6' }
//   };
//   headerRow.alignment = { horizontal: 'center', vertical: 'middle' };
//   headerRow.height = 22;

//   headerRow.eachCell((cell) => {
//     cell.border = {
//       top: { style: 'medium', color: { argb: 'FF1F4E78' } },
//       left: { style: 'thin', color: { argb: 'FFFFFFFF' } },
//       bottom: { style: 'medium', color: { argb: 'FF1F4E78' } },
//       right: { style: 'thin', color: { argb: 'FFFFFFFF' } }
//     };
//   });

//   // Add order data with alternating row colors
//   orders.forEach((order, index) => {
//     const row = worksheet.addRow([
//       new Date(order.createdAt).toLocaleDateString('en-GB'),
//       order.orderId,
//       parseFloat(order.grossAmount).toFixed(3),
//       parseFloat(order.vatAmount).toFixed(3),
//       parseFloat(order.netAmount).toFixed(3)
//     ]);

//     // Alternating row colors
//     const bgColor = index % 2 === 0 ? 'FFFFFFFF' : 'FFF8F9FA';
    
//     row.eachCell((cell, colNumber) => {
//       cell.fill = {
//         type: 'pattern',
//         pattern: 'solid',
//         fgColor: { argb: bgColor }
//       };

//       // Right-align numbers
//       if (colNumber >= 3) {
//         cell.alignment = { horizontal: 'right', vertical: 'middle' };
//         cell.font = { size: 10 };
//       } else {
//         cell.alignment = { vertical: 'middle' };
//         cell.font = { size: 10 };
//       }

//       // Borders
//       cell.border = {
//         top: { style: 'thin', color: { argb: 'FFD3D3D3' } },
//         left: { style: 'thin', color: { argb: 'FFD3D3D3' } },
//         bottom: { style: 'thin', color: { argb: 'FFD3D3D3' } },
//         right: { style: 'thin', color: { argb: 'FFD3D3D3' } }
//       };
//     });

//     row.height = 18;
//   });

//   // Empty row
//   worksheet.addRow([]);

//   // Totals Row
//   const totalsRow = worksheet.addRow([
//     '',
//     'GRAND TOTAL',
//     summary.totalGross.toFixed(3),
//     summary.totalVAT.toFixed(3),
//     summary.totalNet.toFixed(3)
//   ]);
  
//   totalsRow.font = { bold: true, size: 11, color: { argb: 'FF1F4E78' } };
//   totalsRow.height = 24;
  
//   totalsRow.eachCell((cell, colNumber) => {
//     cell.fill = {
//       type: 'pattern',
//       pattern: 'solid',
//       fgColor: { argb: 'FFFFD966' }
//     };
    
//     if (colNumber >= 2) {
//       cell.alignment = { horizontal: 'right', vertical: 'middle' };
//     }
    
//     cell.border = {
//       top: { style: 'medium', color: { argb: 'FF1F4E78' } },
//       left: { style: 'thin', color: { argb: 'FF1F4E78' } },
//       bottom: { style: 'medium', color: { argb: 'FF1F4E78' } },
//       right: { style: 'thin', color: { argb: 'FF1F4E78' } }
//     };
//   });

//   // Footer
//   worksheet.addRow([]);
//   worksheet.addRow([]);
//   worksheet.mergeCells(`A${worksheet.lastRow.number + 1}:E${worksheet.lastRow.number + 1}`);
//   const footerRow = worksheet.getRow(worksheet.lastRow.number + 1);
//   footerRow.getCell(1).value = `Generated by Alsayeda POS System | ${new Date().toLocaleDateString('en-GB')} ${new Date().toLocaleTimeString('en-GB')}`;
//   footerRow.getCell(1).font = { italic: true, size: 9, color: { argb: 'FF7F7F7F' } };
//   footerRow.getCell(1).alignment = { horizontal: 'center' };

//   // Generate filename
//   const filename = `Alsayeda_Sales_Report_${dateRange.startDate.replace(/\//g, '-')}_to_${dateRange.endDate.replace(/\//g, '-')}.xlsx`;

//   // Download file
//   const buffer = await workbook.xlsx.writeBuffer();
//   const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
//   const url = window.URL.createObjectURL(blob);
//   const link = document.createElement('a');
//   link.href = url;
//   link.download = filename;
//   link.click();
//   window.URL.revokeObjectURL(url);
// };



import ExcelJS from 'exceljs';

export const generateSalesReportExcel = async (reportData, dateRange) => {
  const { orders, summary } = reportData;

  // Create workbook and worksheet
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Sales Report', {
    pageSetup: { 
      paperSize: 9, 
      orientation: 'landscape',
      fitToPage: true,
      fitToWidth: 1,
      fitToHeight: 0
    }
  });

  // Set column widths
  worksheet.columns = [
    { width: 16 },  // Date
    { width: 20 },  // Order ID
    { width: 20 },  // Gross Amount
    { width: 20 },  // VAT Amount
    { width: 20 }   // Net Amount
  ];

  // Company Header (Row 1)
  worksheet.mergeCells('A1:E1');
  const companyCell = worksheet.getCell('A1');
  companyCell.value = 'ALSAYEDA RESTAURANT';
  companyCell.font = { bold: true, size: 16, color: { argb: 'FF1F4E78' } };
  companyCell.alignment = { horizontal: 'center', vertical: 'middle' };
  worksheet.getRow(1).height = 30;

  // Report Title (Row 2)
  worksheet.mergeCells('A2:E2');
  const titleCell = worksheet.getCell('A2');
  titleCell.value = 'SALES REPORT - COMPLETED ORDERS';
  titleCell.font = { bold: true, size: 13, color: { argb: 'FFFFFFFF' } };
  titleCell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF2E75B6' }
  };
  titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
  worksheet.getRow(2).height = 24;

  // Empty row
  worksheet.addRow([]);

  // Report Info Section
  const dateRow = worksheet.addRow(['Report Period:', `${new Date(dateRange.startDate).toLocaleDateString('en-GB')} to ${new Date(dateRange.endDate).toLocaleDateString('en-GB')}`]);
  dateRow.getCell(1).font = { bold: true, size: 10 };
  dateRow.getCell(2).font = { size: 10 };
  
  const generatedRow = worksheet.addRow(['Generated On:', new Date().toLocaleString('en-GB')]);
  generatedRow.getCell(1).font = { bold: true, size: 10 };
  generatedRow.getCell(2).font = { size: 10 };

  // Empty row
  worksheet.addRow([]);

  // Summary Section Header
  worksheet.mergeCells(`A${worksheet.lastRow.number + 1}:E${worksheet.lastRow.number + 1}`);
  const summaryHeader = worksheet.getRow(worksheet.lastRow.number + 1);
  summaryHeader.getCell(1).value = 'SUMMARY TOTALS';
  summaryHeader.getCell(1).font = { bold: true, size: 11, color: { argb: 'FF1F4E78' } };
  summaryHeader.getCell(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFE7F3FF' }
  };
  summaryHeader.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };
  summaryHeader.height = 20;

  // Summary Data (2 columns layout)
  const totalOrdersRow = worksheet.addRow(['Total Orders:', summary.totalOrders]);
  totalOrdersRow.getCell(1).font = { bold: true, size: 10 };
  totalOrdersRow.getCell(2).font = { size: 10 };
  totalOrdersRow.getCell(2).alignment = { horizontal: 'left' };

  const grossRow = worksheet.addRow(['Total Gross Amount (Before VAT):', `${summary.totalGross.toFixed(3)} BHD`]);
  grossRow.getCell(1).font = { bold: true, size: 10 };
  grossRow.getCell(2).font = { size: 10 };
  grossRow.getCell(2).alignment = { horizontal: 'left' };

  const vatRow = worksheet.addRow(['Total VAT Amount (10%):', `${summary.totalVAT.toFixed(3)} BHD`]);
  vatRow.getCell(1).font = { bold: true, size: 10 };
  vatRow.getCell(2).font = { size: 10 };
  vatRow.getCell(2).alignment = { horizontal: 'left' };

  const netRow = worksheet.addRow(['Total Net Amount (With VAT):', `${summary.totalNet.toFixed(3)} BHD`]);
  netRow.getCell(1).font = { bold: true, size: 10, color: { argb: 'FF1F4E78' } };
  netRow.getCell(2).font = { bold: true, size: 10, color: { argb: 'FF1F4E78' } };
  netRow.getCell(2).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFFFD966' }
  };
  netRow.getCell(2).alignment = { horizontal: 'left' };

  // Empty rows
  worksheet.addRow([]);
  worksheet.addRow([]);

  // Order Details Header
  worksheet.mergeCells(`A${worksheet.lastRow.number + 1}:E${worksheet.lastRow.number + 1}`);
  const detailsHeader = worksheet.getRow(worksheet.lastRow.number + 1);
  detailsHeader.getCell(1).value = 'ORDER DETAILS';
  detailsHeader.getCell(1).font = { bold: true, size: 11, color: { argb: 'FF1F4E78' } };
  detailsHeader.getCell(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFE7F3FF' }
  };
  detailsHeader.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };
  detailsHeader.height = 20;

  // Table Header
  const headerRow = worksheet.addRow(['Date', 'Order ID', 'Gross Amount (BHD)', 'VAT Amount (BHD)', 'Net Amount (BHD)']);
  headerRow.font = { bold: true, size: 10, color: { argb: 'FFFFFFFF' } };
  headerRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF2E75B6' }
  };
  headerRow.alignment = { horizontal: 'center', vertical: 'middle' };
  headerRow.height = 20;

  headerRow.eachCell((cell) => {
    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
  });

  // Add order data with alternating row colors
  orders.forEach((order, index) => {
    const row = worksheet.addRow([
      new Date(order.createdAt).toLocaleDateString('en-GB'),
      order.orderId,
      parseFloat(order.grossAmount).toFixed(3),
      parseFloat(order.vatAmount).toFixed(3),
      parseFloat(order.netAmount).toFixed(3)
    ]);

    // Alternating row colors
    const bgColor = index % 2 === 0 ? 'FFFFFFFF' : 'FFF8F9FA';
    
    row.eachCell((cell, colNumber) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: bgColor }
      };

      cell.font = { size: 10 };

      // Center date and order ID, right-align amounts
      if (colNumber === 1 || colNumber === 2) {
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
      } else {
        cell.alignment = { horizontal: 'right', vertical: 'middle' };
      }

      // Borders
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFD3D3D3' } },
        left: { style: 'thin', color: { argb: 'FFD3D3D3' } },
        bottom: { style: 'thin', color: { argb: 'FFD3D3D3' } },
        right: { style: 'thin', color: { argb: 'FFD3D3D3' } }
      };
    });

    row.height = 18;
  });

  // Totals Row
  const totalsRow = worksheet.addRow([
    '',
    'GRAND TOTAL',
    summary.totalGross.toFixed(3),
    summary.totalVAT.toFixed(3),
    summary.totalNet.toFixed(3)
  ]);
  
  totalsRow.font = { bold: true, size: 10, color: { argb: 'FFFFFFFF' } };
  totalsRow.height = 22;
  
  totalsRow.eachCell((cell, colNumber) => {
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF2E75B6' }
    };
    
    if (colNumber === 2) {
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
    } else if (colNumber >= 3) {
      cell.alignment = { horizontal: 'right', vertical: 'middle' };
    }
    
    cell.border = {
      top: { style: 'medium', color: { argb: 'FF1F4E78' } },
      left: { style: 'thin' },
      bottom: { style: 'medium', color: { argb: 'FF1F4E78' } },
      right: { style: 'thin' }
    };
  });

  // Footer
  worksheet.addRow([]);
  worksheet.mergeCells(`A${worksheet.lastRow.number + 1}:E${worksheet.lastRow.number + 1}`);
  const footerRow = worksheet.getRow(worksheet.lastRow.number + 1);
  footerRow.getCell(1).value = `Generated by Alsayeda POS System | ${new Date().toLocaleDateString('en-GB')} ${new Date().toLocaleTimeString('en-GB')}`;
  footerRow.getCell(1).font = { italic: true, size: 9, color: { argb: 'FF7F7F7F' } };
  footerRow.getCell(1).alignment = { horizontal: 'center' };

  // Generate filename
  const filename = `Alsayeda_Sales_Report_${dateRange.startDate.replace(/\//g, '-')}_to_${dateRange.endDate.replace(/\//g, '-')}.xlsx`;

  // Download file
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  window.URL.revokeObjectURL(url);
};