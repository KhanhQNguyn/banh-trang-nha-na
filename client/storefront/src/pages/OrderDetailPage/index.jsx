import { useParams } from 'react-router-dom';

const OrderDetailPage = () => {
  const { id } = useParams();
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-stone-900">Chi tiết đơn hàng</h1>
      <p className="mt-2 text-stone-600">Đơn hàng ID: {id}</p>
    </div>
  );
};

export default OrderDetailPage;
