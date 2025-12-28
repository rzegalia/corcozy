import { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { menuSections, getItemById } from '../data/menu';
import { getIngredientsForItems, consolidateIngredients } from '../data/ingredients';

function ShopMode({ firebase }) {
  const { userName: urlUserName } = useParams();
  const [selectedUser, setSelectedUser] = useState(urlUserName || '');
  const [checkedItems, setCheckedItems] = useState({});

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

  // Get items claimed by selected user
  const claimedItems = useMemo(() => {
    if (!selectedUser) return [];
    return Object.entries(firebase.claims)
      .filter(([_, claim]) => claim?.claimedBy === selectedUser)
      .map(([itemId]) => itemId);
  }, [firebase.claims, selectedUser]);

  // Get consolidated ingredients for claimed items
  const ingredients = useMemo(() => {
    const rawIngredients = getIngredientsForItems(claimedItems);
    return consolidateIngredients(rawIngredients);
  }, [claimedItems]);

  // Group ingredients by category
  const ingredientsByCategory = useMemo(() => {
    const grouped = {};
    ingredients.forEach(ing => {
      const category = ing.category || 'other';
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(ing);
    });
    return grouped;
  }, [ingredients]);

  // Load checked items from pantry
  useEffect(() => {
    if (selectedUser) {
      const pantryItems = firebase.getPantryForUser(selectedUser);
      const checked = {};
      pantryItems.forEach(item => {
        checked[item.toLowerCase()] = true;
      });
      setCheckedItems(checked);
    }
  }, [selectedUser, firebase.pantry]);

  const toggleItem = (ingredientName) => {
    const key = ingredientName.toLowerCase();
    const newChecked = { ...checkedItems, [key]: !checkedItems[key] };
    setCheckedItems(newChecked);

    // Save to Firebase/localStorage
    const checkedList = Object.entries(newChecked)
      .filter(([_, isChecked]) => isChecked)
      .map(([name]) => name);
    firebase.updatePantry(selectedUser, checkedList);
  };

  const copyToClipboard = () => {
    const uncheckedItems = ingredients
      .filter(ing => !checkedItems[ing.name.toLowerCase()])
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

  if (claimers.length === 0) {
    return (
      <div className="text-center py-12 animate-fade-in">
        <span className="text-4xl mb-4 block">🛒</span>
        <h2 className="text-xl font-bold text-text-primary mb-2">No Claims Yet</h2>
        <p className="text-text-secondary mb-4">
          Head to the Plan tab to claim some items first!
        </p>
        <Link
          to="/plan"
          className="inline-block bg-accent-gold text-bg-primary font-semibold py-2 px-6 rounded-lg hover:bg-accent-amber transition-colors"
        >
          Go to Plan
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* User Selection */}
      <div className="mb-6">
        <label className="block text-sm text-text-secondary mb-2">
          Who's shopping?
        </label>
        <select
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
          className="w-full bg-bg-card border border-text-muted/30 rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-accent-gold transition-colors"
        >
          <option value="">Select a person...</option>
          {claimers.map(name => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>
      </div>

      {selectedUser && claimedItems.length === 0 && (
        <div className="text-center py-8">
          <p className="text-text-secondary">
            {selectedUser} hasn't claimed any items yet.
          </p>
        </div>
      )}

      {selectedUser && claimedItems.length > 0 && (
        <>
          {/* Claimed Items Summary */}
          <div className="bg-bg-card rounded-xl p-4 mb-6">
            <h3 className="text-sm text-text-secondary mb-2">Items claimed by {selectedUser}:</h3>
            <div className="flex flex-wrap gap-2">
              {claimedItems.map(itemId => {
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

          {/* Actions */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={copyToClipboard}
              className="flex-1 bg-bg-card hover:bg-bg-card-hover text-text-primary py-2 px-4 rounded-lg transition-colors"
            >
              📋 Copy List
            </button>
            <button
              onClick={() => window.print()}
              className="flex-1 bg-bg-card hover:bg-bg-card-hover text-text-primary py-2 px-4 rounded-lg transition-colors"
            >
              🖨️ Print
            </button>
          </div>

          {/* Progress */}
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-text-secondary">Already have</span>
              <span className="text-text-primary">
                {Object.values(checkedItems).filter(Boolean).length} / {ingredients.length}
              </span>
            </div>
            <div className="h-2 bg-bg-card rounded-full overflow-hidden">
              <div
                className="h-full bg-claimed-text transition-all duration-300"
                style={{
                  width: `${(Object.values(checkedItems).filter(Boolean).length / ingredients.length) * 100}%`
                }}
              />
            </div>
          </div>

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
                    return (
                      <div
                        key={`${ing.name}-${idx}`}
                        className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                          isChecked
                            ? 'bg-claimed/20 opacity-60'
                            : 'bg-bg-card hover:bg-bg-card-hover'
                        }`}
                        onClick={() => toggleItem(ing.name)}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="mt-1"
                        />
                        <div className="flex-1 min-w-0">
                          <div className={`font-medium ${isChecked ? 'line-through text-text-muted' : 'text-text-primary'}`}>
                            {ing.name}
                          </div>
                          <div className="text-sm text-text-secondary">
                            {ing.quantity}
                          </div>
                          {ing.notes.length > 0 && (
                            <div className="text-xs text-accent-amber mt-1 italic">
                              {ing.notes.join(' • ')}
                            </div>
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
