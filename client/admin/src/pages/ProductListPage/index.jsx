const ProductListPage = () => {
  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-stone-800">Quản lý sản phẩm</h1>
        <a href="/products/new" className="bg-indigo-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-indigo-700 transition-colors">
          Thêm sản phẩm
        </a>
      </div>
      <p className="mt-2 text-stone-600">Danh sách sản phẩm, giá bán, tồn kho và các tùy chọn chỉnh sửa.</p>
    </div>
  );
};

export default ProductListPage;
