import { useParams } from 'react-router-dom';

const ProductFormPage = () => {
  const { id } = useParams();
  const isEdit = !!id;

  return (
    <div>
      <h1 className="text-2xl font-bold text-stone-800">
        {isEdit ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
      </h1>
      <p className="mt-2 text-stone-600">
        Form thông tin cơ bản, quản lý phiên bản (variant), tải ảnh sản phẩm.
      </p>
    </div>
  );
};

export default ProductFormPage;
