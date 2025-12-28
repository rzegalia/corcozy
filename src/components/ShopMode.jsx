import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getItemById } from '../data/menu';
import { getIngredientsForItems, consolidateIngredients, ingredients } from '../data/ingredients';

function ShopMode({ firebase }) {
  // Two simple views: "full" (everyone) or "mine" (just my claimed dishes)
  const [viewMode, setViewMode] = useState('full');
  const [checkedItems, setCheckedItems] = useState({});

  // Get items for current user's claimed dishes
  const myClaimedItemIds = useMemo(() => {
    if (!firebase.currentUser) return [];
    return Object.entries(firebase.claims)
      .filter(([_, claim]) => claim?.claimedBy === firebase.currentUser)
      .map(([itemId]) => itemId);
  }, [firebase.claims, firebase.currentUser]);

  // Get all item IDs (for full view)
  const allItemIds = useMemo(() => Object.keys(ingredients), []);

  // Current view's item IDs
  const relevantItemIds = viewMode === 'full' ? allItemIds : myClaimedItemIds;

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
    if (firebase.currentUser && viewMode === 'mine') {
      const pantryItems = firebase.getPantryForUser(firebase.currentUser);
      const checked = {};
      pantryItems.forEach(item => {
        checked[item.toLowerCase()] = true;
      });
      setCheckedItems(checked);
    } else {
      setCheckedItems({});
    }
  }, [firebase.currentUser, firebase.pantry, viewMode]);

  const toggleItem = (ingredientName) => {
    if (viewMode === 'full') return;

    const key = ingredientName.toLowerCase();
    const newChecked = { ...checkedItems, [key]: !checkedItems[key] };
    setCheckedItems(newChecked);

    const checkedList = Object.entries(newChecked)
      .filter(([_, isChecked]) => isChecked)
      .map(([name]) => name);
    firebase.updatePantry(firebase.currentUser, checkedList);
  };

  const handleClaimIngredient = async (ingredientName) => {
    const currentClaim = firebase.getIngredientClaim(ingredientName);

    if (currentClaim) {
      if (currentClaim.claimedBy === firebase.currentUser) {
        firebase.unclaimIngredient(ingredientName);
      } else if (window.confirm(`Remove ${currentClaim.claimedBy}'s claim on ${ingredientName}?`)) {
        firebase.unclaimIngredient(ingredientName);
      }
    } else {
      await firebase.claimIngredient(ingredientName, firebase.currentUser);
    }
  };

  const copyToClipboard = () => {
    const uncheckedItems = consolidatedIngredients
      .filter(ing => !checkedItems[ing.name.toLowerCase()])
      .filter(ing => !firebase.getIngredientClaim(ing.name))
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

  // Count items someone is bringing
  const claimedCount = consolidatedIngredients.filter(ing =>
    firebase.getIngredientClaim(ing.name)
  ).length;

  return (
    <div className="animate-fade-in">
      {/* View Toggle Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setViewMode('full')}
          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
            viewMode === 'full'
              ? 'bg-accent-gold text-bg-primary'
              : 'bg-bg-card text-text-primary hover:bg-bg-card-hover'
          }`}
        >
          🎉 Full Party List
        </button>
        <button
          onClick={() => setViewMode('mine')}
          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
            viewMode === 'mine'
              ? 'bg-accent-gold text-bg-primary'
              : 'bg-bg-card text-text-primary hover:bg-bg-card-hover'
          }`}
        >
          📝 My Shopping List
        </button>
      </div>

      {/* View Description */}
      {viewMode === 'full' ? (
        <div className="bg-accent-gold/10 border border-accent-gold/30 rounded-xl p-4 mb-6">
          <h3 className="font-semibold text-accent-gold mb-1">What does the party need?</h3>
          <p className="text-sm text-text-secondary">
            Everything for all dishes. Already have something? Tap <span className="text-accent-gold font-medium">"I have this"</span> to let everyone know!
          </p>
          {claimedCount > 0 && (
            <p className="text-sm text-claimed-text mt-2">
              ✓ {claimedCount} item{claimedCount !== 1 ? 's' : ''} already covered
            </p>
          )}
        </div>
      ) : (
        <div className="bg-bg-card rounded-xl p-4 mb-6">
          <h3 className="font-semibold text-text-primary mb-1">Your shopping list</h3>
          {myClaimedItemIds.length > 0 ? (
            <>
              <p className="text-sm text-text-secondary mb-3">
                Ingredients for dishes you're making:
              </p>
              <div className="flex flex-wrap gap-2">
                {myClaimedItemIds.map(itemId => {
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
            </>
          ) : (
            <p className="text-sm text-text-secondary">
              You haven't claimed any dishes yet.{' '}
              <Link to="/plan" className="text-accent-gold hover:underline">
                Claim some in Plan mode!
              </Link>
            </p>
          )}
        </div>
      )}

      {/* Actions */}
      {consolidatedIngredients.length > 0 && (
        <div className="flex gap-2 mb-6">
          <button
            onClick={copyToClipboard}
            className="flex-1 bg-bg-card hover:bg-bg-card-hover text-text-primary py-3 px-4 rounded-lg transition-colors min-h-[44px]"
          >
            📋 Copy List
          </button>
          <button
            onClick={() => window.print()}
            className="flex-1 bg-bg-card hover:bg-bg-card-hover text-text-primary py-3 px-4 rounded-lg transition-colors min-h-[44px]"
          >
            🖨️ Print
          </button>
        </div>
      )}

      {/* Progress (only for my list view) */}
      {viewMode === 'mine' && consolidatedIngredients.length > 0 && (
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

      {/* Empty state for My List */}
      {viewMode === 'mine' && myClaimedItemIds.length === 0 && (
        <div className="text-center py-12">
          <span className="text-4xl mb-4 block">🛒</span>
          <h2 className="text-xl font-bold text-text-primary mb-2">No dishes claimed yet</h2>
          <p className="text-text-secondary mb-4">
            Head to the Plan tab to claim some dishes, then come back for your shopping list!
          </p>
          <Link
            to="/plan"
            className="inline-block bg-accent-gold text-bg-primary font-semibold py-3 px-6 rounded-lg hover:bg-accent-amber transition-colors"
          >
            Go to Plan
          </Link>
        </div>
      )}

      {/* Shopping List by Category */}
      {consolidatedIngredients.length > 0 && (
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
                      {/* Checkbox (only for my list view and unclaimed items) */}
                      {viewMode === 'mine' && !ingredientClaim && (
                        <input
                          type="checkbox"
                          checked={isChecked || false}
                          onChange={() => toggleItem(ing.name)}
                          className="mt-1 cursor-pointer w-5 h-5"
                        />
                      )}

                      <div
                        className="flex-1 min-w-0"
                        onClick={() => viewMode === 'mine' && !ingredientClaim && toggleItem(ing.name)}
                      >
                        <div className={`font-medium ${
                          isChecked || ingredientClaim ? 'line-through text-text-muted' : 'text-text-primary'
                        }`}>
                          {ing.name}
                        </div>
                        <div className="text-sm text-text-secondary">
                          {ing.quantity}
                        </div>

                        {/* Show which dishes need this (in full view) */}
                        {viewMode === 'full' && ing.sources && (
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
                            ✓ {ingredientClaim.claimedBy} {ingredientClaim.claimedBy === firebase.currentUser ? '(you)' : ''} has this
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
                            {ingredientClaim.claimedBy === firebase.currentUser ? '✓ Got it' : `✓ ${ingredientClaim.claimedBy}`}
                          </button>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleClaimIngredient(ing.name);
                            }}
                            className="text-xs bg-accent-gold text-bg-primary font-medium px-3 py-2 rounded-full hover:bg-accent-amber transition-colors min-h-[36px] whitespace-nowrap"
                          >
                            I have this
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
      )}
    </div>
  );
}

export default ShopMode;
