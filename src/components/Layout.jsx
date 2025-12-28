import { useState, useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import { menuSections } from '../data/menu';
import ProgressBar from './ProgressBar';

function Layout({ children, firebase }) {
  const totalItems = menuSections.reduce((acc, section) => acc + section.items.length, 0);
  const claimedCount = Object.keys(firebase.claims).length;
  const [showUserModal, setShowUserModal] = useState(false);
  const [newUserName, setNewUserName] = useState('');

  // Get registered users (persisted in Firebase)
  const knownUsers = useMemo(() => {
    return (firebase.registeredUsers || []).map(u => u.name);
  }, [firebase.registeredUsers]);

  // Show welcome modal on first load if no user set
  const showWelcomeModal = !firebase.currentUser && !showUserModal;

  const handleChangeUser = () => {
    setNewUserName(firebase.currentUser || '');
    setShowUserModal(true);
  };

  const handleSaveUser = () => {
    if (newUserName.trim()) {
      firebase.setCurrentUser(newUserName.trim());
    }
    setShowUserModal(false);
  };

  const handleSelectExistingUser = (name) => {
    firebase.setCurrentUser(name);
    setShowUserModal(false);
  };

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Welcome Modal (first load) */}
      {showWelcomeModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-bg-card rounded-xl p-6 w-full max-w-sm">
            <div className="text-center mb-4">
              <span className="text-4xl">🎉</span>
              <h2 className="text-xl font-bold text-accent-gold mt-2">Welcome to Corcozy 2025!</h2>
              <p className="text-sm text-text-secondary mt-1">Who's joining the party?</p>
            </div>

            {/* Quick select existing users */}
            {knownUsers.length > 0 && (
              <div className="mb-4">
                <p className="text-xs text-text-muted mb-2">Select your name:</p>
                <div className="flex flex-wrap gap-2">
                  {knownUsers.map(name => (
                    <button
                      key={name}
                      onClick={() => handleSelectExistingUser(name)}
                      className="px-4 py-2 rounded-full bg-bg-secondary text-text-primary hover:bg-accent-gold hover:text-bg-primary transition-colors min-h-[44px]"
                    >
                      {name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Or enter new name */}
            <div>
              {knownUsers.length > 0 && (
                <p className="text-xs text-text-muted mb-2">Or enter a new name:</p>
              )}
              <input
                type="text"
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
                placeholder="Enter your name"
                className="w-full bg-bg-secondary border border-text-muted/30 rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-accent-gold mb-4"
                autoFocus={knownUsers.length === 0}
                onKeyDown={(e) => e.key === 'Enter' && newUserName.trim() && handleSaveUser()}
              />
              <button
                onClick={handleSaveUser}
                disabled={!newUserName.trim()}
                className="w-full py-3 px-4 rounded-lg bg-accent-gold text-bg-primary font-semibold hover:bg-accent-amber transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
              >
                Let's Go!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Change Modal (from header click) */}
      {showUserModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-bg-card rounded-xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Switch User</h3>

            {/* Quick select existing users */}
            {knownUsers.length > 0 && (
              <div className="mb-4">
                <p className="text-xs text-text-muted mb-2">Select:</p>
                <div className="flex flex-wrap gap-2">
                  {knownUsers.map(name => (
                    <button
                      key={name}
                      onClick={() => handleSelectExistingUser(name)}
                      className={`px-4 py-2 rounded-full transition-colors min-h-[44px] ${
                        name === firebase.currentUser
                          ? 'bg-accent-gold text-bg-primary'
                          : 'bg-bg-secondary text-text-primary hover:bg-bg-card-hover'
                      }`}
                    >
                      {name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Or enter new name */}
            {knownUsers.length > 0 && (
              <p className="text-xs text-text-muted mb-2">Or enter new:</p>
            )}
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
                className="flex-1 py-3 px-4 rounded-lg bg-bg-secondary text-text-secondary hover:bg-bg-card-hover transition-colors min-h-[44px]"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveUser}
                disabled={!newUserName.trim()}
                className="flex-1 py-3 px-4 rounded-lg bg-accent-gold text-bg-primary font-semibold hover:bg-accent-amber transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
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
