function ProgressBar({ claimed, total }) {
  const percentage = total > 0 ? (claimed / total) * 100 : 0;
  const isComplete = claimed === total;

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-text-secondary">Menu claimed</span>
        <span className={isComplete ? 'text-claimed-text font-semibold' : 'text-text-primary'}>
          {claimed} / {total}
          {isComplete && ' ✨'}
        </span>
      </div>
      <div className="h-2 bg-bg-card rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-500 ease-out rounded-full ${
            isComplete ? 'bg-claimed-text' : 'bg-accent-gold'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export default ProgressBar;
