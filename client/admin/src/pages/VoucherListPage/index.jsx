const VoucherListPage = () => {
  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-stone-800">Quản lý mã giảm giá</h1>
        <a href="/vouchers/new" className="bg-indigo-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-indigo-700 transition-colors">
          Thêm mã mới
        </a>
      </div>
      <p className="mt-2 text-stone-600">Danh sách mã giảm giá, số lượt sử dụng, thời hạn áp dụng.</p>
    </div>
  );
};

export default VoucherListPage;
