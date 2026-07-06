import { useParams } from 'react-router-dom';

const VoucherFormPage = () => {
  const { id } = useParams();
  const isEdit = !!id;

  return (
    <div>
      <h1 className="text-2xl font-bold text-stone-800">
        {isEdit ? 'Chỉnh sửa mã giảm giá' : 'Tạo mã giảm giá mới'}
      </h1>
      <p className="mt-2 text-stone-600">Form thông tin chi tiết về mã giảm giá, giới hạn lượt dùng và ngày hiệu lực.</p>
    </div>
  );
};

export default VoucherFormPage;
