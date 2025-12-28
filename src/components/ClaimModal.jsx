import { useState, useEffect, useRef } from 'react';

function ClaimModal({ isOpen, item, onClose, onClaim }) {
  const [name, setName] = useState('');
  const inputRef = useRef(null);

  // Load last used name from localStorage
  useEffect(() => {
    if (isOpen) {
      const lastUsedName = localStorage.getItem('corcozy-last-name') || '';
      setName(lastUsedName);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      localStorage.setItem('corcozy-last-name', name.trim());
      onClaim(name.trim());
      setName('');
    }
  };

  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-bg-secondary border border-bg-card rounded-2xl p-6 w-full max-w-sm animate-fade-in glow-gold">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-text-muted hover:text-text-primary transition-colors"
        >
          ✕
        </button>

        <div className="text-center mb-6">
          <span className="text-4xl mb-2 block">{item.emoji}</span>
          <h3 className="text-xl font-bold text-accent-gold">{item.name}</h3>
          <p className="text-sm text-text-secondary mt-1">{item.description}</p>
        </div>

        <form onSubmit={handleSubmit}>
          <label className="block mb-2 text-sm text-text-secondary">
            Your name
          </label>
          <input
            ref={inputRef}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name..."
            className="w-full bg-bg-card border border-text-muted/30 rounded-lg px-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-gold transition-colors"
            autoComplete="off"
          />

          <button
            type="submit"
            disabled={!name.trim()}
            className="w-full mt-4 bg-accent-gold text-bg-primary font-semibold py-3 px-4 rounded-lg hover:bg-accent-amber transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Claim This Item
          </button>
        </form>

        <p className="text-xs text-text-muted text-center mt-4">
          You can unclaim by tapping the item again
        </p>
      </div>
    </div>
  );
}

export default ClaimModal;
