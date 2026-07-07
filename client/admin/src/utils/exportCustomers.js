import { formatDate } from './formatDate';

const CSV_HEADERS = ['Họ tên', 'Số điện thoại', 'Email', 'Địa chỉ', 'Số đơn', 'Tổng chi tiêu', 'Mua gần nhất'];

const toRow = (customer) => [
  customer.fullName,
  customer.phone,
  customer.email || '',
  customer.address || '',
  String(customer.orderCount),
  String(customer.totalSpent),
  formatDate(customer.lastOrderAt),
];

// Wrap a field in quotes and escape embedded quotes only when needed, per RFC 4180.
const csvEscape = (value) => {
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
};

const triggerDownload = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const buildCsvBlob = (customers) => {
  const lines = [CSV_HEADERS, ...customers.map(toRow)].map((row) => row.map(csvEscape).join(','));
  // Leading BOM so Excel/Sheets opens the file as UTF-8 instead of mangling diacritics.
  return new Blob(['﻿' + lines.join('\r\n')], { type: 'text/csv;charset=utf-8;' });
};

export const downloadCustomersCsv = (customers) => {
  triggerDownload(buildCsvBlob(customers), `khach-hang-${new Date().toISOString().slice(0, 10)}.csv`);
};

// There's no Google Sheets API integration wired up (would need a service
// account + target Spreadsheet ID from the store owner, plus a backend
// endpoint to append rows). Until that's set up, this exports the same CSV
// under a name that signals its purpose - Google Sheets opens CSV directly
// via File > Import > Upload.
export const downloadCustomersForGoogleSheets = (customers) => {
  triggerDownload(
    buildCsvBlob(customers),
    `khach-hang-google-sheets-${new Date().toISOString().slice(0, 10)}.csv`
  );
};
