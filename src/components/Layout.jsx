import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { menuSections } from '../data/menu';
import ProgressBar from './ProgressBar';

function Layout({ children, firebase }) {
  const totalItems = menuSections.reduce((acc, section) => acc + section.items.length, 0);
  const claimedCount = Object.keys(firebase.claims).length;
  const [showUserModal, setShowUserModal] = useState(false);
  const [newUserName, setNewUserName] = useState('');

  const handleChangeUser = () => {
    setNewUserName(firebase.currentUser);
    setShowUserModal(true);
  };

  const handleSaveUser = () => {
    if (newUserName.trim()) {
      firebase.setCurrentUser(newUserName.trim());
    }
    setShowUserModal(false);
  };

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* User Change Modal */}
      {showUserModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-bg-card rounded-xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Who are you?</h3>
            <input
              type="text"
              value={newUserName}
              onChange={(e) => setNewUserName(e.target.value)}
              placeholder="Enter your name"
              className="w-full bg-bg-secondary border border-text-muted/30 rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-accent-gold mb-4"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleSaveUser()}
            />
            <div className="flex gap-2">
              <button
                onClick={() => setShowUserModal(false)}
                className="flex-1 py-2 px-4 rounded-lg bg-bg-secondary text-text-secondary hover:bg-bg-card-hover transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveUser}
                className="flex-1 py-2 px-4 rounded-lg bg-accent-gold text-bg-primary font-semibold hover:bg-accent-amber transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-40 bg-bg-primary/95 backdrop-blur border-b border-bg-card">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-2xl md:text-3xl font-bold text-accent-gold">
              Corcozy 2025
            </h1>
            <button
              onClick={handleChangeUser}
              className="text-sm text-text-secondary hover:text-text-primary transition-colors flex items-center gap-1"
            >
              {firebase.currentUser ? (
                <>
                  <span className="text-claimed-text">●</span>
                  <span>{firebase.currentUser}</span>
                </>
              ) : (
                <span className="text-accent-amber">Set your name</span>
              )}
            </button>
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
