export default function StatCard({ label, value, icon: Icon, tone = 'default', suffix, onClick }) {
  const tones = {
    default: 'text-text-primary bg-neutral-50',
    brand: 'text-brand-600 bg-brand-50',
    success: 'text-success-600 bg-success-50',
    warning: 'text-warning-600 bg-warning-50',
    danger: 'text-danger-600 bg-danger-50',
  };
  const Comp = onClick ? 'button' : 'div';
  return (
    <Comp
      onClick={onClick}
      className={`card p-4 flex items-start justify-between text-left w-full ${onClick ? 'hover:border-brand-400/50 hover:shadow-pop transition-all cursor-pointer' : ''}`}
    >
      <div>
        <p className="text-[12.5px] text-text-secondary font-medium">{label}</p>
        <p className="text-[24px] font-semibold text-text-primary mt-1.5 leading-none">
          {value}
          {suffix && <span className="text-[13px] font-medium text-text-muted ml-1">{suffix}</span>}
        </p>
      </div>
      {Icon && (
        <span className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${tones[tone]}`}>
          <Icon size={17} strokeWidth={2} />
        </span>
      )}
    </Comp>
  );
}
