import { NavLink } from 'react-router-dom';
import { menuSections } from '../data/menu';
import ProgressBar from './ProgressBar';

function Layout({ children, firebase }) {
  const totalItems = menuSections.reduce((acc, section) => acc + section.items.length, 0);
  const claimedCount = Object.keys(firebase.claims).length;

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-bg-primary/95 backdrop-blur border-b border-bg-card">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-2xl md:text-3xl font-bold text-accent-gold">
              Corcozy 2025
            </h1>
            <div className="text-sm text-text-secondary">
              {!firebase.isFirebaseConfigured && (
                <span className="text-accent-amber">Demo Mode</span>
              )}
              {firebase.isFirebaseConfigured && firebase.isConnected && (
                <span className="text-claimed-text">● Live</span>
              )}
            </div>
          </div>

          {/* Progress */}
          <ProgressBar claimed={claimedCount} total={totalItems} />

          {/* Navigation */}
          <nav className="flex gap-2 mt-4">
            <NavLink
              to="/plan"
              className={({ isActive }) =>
                `flex-1 py-3 px-4 text-center rounded-lg transition-all ${
                  isActive
                    ? 'bg-accent-gold text-bg-primary font-semibold glow-gold-subtle'
                    : 'bg-bg-card text-text-primary hover:bg-bg-card-hover'
                }`
              }
            >
              <span className="hidden sm:inline">📋 </span>Plan
            </NavLink>
            <NavLink
              to="/shop"
              className={({ isActive }) =>
                `flex-1 py-3 px-4 text-center rounded-lg transition-all ${
                  isActive
                    ? 'bg-accent-gold text-bg-primary font-semibold glow-gold-subtle'
                    : 'bg-bg-card text-text-primary hover:bg-bg-card-hover'
                }`
              }
            >
              <span className="hidden sm:inline">🛒 </span>Shop
            </NavLink>
            <NavLink
              to="/cook"
              className={({ isActive }) =>
                `flex-1 py-3 px-4 text-center rounded-lg transition-all ${
                  isActive
                    ? 'bg-accent-gold text-bg-primary font-semibold glow-gold-subtle'
                    : 'bg-bg-card text-text-primary hover:bg-bg-card-hover'
                }`
              }
            >
              <span className="hidden sm:inline">👨‍🍳 </span>Cook
            </NavLink>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="max-w-4xl mx-auto px-4 py-8 text-center text-text-muted text-sm">
        <p>New Year's Eve 2025 🎆</p>
      </footer>
    </div>
  );
}

export default Layout;
