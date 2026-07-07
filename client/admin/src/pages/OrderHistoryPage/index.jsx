import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CaretLeft, CaretRight, MagnifyingGlass } from '@phosphor-icons/react';
import httpHelper from '@/services/httpHelper';
import { API } from '@/config/apiConfig';
import { formatCurrency } from '@/utils/formatCurrency';
import { formatDate } from '@/utils/formatDate';
import OrderStatusBadge from '@/components/order/OrderStatusBadge';

const PAGE_SIZE = 10;

// Read-only historical log of every order regardless of status - a complement
// to "Quản lý đơn hàng", which is the operational workflow view. Search is
// client-side over the current page only (there's no backend text-search
// endpoint for orders yet).
const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, totalPages: 1 });
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('loading');
  const [search, setSearch] = useState('');

  useEffect(() => {
    setStatus('loading');
    httpHelper
      .get(API.ORDERS.LIST, { params: { page, limit: PAGE_SIZE } })
      .then((res) => {
        setOrders(res.data.data);
        setMeta(res.data.meta);
        setStatus('ready');
      })
      .catch(() => setStatus('error'));
  }, [page]);

  const q = search.trim().toLowerCase();
  const filtered = q
    ? orders.filter(
        (o) => o.orderNumber.toLowerCase().includes(q) || o.customerSnapshot.phone.includes(q)
      )
    : orders;

  return (
    <div>
      <h1 className="text-2xl font-bold text-stone-900">Đơn hàng đã mua</h1>
      <p className="mt-1 text-sm text-stone-500">Lịch sử toàn bộ đơn hàng, không phân biệt trạng thái.</p>

      <div className="relative mt-6 max-w-sm">
        <MagnifyingGlass size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tìm theo mã đơn hoặc số điện thoại (trang hiện tại)"
          className="w-full rounded-xl border border-stone-200 bg-white py-2.5 pl-10 pr-3.5 text-sm text-stone-900 placeholder:text-stone-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
        />
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-stone-100 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-stone-100 bg-stone-50 text-xs uppercase tracking-wide text-stone-500">
            <tr>
              <th className="px-5 py-3 font-medium">Mã đơn</th>
              <th className="px-5 py-3 font-medium">Khách hàng</th>
              <th className="px-5 py-3 font-medium">Ngày đặt</th>
              <th className="px-5 py-3 font-medium">Tổng tiền</th>
              <th className="px-5 py-3 font-medium">Trạng thái</th>
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
                  Không thể tải lịch sử đơn hàng.
                </td>
              </tr>
            )}

            {status === 'ready' && filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-stone-500">
                  Không tìm thấy đơn hàng nào.
                </td>
              </tr>
            )}

            {status === 'ready' &&
              filtered.map((order) => (
                <tr key={order.id}>
                  <td className="px-5 py-4">
                    <Link
                      to={`/orders/${order.id}`}
                      className="font-mono text-sm font-medium text-stone-900 hover:text-brand-600"
                    >
                      {order.orderNumber}
                    </Link>
                  </td>
                  <td className="px-5 py-4">
                    <p className="font-medium text-stone-900">{order.customerSnapshot.fullName}</p>
                    <p className="text-xs text-stone-500">{order.customerSnapshot.phone}</p>
                  </td>
                  <td className="px-5 py-4 text-stone-600">{formatDate(order.createdAt)}</td>
                  <td className="px-5 py-4 font-medium text-stone-900 tabular-nums">
                    {formatCurrency(order.total)}
                  </td>
                  <td className="px-5 py-4">
                    <OrderStatusBadge status={order.status} />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {status === 'ready' && meta.totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm text-stone-600">
          <span>
            Trang {meta.page} / {meta.totalPages} &middot; {meta.total} đơn hàng
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={!meta.hasPrevPage}
              onClick={() => setPage((p) => p - 1)}
              className="flex items-center gap-1 rounded-lg border border-stone-200 px-3 py-1.5 font-medium disabled:cursor-not-allowed disabled:opacity-40"
            >
              <CaretLeft size={14} />
              Trước
            </button>
            <button
              type="button"
              disabled={!meta.hasNextPage}
              onClick={() => setPage((p) => p + 1)}
              className="flex items-center gap-1 rounded-lg border border-stone-200 px-3 py-1.5 font-medium disabled:cursor-not-allowed disabled:opacity-40"
            >
              Sau
              <CaretRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderHistoryPage;
