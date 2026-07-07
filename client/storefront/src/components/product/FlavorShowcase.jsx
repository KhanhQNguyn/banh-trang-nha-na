const FLAVORS = [
  { label: 'Vừa', className: 'bg-white/95 text-brand-700' },
  { label: 'Mặn', className: 'bg-white/95 text-terracotta-700' },
  { label: 'Cay', className: 'bg-white/95 text-chili-700' },
];

const FlavorShowcase = () => {
  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-gradient-to-br from-brand-400 via-brand-500 to-chili-600 p-8 sm:p-10">
      <span className="inline-flex rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-terracotta-700">
        Đặc sản Đơn Dương, Đà Lạt
      </span>

      <div className="mt-8 flex items-end gap-3">
        <span className="text-8xl font-black leading-none text-white sm:text-9xl">3</span>
        <div className="pb-2 sm:pb-3">
          <p className="text-2xl font-bold leading-none text-white sm:text-3xl">Vị</p>
          <p className="text-sm font-semibold uppercase tracking-wide text-white/80">Tùy chọn</p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {FLAVORS.map((flavor) => (
          <span
            key={flavor.label}
            className={`rounded-full px-3 py-1.5 text-sm font-semibold ${flavor.className}`}
          >
            Vị {flavor.label}
          </span>
        ))}
      </div>
    </div>
  );
};

export default FlavorShowcase;
