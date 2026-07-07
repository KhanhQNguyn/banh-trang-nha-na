import { useEffect, useMemo, useState } from 'react';
import { FileCsv, FilePdf, GoogleLogo, MagnifyingGlass } from '@phosphor-icons/react';
import httpHelper from '@/services/httpHelper';
import { API } from '@/config/apiConfig';
import { useUIStore } from '@/stores/uiStore';
import { formatCurrency } from '@/utils/formatCurrency';
import { formatDate } from '@/utils/formatDate';
import { downloadCustomersCsv, downloadCustomersForGoogleSheets } from '@/utils/exportCustomers';

// There is no separate customer/account system in this store (guest checkout
// only, Order.userId is always null). "Customers who have purchased" is
// therefore derived by grouping orders by phone number, not a real backend
// resource. This scales fine for a boutique catalog; if order volume grows
// large, replace with a dedicated aggregation endpoint instead of fetching
// everything client-side.
const MAX_ORDERS_SCANNED = 200;

const buildCustomers = (orders) => {
  const byPhone = new Map();

  for (const order of orders) {
    const { fullName, phone, email, address } = order.customerSnapshot;
    const existing = byPhone.get(phone);

    if (!existing) {
      byPhone.set(phone, {
        phone,
        fullName,
        email,
        address,
        orderCount: 1,
        totalSpent: order.status === 'cancelled' ? 0 : order.total,
        lastOrderAt: order.createdAt,
      });
    } else {
      existing.orderCount += 1;
      if (order.status !== 'cancelled') existing.totalSpent += order.total;
      if (new Date(order.createdAt) > new Date(existing.lastOrderAt)) {
        existing.fullName = fullName;
        existing.email = email || existing.email;
        existing.address = address;
        existing.lastOrderAt = order.createdAt;
      }
    }
  }

  return [...byPhone.values()].sort((a, b) => new Date(b.lastOrderAt) - new Date(a.lastOrderAt));
};

const CustomerListPage = () => {
  const addToast = useUIStore((s) => s.addToast);
  const [customers, setCustomers] = useState([]);
  const [status, setStatus] = useState('loading');
  const [search, setSearch] = useState('');

  useEffect(() => {
    httpHelper
      .get(API.ORDERS.LIST, { params: { limit: MAX_ORDERS_SCANNED, page: 1 } })
      .then((res) => {
        setCustomers(buildCustomers(res.data.data));
        setStatus('ready');
      })
      .catch(() => setStatus('error'));
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return customers;
    return customers.filter(
      (c) => c.fullName.toLowerCase().includes(q) || c.phone.includes(q)
    );
  }, [customers, search]);

  const handleGoogleSheetsExport = () => {
    downloadCustomersForGoogleSheets(filtered);
    addToast({
      type: 'info',
      message: 'Đã tải file CSV. Mở Google Sheets, chọn File > Import > Upload để nhập dữ liệu.',
      duration: 7000,
    });
  };

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Khách hàng đã mua</h1>
          <p className="mt-1 text-sm text-stone-500">
            Danh sách được tổng hợp từ thông tin khách nhập ở form đặt hàng (họ tên, số điện thoại, địa chỉ), do cửa hàng chỉ nhận đặt hàng dạng khách vãng lai.
          </p>
        </div>

        <div className="flex flex-shrink-0 gap-2 print:hidden">
          <button
            type="button"
            disabled={filtered.length === 0}
            onClick={() => downloadCustomersCsv(filtered)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FileCsv size={16} />
            Xuất CSV
          </button>
          <button
            type="button"
            disabled={filtered.length === 0}
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FilePdf size={16} />
            Xuất PDF
          </button>
          <button
            type="button"
            disabled={filtered.length === 0}
            onClick={handleGoogleSheetsExport}
            title="Tải CSV để nhập vào Google Sheets (chưa có tích hợp API trực tiếp)"
            className="inline-flex items-center gap-1.5 rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <GoogleLogo size={16} />
            Xuất Google Sheet
          </button>
        </div>
      </div>

      <div className="relative mt-6 max-w-sm print:hidden">
        <MagnifyingGlass size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tìm theo tên hoặc số điện thoại"
          className="w-full rounded-xl border border-stone-200 bg-white py-2.5 pl-10 pr-3.5 text-sm text-stone-900 placeholder:text-stone-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
        />
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-stone-100 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-stone-100 bg-stone-50 text-xs uppercase tracking-wide text-stone-500">
            <tr>
              <th className="px-5 py-3 font-medium">Khách hàng</th>
              <th className="px-5 py-3 font-medium">Liên hệ</th>
              <th className="px-5 py-3 font-medium">Số đơn</th>
              <th className="px-5 py-3 font-medium">Tổng chi tiêu</th>
              <th className="px-5 py-3 font-medium">Mua gần nhất</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {status === 'loading' &&
              Array.from({ length: 4 }).map((_, i) => (
                <tr key={i}>
                  <td colSpan={5} className="px-5 py-4">
                    <div className="h-4 w-full animate-pulse rounded bg-stone-100" />
                  </td>
                </tr>
              ))}

            {status === 'error' && (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-stone-500">
                  Không thể tải danh sách khách hàng.
                </td>
              </tr>
            )}

            {status === 'ready' && filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-stone-500">
                  Không tìm thấy khách hàng nào.
                </td>
              </tr>
            )}

            {status === 'ready' &&
              filtered.map((customer) => (
                <tr key={customer.phone}>
                  <td className="px-5 py-4">
                    <p className="font-medium text-stone-900">{customer.fullName}</p>
                    {customer.address && <p className="text-xs text-stone-500">{customer.address}</p>}
                  </td>
                  <td className="px-5 py-4 text-stone-600">
                    <p>{customer.phone}</p>
                    {customer.email && <p className="text-xs text-stone-500">{customer.email}</p>}
                  </td>
                  <td className="px-5 py-4 text-stone-600 tabular-nums">{customer.orderCount}</td>
                  <td className="px-5 py-4 font-medium text-stone-900 tabular-nums">
                    {formatCurrency(customer.totalSpent)}
                  </td>
                  <td className="px-5 py-4 text-stone-600">{formatDate(customer.lastOrderAt)}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerListPage;
