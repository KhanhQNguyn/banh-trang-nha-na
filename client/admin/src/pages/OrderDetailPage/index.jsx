import { useParams } from 'react-router-dom';

const OrderDetailPage = () => {
  const { id } = useParams();
  return (
    <div>
      <h1 className="text-2xl font-bold text-stone-800">Chi tiết đơn hàng #{id}</h1>
      <p className="mt-2 text-stone-600">Thông tin sản phẩm, khách hàng, chuyển đổi trạng thái.</p>
    </div>
  );
};

export default OrderDetailPage;
