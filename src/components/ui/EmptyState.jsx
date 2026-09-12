export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-14 px-6">
      {Icon && (
        <span className="w-11 h-11 rounded-full bg-neutral-50 text-text-muted flex items-center justify-center mb-3">
          <Icon size={19} />
        </span>
      )}
      <p className="text-[14px] font-semibold text-text-primary">{title}</p>
      {description && <p className="text-[13px] text-text-secondary mt-1 max-w-sm">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
