export default function StatCard({ label, value, icon: Icon, tone = 'default', suffix, onClick }) {
  const tones = {
    default: 'text-text-primary bg-canvas',
    brand: 'text-brand-600 bg-brand-50',
    success: 'text-success-600 bg-success-50',
    warning: 'text-warning-600 bg-warning-50',
    danger: 'text-danger-600 bg-danger-50',
  };
  const Comp = onClick ? 'button' : 'div';
  return (
    <Comp
      onClick={onClick}
      className={`card p-3 sm:p-4 flex items-center justify-between text-left w-full min-w-0 ${onClick ? 'hover:border-brand-400/50 hover:shadow-pop transition-all cursor-pointer active:scale-[0.99]' : ''}`}
    >
      <div className="min-w-0 flex-1 pr-2">
        <p className="text-[11.5px] sm:text-[12.5px] text-text-secondary font-medium truncate">{label}</p>
        <p className="text-[20px] sm:text-[24px] font-semibold text-text-primary mt-1 sm:mt-1.5 leading-none">
          {value}
          {suffix && <span className="text-[12px] sm:text-[13px] font-medium text-text-muted ml-1">{suffix}</span>}
        </p>
      </div>
      {Icon && (
        <span className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center shrink-0 ${tones[tone]}`}>
          <Icon size={16} strokeWidth={2} />
        </span>
      )}
    </Comp>
  );
}
