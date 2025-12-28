import { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { menuSections, getItemById, getAllItems } from '../data/menu';
import { getIngredientsForItems, consolidateIngredients, ingredients } from '../data/ingredients';

function ShopMode({ firebase }) {
  const { userName: urlUserName } = useParams();
  const [selectedUser, setSelectedUser] = useState(urlUserName || '');
  const [checkedItems, setCheckedItems] = useState({});

  // Name entry modal state
  const [showNameModal, setShowNameModal] = useState(false);
  const [pendingIngredient, setPendingIngredient] = useState(null);
  const [nameInput, setNameInput] = useState('');

  // Auto-select current user if they exist and no URL param
  useEffect(() => {
    if (!urlUserName && firebase.currentUser && !selectedUser) {
      setSelectedUser(firebase.currentUser);
    }
  }, [firebase.currentUser, urlUserName, selectedUser]);

  // Get all unique claimers
  const claimers = useMemo(() => {
    const uniqueClaimers = new Set();
    Object.values(firebase.claims).forEach(claim => {
      if (claim?.claimedBy) {
        uniqueClaimers.add(claim.claimedBy);
      }
    });
    return Array.from(uniqueClaimers).sort();
  }, [firebase.claims]);

  // Check if viewing "Everyone" mode
  const isEveryoneMode = selectedUser === '__everyone__';

  // Get items - either for selected user or all items
  const relevantItemIds = useMemo(() => {
    if (isEveryoneMode) {
      // Get all item IDs that have ingredients
      return Object.keys(ingredients);
    }
    if (!selectedUser) return [];
    return Object.entries(firebase.claims)
      .filter(([_, claim]) => claim?.claimedBy === selectedUser)
      .map(([itemId]) => itemId);
  }, [firebase.claims, selectedUser, isEveryoneMode]);

  // Get consolidated ingredients
  const consolidatedIngredients = useMemo(() => {
    const rawIngredients = getIngredientsForItems(relevantItemIds);
    return consolidateIngredients(rawIngredients);
  }, [relevantItemIds]);

  // Group ingredients by category
  const ingredientsByCategory = useMemo(() => {
    const grouped = {};
    consolidatedIngredients.forEach(ing => {
      const category = ing.category || 'other';
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(ing);
    });
    return grouped;
  }, [consolidatedIngredients]);

  // Load checked items from pantry
  useEffect(() => {
    if (selectedUser && selectedUser !== '__everyone__') {
      const pantryItems = firebase.getPantryForUser(selectedUser);
      const checked = {};
      pantryItems.forEach(item => {
        checked[item.toLowerCase()] = true;
      });
      setCheckedItems(checked);
    } else {
      setCheckedItems({});
    }
  }, [selectedUser, firebase.pantry]);

  const toggleItem = (ingredientName) => {
    if (isEveryoneMode) return; // Don't toggle in everyone mode

    const key = ingredientName.toLowerCase();
    const newChecked = { ...checkedItems, [key]: !checkedItems[key] };
    setCheckedItems(newChecked);

    // Save to Firebase/localStorage
    const checkedList = Object.entries(newChecked)
      .filter(([_, isChecked]) => isChecked)
      .map(([name]) => name);
    firebase.updatePantry(selectedUser, checkedList);
  };

  const handleClaimIngredient = async (ingredientName) => {
    console.log('handleClaimIngredient called:', ingredientName, 'currentUser:', firebase.currentUser);
    const currentClaim = firebase.getIngredientClaim(ingredientName);

    if (currentClaim) {
      // Already claimed - unclaim if it's ours or confirm
      if (currentClaim.claimedBy === firebase.currentUser) {
        firebase.unclaimIngredient(ingredientName);
      } else if (window.confirm(`Remove ${currentClaim.claimedBy}'s claim on ${ingredientName}?`)) {
        firebase.unclaimIngredient(ingredientName);
      }
    } else {
      // Claim it
      if (!firebase.currentUser) {
        // Show modal to get name first
        console.log('No current user, showing modal');
        setPendingIngredient(ingredientName);
        setNameInput('');
        setShowNameModal(true);
      } else {
        console.log('Claiming with current user:', firebase.currentUser);
        await firebase.claimIngredient(ingredientName, firebase.currentUser);
      }
    }
  };

  const handleNameSubmit = () => {
    if (nameInput.trim() && pendingIngredient) {
      firebase.setCurrentUser(nameInput.trim());
      firebase.claimIngredient(pendingIngredient, nameInput.trim());
      setShowNameModal(false);
      setPendingIngredient(null);
      setNameInput('');
    }
  };

  const copyToClipboard = () => {
    const uncheckedItems = consolidatedIngredients
      .filter(ing => !checkedItems[ing.name.toLowerCase()])
      .filter(ing => !firebase.getIngredientClaim(ing.name)) // Don't include claimed items
      .map(ing => `${ing.quantity} - ${ing.name}`)
      .join('\n');

    navigator.clipboard.writeText(uncheckedItems).then(() => {
      alert('Shopping list copied to clipboard!');
    });
  };

  const categoryLabels = {
    produce: '🥬 Produce',
    dairy: '🧈 Dairy',
    meat: '🥩 Meat & Deli',
    deli: '🥩 Meat & Deli',
    bakery: '🥖 Bakery',
    bread: '🥖 Bakery',
    frozen: '🧊 Frozen',
    canned: '🥫 Canned Goods',
    pantry: '🏠 Pantry',
    baking: '🧁 Baking',
    spices: '🧂 Spices',
    snacks: '🍿 Snacks',
    condiments: '🍯 Condiments',
    beverages: '🥤 Beverages',
    alcohol: '🍺 Alcohol',
    refrigerated: '❄️ Refrigerated',
    other: '📦 Other'
  };

  // Get dish name and claimer for an item
  const getDishInfo = (itemId) => {
    const item = getItemById(itemId);
    const claim = firebase.claims[itemId];
    if (!item) return null;
    return {
      name: item.name,
      emoji: item.emoji,
      claimedBy: claim?.claimedBy || null
    };
  };

  return (
    <div className="animate-fade-in">
      {/* Name Entry Modal */}
      {showNameModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-bg-card rounded-xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold text-text-primary mb-2">Who are you?</h3>
            <p className="text-sm text-text-secondary mb-4">Enter your name to claim this item</p>
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="Enter your name"
              className="w-full bg-bg-secondary border border-text-muted/30 rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-accent-gold mb-4"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleNameSubmit()}
            />
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowNameModal(false);
                  setPendingIngredient(null);
                }}
                className="flex-1 py-3 px-4 rounded-lg bg-bg-secondary text-text-secondary hover:bg-bg-card-hover transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleNameSubmit}
                disabled={!nameInput.trim()}
                className="flex-1 py-3 px-4 rounded-lg bg-accent-gold text-bg-primary font-semibold hover:bg-accent-amber transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Claim
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Selection */}
      <div className="mb-6">
        <label className="block text-sm text-text-secondary mb-2">
          Who's shopping?
        </label>
        <select
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
          className="w-full bg-bg-card border border-text-muted/30 rounded-lg px-4 py-3 text-text-primary text-base focus:outline-none focus:border-accent-gold transition-colors"
        >
          <option value="">Select a person...</option>
          <option value="__everyone__">Everyone (Full Party List)</option>
          {claimers.map(name => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>
      </div>

      {!selectedUser && (
        <div className="text-center py-12">
          <span className="text-4xl mb-4 block">🛒</span>
          <h2 className="text-xl font-bold text-text-primary mb-2">Select a View</h2>
          <p className="text-text-secondary mb-4">
            Choose your name to see your shopping list, or "Everyone" to see the full party list.
          </p>
          {claimers.length === 0 && (
            <Link
              to="/plan"
              className="inline-block bg-accent-gold text-bg-primary font-semibold py-3 px-6 rounded-lg hover:bg-accent-amber transition-colors mt-4"
            >
              Claim some dishes first
            </Link>
          )}
        </div>
      )}

      {selectedUser && selectedUser !== '__everyone__' && relevantItemIds.length === 0 && (
        <div className="text-center py-8">
          <p className="text-text-secondary">
            {selectedUser} hasn't claimed any items yet.
          </p>
        </div>
      )}

      {selectedUser && (isEveryoneMode || relevantItemIds.length > 0) && (
        <>
          {/* Mode Header */}
          {isEveryoneMode && (
            <div className="bg-accent-gold/10 border border-accent-gold/30 rounded-xl p-4 mb-6">
              <h3 className="text-lg font-semibold text-accent-gold mb-1">Full Party List</h3>
              <p className="text-sm text-text-secondary">
                See all ingredients needed. Tap "I'll bring this" to claim items for the group!
              </p>
            </div>
          )}

          {/* Claimed Items Summary (only for personal view) */}
          {!isEveryoneMode && (
            <div className="bg-bg-card rounded-xl p-4 mb-6">
              <h3 className="text-sm text-text-secondary mb-2">Items claimed by {selectedUser}:</h3>
              <div className="flex flex-wrap gap-2">
                {relevantItemIds.map(itemId => {
                  const item = getItemById(itemId);
                  return item ? (
                    <span
                      key={itemId}
                      className="text-sm bg-bg-secondary px-3 py-1 rounded-full text-text-primary"
                    >
                      {item.emoji} {item.name}
                    </span>
                  ) : null;
                })}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={copyToClipboard}
              className="flex-1 bg-bg-card hover:bg-bg-card-hover text-text-primary py-3 px-4 rounded-lg transition-colors"
            >
              📋 Copy List
            </button>
            <button
              onClick={() => window.print()}
              className="flex-1 bg-bg-card hover:bg-bg-card-hover text-text-primary py-3 px-4 rounded-lg transition-colors"
            >
              🖨️ Print
            </button>
          </div>

          {/* Progress (only for personal view) */}
          {!isEveryoneMode && (
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-text-secondary">Already have</span>
                <span className="text-text-primary">
                  {Object.values(checkedItems).filter(Boolean).length} / {consolidatedIngredients.length}
                </span>
              </div>
              <div className="h-2 bg-bg-card rounded-full overflow-hidden">
                <div
                  className="h-full bg-claimed-text transition-all duration-300"
                  style={{
                    width: `${(Object.values(checkedItems).filter(Boolean).length / consolidatedIngredients.length) * 100}%`
                  }}
                />
              </div>
            </div>
          )}

          {/* Shopping List by Category */}
          <div className="space-y-6">
            {Object.entries(ingredientsByCategory).map(([category, items]) => (
              <div key={category}>
                <h3 className="text-lg font-semibold text-accent-gold mb-3">
                  {categoryLabels[category] || category}
                </h3>
                <div className="space-y-2">
                  {items.map((ing, idx) => {
                    const isChecked = checkedItems[ing.name.toLowerCase()];
                    const ingredientClaim = firebase.getIngredientClaim(ing.name);

                    return (
                      <div
                        key={`${ing.name}-${idx}`}
                        className={`flex items-start gap-3 p-3 rounded-lg transition-all ${
                          ingredientClaim
                            ? 'bg-claimed/20 border border-claimed/30'
                            : isChecked
                              ? 'bg-claimed/20 opacity-60'
                              : 'bg-bg-card hover:bg-bg-card-hover'
                        }`}
                      >
                        {/* Checkbox (only for personal view and unclaimed items) */}
                        {!isEveryoneMode && !ingredientClaim && (
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleItem(ing.name)}
                            className="mt-1 cursor-pointer w-5 h-5"
                          />
                        )}

                        <div
                          className="flex-1 min-w-0"
                          onClick={() => !isEveryoneMode && !ingredientClaim && toggleItem(ing.name)}
                        >
                          <div className={`font-medium ${
                            isChecked || ingredientClaim ? 'line-through text-text-muted' : 'text-text-primary'
                          }`}>
                            {ing.name}
                          </div>
                          <div className="text-sm text-text-secondary">
                            {ing.quantity}
                          </div>

                          {/* Show which dishes need this (in Everyone mode) */}
                          {isEveryoneMode && ing.sources && (
                            <div className="text-xs text-text-muted mt-1 flex flex-wrap gap-x-2 gap-y-1">
                              {ing.sources.map(sourceId => {
                                const info = getDishInfo(sourceId);
                                if (!info) return null;
                                return (
                                  <span key={sourceId} className="inline-flex items-center gap-1">
                                    <span>{info.emoji}</span>
                                    <span>{info.name}</span>
                                    {info.claimedBy && (
                                      <span className="text-claimed-text">({info.claimedBy})</span>
                                    )}
                                  </span>
                                );
                              })}
                            </div>
                          )}

                          {ing.notes.length > 0 && (
                            <div className="text-xs text-accent-amber mt-1 italic">
                              {ing.notes.join(' • ')}
                            </div>
                          )}

                          {/* Show who's bringing this */}
                          {ingredientClaim && (
                            <div className="text-xs text-claimed-text mt-1 font-medium">
                              {ingredientClaim.claimedBy} is bringing this
                            </div>
                          )}
                        </div>

                        {/* Claim/Unclaim button */}
                        <div className="flex-shrink-0">
                          {ingredientClaim ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleClaimIngredient(ing.name);
                              }}
                              className="text-xs bg-claimed text-claimed-text px-3 py-2 rounded-full hover:bg-claimed/80 transition-colors min-h-[36px]"
                            >
                              {ingredientClaim.claimedBy === firebase.currentUser ? '✓ You' : ingredientClaim.claimedBy}
                            </button>
                          ) : (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleClaimIngredient(ing.name);
                              }}
                              className="text-xs bg-accent-gold text-bg-primary font-medium px-3 py-2 rounded-full hover:bg-accent-amber transition-colors min-h-[36px] whitespace-nowrap"
                            >
                              I'll bring this
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default ShopMode;
