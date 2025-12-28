import { Link } from 'react-router-dom';

function MenuItem({ item, claim, onClaimClick }) {
  const isClaimed = !!claim;

  return (
    <div
      className={`rounded-xl p-4 transition-all cursor-pointer ${
        isClaimed
          ? 'bg-claimed/30 border border-claimed/50'
          : 'bg-bg-card hover:bg-bg-card-hover border border-transparent hover:border-accent-gold/30'
      }`}
      onClick={onClaimClick}
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl flex-shrink-0">{item.emoji}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className={`font-semibold ${isClaimed ? 'text-claimed-text' : 'text-text-primary'}`}>
              {item.name}
            </h4>
            {isClaimed && (
              <span className="text-xs bg-claimed/50 text-claimed-text px-2 py-0.5 rounded-full">
                {claim.claimedBy}
              </span>
            )}
          </div>
          <p className="text-sm text-text-secondary mt-1">{item.description}</p>
        </div>
        <div className="flex-shrink-0 flex items-center gap-2">
          {!isClaimed && (
            <span className="text-accent-gold text-sm font-medium">Claim</span>
          )}
          <Link
            to={`/cook/${item.id}`}
            onClick={(e) => e.stopPropagation()}
            className="text-text-muted hover:text-accent-gold transition-colors p-1"
            title="View recipe"
          >
            📖
          </Link>
        </div>
      </div>
    </div>
  );
}

export default MenuItem;
