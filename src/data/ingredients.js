// Ingredients for each menu item, scaled for 8 people
// I've refined quantities and added some notes for better results

export const ingredients = {
  'the-liquid-hug-station': [
    { name: 'Hot chocolate mix', quantity: '1 canister (about 2 lbs)', category: 'pantry' },
    { name: 'Whole milk', quantity: '1/2 gallon', category: 'dairy', note: 'Whole milk makes it richer' },
    { name: 'Mini marshmallows', quantity: '1 bag (10 oz)', category: 'pantry' },
    { name: 'Whipped cream', quantity: '1 can', category: 'dairy' },
    { name: 'Semi-sweet chocolate chips', quantity: '1/2 cup', category: 'baking', note: 'For topping' },
    { name: 'Candy canes', quantity: '5-6 candy canes', category: 'pantry', note: 'Crush for topping' }
  ],

  'orchard-in-a-mug': [
    { name: 'Apple cider', quantity: '1 gallon', category: 'beverages' },
    { name: 'Cinnamon sticks', quantity: '8 sticks', category: 'spices' },
    { name: 'Bourbon (optional)', quantity: '1 bottle', category: 'alcohol', note: 'For adults - Bulleit or Buffalo Trace work well' }
  ],

  'carb-cuddles': [
    { name: 'Frozen soft pretzel bites', quantity: '2 bags (about 32 oz total)', category: 'frozen' },
    { name: 'Velveeta cheese', quantity: '16 oz block', category: 'dairy', note: 'Or 2 jars of queso' },
    { name: 'Milk', quantity: '2-3 tbsp', category: 'dairy', note: 'To thin the cheese sauce' }
  ],

  'the-cozy-bowl': [
    { name: 'Cream cheese', quantity: '2 blocks (16 oz total)', category: 'dairy', note: 'Soften at room temp 30 min before' },
    { name: 'Sour cream', quantity: '1 cup (8 oz)', category: 'dairy' },
    { name: 'Mayonnaise', quantity: '1/4 cup', category: 'condiments' },
    { name: 'Parmesan cheese', quantity: '1/2 cup grated', category: 'dairy' },
    { name: 'Frozen spinach', quantity: '10 oz box', category: 'frozen', note: 'Thaw and squeeze dry!' },
    { name: 'Canned artichoke hearts', quantity: '14 oz can', category: 'canned', note: 'Drain and chop' },
    { name: 'Garlic', quantity: '4 cloves', category: 'produce', note: 'More garlic = more love' },
    { name: 'Hot sauce', quantity: 'A few dashes', category: 'condiments', note: 'Optional but recommended' },
    { name: 'Tortilla chips', quantity: '1 large bag', category: 'snacks', note: 'Or sliced baguette' }
  ],

  'fireside-crunch': [
    { name: 'Mixed nuts', quantity: '16 oz can', category: 'snacks', note: 'Unsalted works best' },
    { name: 'Butter', quantity: '2 tbsp', category: 'dairy' },
    { name: 'Brown sugar', quantity: '2 tbsp', category: 'baking' },
    { name: 'Ground cinnamon', quantity: '1 tsp', category: 'spices' },
    { name: 'Cayenne pepper', quantity: '1/8 tsp', category: 'spices', note: 'Just a hint - less is more' },
    { name: 'Fresh rosemary', quantity: '1 sprig', category: 'produce', note: 'Adds complexity' },
    { name: 'Flaky sea salt', quantity: '1/2 tsp', category: 'spices' }
  ],

  'the-grazing-blanket': [
    { name: 'Red grapes', quantity: '1 bunch', category: 'produce' },
    { name: 'Apples', quantity: '2-3 apples', category: 'produce', note: 'Honeycrisp or Fuji' },
    { name: 'Fresh berries', quantity: '2 containers', category: 'produce', note: 'Raspberries and blackberries' },
    { name: 'Aged cheddar', quantity: '4 oz', category: 'dairy' },
    { name: 'Brie or camembert', quantity: '4 oz', category: 'dairy' },
    { name: 'Gouda or gruyere', quantity: '4 oz', category: 'dairy' },
    { name: 'Assorted crackers', quantity: '2 boxes', category: 'snacks' },
    { name: 'Salami or pepperoni', quantity: '6 oz', category: 'deli', note: 'Optional' },
    { name: 'Lemon', quantity: '1 lemon', category: 'produce', note: 'For apple slices' }
  ],

  'the-melty-moment': [
    { name: 'Brie wheel', quantity: '8 oz wheel', category: 'dairy' },
    { name: 'Honey', quantity: '3-4 tbsp', category: 'pantry', note: 'Good quality honey shines here' },
    { name: 'Walnuts', quantity: '1/4 cup', category: 'baking', note: 'Roughly chopped' },
    { name: 'Fresh baguette', quantity: '1 baguette', category: 'bakery', note: 'Slice into rounds' },
    { name: 'Fresh thyme', quantity: '2-3 sprigs', category: 'produce', note: 'Optional garnish' }
  ],

  'the-spicy-snuggle': [
    { name: 'Cream cheese', quantity: '2 blocks (16 oz total)', category: 'dairy', note: 'Must be softened!' },
    { name: 'Sour cream', quantity: '1 cup (8 oz)', category: 'dairy' },
    { name: 'Shredded cheddar', quantity: '2 cups', category: 'dairy' },
    { name: 'Pickled jalapeños', quantity: '4 oz can', category: 'canned', note: 'Diced, or use fresh for more heat' },
    { name: 'Garlic powder', quantity: '1 tsp', category: 'spices' },
    { name: 'Tortilla chips', quantity: '1 large bag', category: 'snacks' }
  ],

  'the-loaded-lounge': [
    { name: 'Large russet potatoes', quantity: '8 potatoes', category: 'produce', note: 'Similar size for even cooking' },
    { name: 'Butter', quantity: '1 stick (8 tbsp)', category: 'dairy' },
    { name: 'Sour cream', quantity: '16 oz container', category: 'dairy' },
    { name: 'Shredded cheddar', quantity: '2 cups', category: 'dairy' },
    { name: 'Bacon', quantity: '1 lb', category: 'meat', note: 'Or 1 cup pre-made bacon bits' },
    { name: 'Chives or green onions', quantity: '1 bunch', category: 'produce' },
    { name: 'Broccoli florets', quantity: '2 cups', category: 'produce', note: 'Optional, steam until just tender' },
    { name: 'Salt and pepper', quantity: 'To taste', category: 'spices' }
  ],

  'pigs-in-a-blanket': [
    { name: 'Little smokies', quantity: '2 packs (28 oz total)', category: 'meat' },
    { name: 'Crescent roll dough', quantity: '2 cans', category: 'refrigerated' },
    { name: 'Egg', quantity: '1 egg', category: 'dairy', note: 'For egg wash' },
    { name: 'Everything bagel seasoning', quantity: '3-4 tbsp', category: 'spices' },
    { name: 'Dijon mustard', quantity: '1 jar', category: 'condiments', note: 'For dipping' }
  ],

  'the-meatball-mountain': [
    // Beef meatballs
    { name: 'Ground beef (80/20)', quantity: '1.5 lbs', category: 'meat', note: 'For beef meatballs' },
    // Chicken meatballs
    { name: 'Ground chicken', quantity: '1.5 lbs', category: 'meat', note: 'For chicken meatballs' },
    // Turkey meatballs
    { name: 'Ground turkey', quantity: '1.5 lbs', category: 'meat', note: 'For turkey meatballs' },
    // Shared meatball ingredients
    { name: 'Italian breadcrumbs', quantity: '1.5 cups', category: 'pantry', note: 'For all meatballs' },
    { name: 'Grated Parmesan', quantity: '3/4 cup', category: 'dairy', note: 'For all meatballs' },
    { name: 'Eggs', quantity: '3 eggs', category: 'dairy', note: 'One per meat type' },
    { name: 'Garlic', quantity: '6 cloves', category: 'produce', note: 'Minced, for all meatballs' },
    { name: 'Italian seasoning', quantity: '1 tbsp', category: 'spices' },
    { name: 'Fresh parsley', quantity: '1 bunch', category: 'produce', note: 'About 6 tbsp chopped' },
    { name: 'Milk', quantity: '1/4 cup', category: 'dairy', note: 'Keeps meatballs moist' },
    // For serving
    { name: 'Marinara sauce', quantity: '3 jars (24 oz each)', category: 'canned' },
    { name: 'Slider buns or hoagie rolls', quantity: '16-20 rolls', category: 'bakery' },
    { name: 'Shredded mozzarella', quantity: '2 cups', category: 'dairy' },
    { name: 'Extra Parmesan', quantity: 'For topping', category: 'dairy' }
  ],

  'the-garlic-cloud': [
    { name: 'French baguettes', quantity: '2 baguettes', category: 'bakery' },
    { name: 'Butter', quantity: '1 stick (8 tbsp)', category: 'dairy', note: 'Softened' },
    { name: 'Garlic', quantity: '4-5 cloves', category: 'produce', note: 'Minced fine' },
    { name: 'Fresh parsley', quantity: '3 tbsp chopped', category: 'produce' },
    { name: 'Garlic powder', quantity: '1/2 tsp', category: 'spices', note: 'Boosts garlic flavor' },
    { name: 'Salt', quantity: 'Pinch', category: 'spices' }
  ],

  'campfire-dreams': [
    { name: 'Semi-sweet chocolate chips', quantity: '2 cups', category: 'baking' },
    { name: 'Butter', quantity: '2 tbsp', category: 'dairy', note: 'Makes it smoother' },
    { name: 'Mini marshmallows', quantity: '2 cups', category: 'pantry' },
    { name: 'Graham crackers', quantity: '1 box', category: 'snacks' }
  ],

  'the-sweet-crunch': [
    { name: 'Flour tortillas (large)', quantity: '10 pack', category: 'bread' },
    { name: 'Butter', quantity: '4 tbsp', category: 'dairy', note: 'Melted' },
    { name: 'Granulated sugar', quantity: '1/4 cup', category: 'baking' },
    { name: 'Ground cinnamon', quantity: '1 tbsp', category: 'spices' },
    { name: 'Nutella', quantity: '1 jar (13 oz)', category: 'pantry' }
  ],

  'the-bottomless-bowl': [
    { name: 'Popcorn kernels', quantity: '1 jar', category: 'pantry', note: 'Or several bags of microwave popcorn' },
    { name: 'Butter', quantity: 'As needed', category: 'dairy' },
    { name: 'Salt', quantity: 'To taste', category: 'spices' }
  ],

  'natures-candy': [
    { name: 'Red or green grapes', quantity: '2 large bunches', category: 'produce', note: 'Seedless' }
  ]
};

export const getIngredientsForItem = (itemId) => {
  return ingredients[itemId] || [];
};

export const getIngredientsForItems = (itemIds) => {
  const allIngredients = [];
  itemIds.forEach(itemId => {
    const itemIngredients = ingredients[itemId] || [];
    itemIngredients.forEach(ing => {
      allIngredients.push({
        ...ing,
        forItem: itemId
      });
    });
  });
  return allIngredients;
};

// Consolidate similar ingredients for shopping
export const consolidateIngredients = (ingredientList) => {
  const consolidated = {};

  ingredientList.forEach(ing => {
    const key = ing.name.toLowerCase();
    if (consolidated[key]) {
      // If same ingredient appears multiple times, note it
      consolidated[key].sources.push(ing.forItem);
      if (ing.note && !consolidated[key].notes.includes(ing.note)) {
        consolidated[key].notes.push(ing.note);
      }
    } else {
      consolidated[key] = {
        name: ing.name,
        quantity: ing.quantity,
        category: ing.category,
        sources: [ing.forItem],
        notes: ing.note ? [ing.note] : []
      };
    }
  });

  return Object.values(consolidated);
};
