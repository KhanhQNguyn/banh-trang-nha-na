import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CaretLeft, CaretRight } from '@phosphor-icons/react';
import httpHelper from '@/services/httpHelper';
import { API } from '@/config/apiConfig';
import { useUIStore } from '@/stores/uiStore';
import { formatCurrency } from '@/utils/formatCurrency';
import { formatDate } from '@/utils/formatDate';
import { cn } from '@/utils/cn';
import OrderStatusBadge from '@/components/order/OrderStatusBadge';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

const TABS = [
  { key: 'pending', label: 'Chưa xử lí', statuses: ['pending_confirmation'] },
  { key: 'processed', label: 'Đã xử lí', statuses: ['confirmed', 'shipping', 'completed'] },
  { key: 'cancelled', label: 'Đã hủy', statuses: ['cancelled'] },
];

// Which forward action(s) are available for a given current order status.
const nextActionsFor = (status) => {
  switch (status) {
    case 'pending_confirmation':
      return [{ label: 'Xác nhận', nextStatus: 'confirmed' }];
    case 'confirmed':
      return [{ label: 'Giao hàng', nextStatus: 'shipping' }];
    case 'shipping':
      return [{ label: 'Hoàn tất', nextStatus: 'completed' }];
    default:
      return [];
  }
};

const canCancel = (status) => ['pending_confirmation', 'confirmed', 'shipping'].includes(status);

const PAGE_SIZE = 10;

const OrderListPage = () => {
  const addToast = useUIStore((s) => s.addToast);

  const [activeTab, setActiveTab] = useState('pending');
  const [orders, setOrders] = useState([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, totalPages: 1 });
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('loading');
  const [actioningId, setActioningId] = useState(null);
  const [cancelTarget, setCancelTarget] = useState(null); // order being cancelled

  const tab = TABS.find((t) => t.key === activeTab);

  const fetchOrders = async () => {
    setStatus('loading');
    try {
      const res = await httpHelper.get(API.ORDERS.LIST, {
        params: { status: tab.statuses.join(','), page, limit: PAGE_SIZE },
      });
      setOrders(res.data.data);
      setMeta(res.data.meta);
      setStatus('ready');
    } catch (_) {
      setStatus('error');
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, page]);

  const handleTabChange = (key) => {
    setActiveTab(key);
    setPage(1);
  };

  const transitionOrder = async (orderId, nextStatus, cancelReason) => {
    setActioningId(orderId);
    try {
      await httpHelper.patch(API.ORDERS.UPDATE_STATUS(orderId), {
        status: nextStatus,
        ...(cancelReason !== undefined ? { cancelReason } : {}),
      });
      addToast({ type: 'success', message: 'Cập nhật trạng thái đơn hàng thành công.' });
      setCancelTarget(null);
      await fetchOrders();
    } catch (_) {
      // error toast already surfaced by the http interceptor
    } finally {
      setActioningId(null);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-stone-900">Quản lý đơn hàng</h1>

      <div className="mt-6 inline-flex rounded-xl border border-stone-200 bg-white p-1">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => handleTabChange(t.key)}
            className={cn(
              'rounded-lg px-4 py-2 text-sm font-medium transition-colors',
              activeTab === t.key ? 'bg-stone-900 text-white' : 'text-stone-600 hover:bg-stone-50'
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-stone-100 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-stone-100 bg-stone-50 text-xs uppercase tracking-wide text-stone-500">
            <tr>
              <th className="px-5 py-3 font-medium">Mã đơn</th>
              <th className="px-5 py-3 font-medium">Khách hàng</th>
              <th className="px-5 py-3 font-medium">Ngày đặt</th>
              <th className="px-5 py-3 font-medium">Tổng tiền</th>
              <th className="px-5 py-3 font-medium">Trạng thái</th>
              <th className="px-5 py-3 font-medium">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {status === 'loading' &&
              Array.from({ length: 4 }).map((_, i) => (
                <tr key={i}>
                  <td colSpan={6} className="px-5 py-4">
                    <div className="h-4 w-full animate-pulse rounded bg-stone-100" />
                  </td>
                </tr>
              ))}

            {status === 'error' && (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-stone-500">
                  Không thể tải danh sách đơn hàng.
                </td>
              </tr>
            )}

            {status === 'ready' && orders.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-stone-500">
                  Không có đơn hàng nào ở mục này.
                </td>
              </tr>
            )}

            {status === 'ready' &&
              orders.map((order) => (
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
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-2">
                      {nextActionsFor(order.status).map((action) => (
                        <button
                          key={action.nextStatus}
                          type="button"
                          disabled={actioningId === order.id}
                          onClick={() => transitionOrder(order.id, action.nextStatus)}
                          className="rounded-lg bg-stone-900 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-stone-800 disabled:cursor-not-allowed disabled:bg-stone-300"
                        >
                          {action.label}
                        </button>
                      ))}
                      {canCancel(order.status) && (
                        <button
                          type="button"
                          disabled={actioningId === order.id}
                          onClick={() => setCancelTarget(order)}
                          className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Hủy
                        </button>
                      )}
                    </div>
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

      <ConfirmDialog
        open={Boolean(cancelTarget)}
        title={`Hủy đơn hàng ${cancelTarget?.orderNumber || ''}?`}
        description="Đơn hàng sẽ được đánh dấu là đã hủy và không thể hoàn tác."
        confirmLabel="Hủy đơn"
        withReason
        onClose={() => setCancelTarget(null)}
        onConfirm={(reason) => transitionOrder(cancelTarget.id, 'cancelled', reason)}
      />
    </div>
  );
};

export default OrderListPage;
