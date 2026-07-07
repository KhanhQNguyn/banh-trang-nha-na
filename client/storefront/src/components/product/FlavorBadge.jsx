import { Fire } from '@phosphor-icons/react';
import { cn } from '@/utils/cn';

const normalize = (str = '') =>
  str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .trim();

const FLAVOR_TONES = {
  vua: { label: 'Vừa', className: 'bg-brand-100 text-brand-700' },
  man: { label: 'Mặn', className: 'bg-terracotta-100 text-terracotta-700' },
  cay: { label: 'Cay', className: 'bg-chili-100 text-chili-700', icon: Fire },
};

const FlavorBadge = ({ flavor, className }) => {
  if (!flavor) return null;

  const tone = FLAVOR_TONES[normalize(flavor)];
  const label = tone?.label ?? flavor;
  const Icon = tone?.icon;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold',
        tone?.className ?? 'bg-stone-100 text-stone-600',
        className
      )}
    >
      {Icon && <Icon size={12} weight="fill" />}
      Vị {label}
    </span>
  );
};

export default FlavorBadge;
