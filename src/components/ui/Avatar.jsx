function initials(name = '') {
  const parts = name.trim().split(' ').filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const SIZES = {
  sm: 'w-7 h-7 text-[11px]',
  md: 'w-9 h-9 text-[13px]',
  lg: 'w-12 h-12 text-[16px]',
};

export default function Avatar({ name, color = '#3F5CF5', size = 'md', className = '' }) {
  return (
    <div
      className={`shrink-0 rounded-full flex items-center justify-center font-semibold text-white ${SIZES[size]} ${className}`}
      style={{ backgroundColor: color }}
    >
      {initials(name)}
    </div>
  );
}
