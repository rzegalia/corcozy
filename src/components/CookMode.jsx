import { useState, useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { menuSections, getAllItems, getItemById } from '../data/menu';
import { getRecipeForItem } from '../data/recipes';
import { getIngredientsForItem } from '../data/ingredients';
import Tooltip from './Tooltip';

function CookMode() {
  const { itemId: urlItemId } = useParams();
  const [completedSteps, setCompletedSteps] = useState({});

  // Reset completed steps when item changes
  useEffect(() => {
    setCompletedSteps({});
  }, [urlItemId]);

  const selectedItemId = urlItemId || '';
  const allItems = useMemo(() => getAllItems(), []);
  const selectedItem = selectedItemId ? getItemById(selectedItemId) : null;
  const recipe = selectedItemId ? getRecipeForItem(selectedItemId) : null;
  const ingredients = selectedItemId ? getIngredientsForItem(selectedItemId) : [];

  const toggleStep = (index) => {
    setCompletedSteps(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const resetSteps = () => {
    setCompletedSteps({});
  };

  // Calculate progress
  const stepsCount = recipe?.steps?.filter(s => s.trim()).length || 0;
  const completedCount = Object.values(completedSteps).filter(Boolean).length;

  if (!selectedItemId) {
    return (
      <div className="animate-fade-in">
        <div className="text-center mb-8">
          <h2 className="text-xl text-text-secondary mb-2">Cook Mode</h2>
          <p className="text-text-muted text-sm">
            Select a recipe to view step-by-step instructions
          </p>
        </div>

        <div className="space-y-6">
          {menuSections.map(section => (
            <div key={section.id}>
              <h3 className="text-lg font-semibold text-accent-gold mb-3">
                {section.title}
              </h3>
              <div className="grid gap-2">
                {section.items.map(item => (
                  <Link
                    key={item.id}
                    to={`/cook/${item.id}`}
                    className="flex items-center gap-3 p-3 bg-bg-card hover:bg-bg-card-hover rounded-lg transition-all"
                  >
                    <span className="text-xl">{item.emoji}</span>
                    <div className="flex-1">
                      <div className="font-medium text-text-primary">{item.name}</div>
                      <div className="text-sm text-text-secondary">{item.description}</div>
                    </div>
                    <span className="text-text-muted">→</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="text-center py-12 animate-fade-in">
        <span className="text-4xl mb-4 block">🤔</span>
        <h2 className="text-xl font-bold text-text-primary mb-2">Recipe Not Found</h2>
        <p className="text-text-secondary mb-4">
          We couldn't find instructions for this item.
        </p>
        <Link
          to="/cook"
          className="inline-block bg-accent-gold text-bg-primary font-semibold py-2 px-6 rounded-lg hover:bg-accent-amber transition-colors"
        >
          Browse Recipes
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Back Button */}
      <Link
        to="/cook"
        className="inline-flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors mb-6"
      >
        ← All Recipes
      </Link>

      {/* Recipe Header */}
      <div className="text-center mb-8">
        <span className="text-5xl mb-3 block">{selectedItem?.emoji}</span>
        <h2 className="text-2xl font-bold text-accent-gold mb-2">{selectedItem?.name}</h2>
        <p className="text-text-secondary">{selectedItem?.description}</p>

        {/* Time Info */}
        <div className="flex justify-center gap-4 mt-4 text-sm">
          <div className="bg-bg-card px-4 py-2 rounded-lg">
            <span className="text-text-muted">Prep:</span>{' '}
            <span className="text-text-primary">{recipe.prepTime}</span>
          </div>
          <div className="bg-bg-card px-4 py-2 rounded-lg">
            <span className="text-text-muted">Cook:</span>{' '}
            <span className="text-text-primary">{recipe.cookTime}</span>
          </div>
          {recipe.freezeTime && (
            <div className="bg-bg-card px-4 py-2 rounded-lg">
              <span className="text-text-muted">Freeze:</span>{' '}
              <span className="text-text-primary">{recipe.freezeTime}</span>
            </div>
          )}
        </div>

        {/* Make Ahead Note */}
        {recipe.canMakeAhead && (
          <div className="mt-4 bg-claimed/20 text-claimed-text px-4 py-2 rounded-lg inline-block text-sm">
            ✓ {recipe.makeAheadNote}
          </div>
        )}
      </div>

      {/* Ingredients */}
      <div className="bg-bg-card rounded-xl p-5 mb-6">
        <h3 className="text-lg font-semibold text-accent-gold mb-3">Ingredients</h3>
        <ul className="space-y-2">
          {ingredients.map((ing, idx) => (
            <li key={idx} className="flex items-start gap-2 text-text-primary">
              <span className="text-accent-amber mt-1">•</span>
              <div>
                <span className="font-medium">{ing.quantity}</span>
                <span className="text-text-secondary"> — {ing.name}</span>
                {ing.note && (
                  <span className="text-xs text-accent-amber ml-2 italic">({ing.note})</span>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-text-secondary">Progress</span>
          <button
            onClick={resetSteps}
            className="text-xs text-text-muted hover:text-text-primary transition-colors"
          >
            Reset
          </button>
        </div>
        <div className="h-2 bg-bg-card rounded-full overflow-hidden">
          <div
            className="h-full bg-accent-gold transition-all duration-300"
            style={{ width: `${(completedCount / stepsCount) * 100}%` }}
          />
        </div>
        <div className="text-right text-xs text-text-muted mt-1">
          {completedCount} / {stepsCount} steps
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-4 mb-8">
        <h3 className="text-lg font-semibold text-accent-gold">Instructions</h3>
        {recipe.steps.map((step, idx) => {
          if (!step.trim()) return null;

          const isHeader = step.startsWith('**');
          const isSubStep = step.startsWith('  -');
          const isCompleted = completedSteps[idx];

          if (isHeader) {
            return (
              <div key={idx} className="text-text-primary font-semibold mt-6 mb-2">
                {step.replace(/\*\*/g, '')}
              </div>
            );
          }

          return (
            <div
              key={idx}
              className={`flex gap-4 p-4 rounded-xl cursor-pointer transition-all ${
                isSubStep ? 'ml-6' : ''
              } ${
                isCompleted
                  ? 'bg-claimed/20 opacity-70'
                  : 'bg-bg-card hover:bg-bg-card-hover'
              }`}
              onClick={() => toggleStep(idx)}
            >
              <div
                className={`w-8 h-8 flex-shrink-0 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                  isCompleted
                    ? 'bg-claimed-text text-bg-primary'
                    : 'bg-accent-gold/20 text-accent-gold'
                }`}
              >
                {isCompleted ? '✓' : isSubStep ? '•' : idx + 1}
              </div>
              <div className={`flex-1 text-lg ${isCompleted ? 'line-through text-text-muted' : 'text-text-primary'}`}>
                <Tooltip text={isSubStep ? step.replace('  - ', '') : step} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Tips */}
      {recipe.tips && recipe.tips.length > 0 && (
        <div className="bg-accent-amber/10 border border-accent-amber/30 rounded-xl p-5">
          <h3 className="text-lg font-semibold text-accent-amber mb-3">💡 Tips</h3>
          <ul className="space-y-2">
            {recipe.tips.map((tip, idx) => (
              <li key={idx} className="flex items-start gap-2 text-text-primary">
                <span className="text-accent-amber">•</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Done Banner */}
      {completedCount === stepsCount && stepsCount > 0 && (
        <div className="mt-8 text-center bg-claimed/30 border border-claimed text-claimed-text py-6 px-4 rounded-xl animate-fade-in">
          <span className="text-4xl block mb-2">🎉</span>
          <p className="text-xl font-bold">Done!</p>
          <p className="text-sm mt-1">Time to enjoy your creation</p>
        </div>
      )}
    </div>
  );
}

export default CookMode;
