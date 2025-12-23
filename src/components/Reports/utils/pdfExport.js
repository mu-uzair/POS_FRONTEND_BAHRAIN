import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generateSalesReportPDF = (reportData, dateRange) => {
  const { orders, summary } = reportData;

  // Create PDF document
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Colors
  const primaryColor = [31, 78, 120]; // #1F4E78
  const accentColor = [46, 117, 182]; // #2E75B6
  const greenColor = [2, 202, 58]; // #02ca3a

  // Company Header
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 20, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('ALSAYEDA RESTAURANT', pageWidth / 2, 12, { align: 'center' });

  // Report Title
  doc.setFillColor(...accentColor);
  doc.rect(0, 20, pageWidth, 12, 'F');
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('SALES REPORT - COMPLETED ORDERS', pageWidth / 2, 27, { align: 'center' });

  // Report Info Section
  let yPos = 40;
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Report Period:', 15, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(`${new Date(dateRange.startDate).toLocaleDateString('en-GB')} to ${new Date(dateRange.endDate).toLocaleDateString('en-GB')}`, 50, yPos);

  yPos += 6;
  doc.setFont('helvetica', 'bold');
  doc.text('Generated On:', 15, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(new Date().toLocaleString('en-GB'), 50, yPos);

  // Summary Section
  yPos += 12;
  doc.setFillColor(231, 243, 255);
  doc.rect(15, yPos - 4, pageWidth - 30, 8, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...primaryColor);
  doc.text('SUMMARY TOTALS', pageWidth / 2, yPos, { align: 'center' });

  yPos += 8;
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);

  const summaryData = [
    ['Total Orders:', summary.totalOrders.toString()],
    ['Total Gross Amount (Before VAT):', `${summary.totalGross.toFixed(3)} BHD`],
    ['Total VAT Amount (10%):', `${summary.totalVAT.toFixed(3)} BHD`],
    ['Total Net Amount (With VAT):', `${summary.totalNet.toFixed(3)} BHD`]
  ];

  summaryData.forEach(([label, value], index) => {
    doc.setFont('helvetica', 'bold');
    doc.text(label, 20, yPos);
    doc.setFont('helvetica', index === 3 ? 'bold' : 'normal');
    
    // Highlight final total
    if (index === 3) {
      doc.setFillColor(255, 217, 102);
      doc.rect(90, yPos - 4, 50, 6, 'F');
    }
    
    doc.text(value, 95, yPos);
    yPos += 6;
  });

  // Order Details Section
  yPos += 8;
  doc.setFillColor(231, 243, 255);
  doc.rect(15, yPos - 4, pageWidth - 30, 8, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...primaryColor);
  doc.text('ORDER DETAILS', pageWidth / 2, yPos, { align: 'center' });

  yPos += 8;

  // Prepare table data
  const tableData = orders.map(order => [
    new Date(order.createdAt).toLocaleDateString('en-GB'),
    order.orderId,
    parseFloat(order.grossAmount).toFixed(3),
    parseFloat(order.vatAmount).toFixed(3),
    parseFloat(order.netAmount).toFixed(3)
  ]);

  // Add table using autoTable
  autoTable(doc, {
    startY: yPos,
    head: [['Date', 'Order ID', 'Gross Amount (BHD)', 'VAT Amount (BHD)', 'Net Amount (BHD)']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: accentColor,
      textColor: [255, 255, 255],
      fontSize: 10,
      fontStyle: 'bold',
      halign: 'center'
    },
    bodyStyles: {
      fontSize: 9,
      textColor: [0, 0, 0]
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 30 },
      1: { halign: 'center', cellWidth: 50 },
      2: { halign: 'right', cellWidth: 50 },
      3: { halign: 'right', cellWidth: 50 },
      4: { halign: 'right', cellWidth: 50 }
    },
    alternateRowStyles: {
      fillColor: [248, 249, 250]
    },
    margin: { left: 15, right: 15 },
    showFoot: 'lastPage' // Only show footer on last page
  });

  // Add Grand Total Row manually after the table
  const finalTableY = doc.lastAutoTable.finalY;
  
  // Draw Grand Total Row
  doc.setFillColor(...accentColor);
  doc.rect(15, finalTableY, pageWidth - 30, 8, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  
  // Position text in the grand total row
  doc.text('GRAND TOTAL', 15 + 30 + 25, finalTableY + 5.5, { align: 'center' }); // Center in Order ID column
  doc.text(summary.totalGross.toFixed(3), 15 + 30 + 50 + 45, finalTableY + 5.5, { align: 'right' });
  doc.text(summary.totalVAT.toFixed(3), 15 + 30 + 50 + 50 + 45, finalTableY + 5.5, { align: 'right' });
  doc.text(summary.totalNet.toFixed(3), 15 + 30 + 50 + 50 + 50 + 45, finalTableY + 5.5, { align: 'right' });

  // Footer
  const finalY = finalTableY + 18; // Position after grand total row
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(127, 127, 127);
  doc.text(
    `Generated by Alsayeda POS System | ${new Date().toLocaleDateString('en-GB')} ${new Date().toLocaleTimeString('en-GB')}`,
    pageWidth / 2,
    finalY < pageHeight - 10 ? finalY : pageHeight - 10,
    { align: 'center' }
  );

  // Generate filename
  const filename = `Alsayeda_Sales_Report_${dateRange.startDate.replace(/\//g, '-')}_to_${dateRange.endDate.replace(/\//g, '-')}.pdf`;

  // Download PDF
  doc.save(filename);
};