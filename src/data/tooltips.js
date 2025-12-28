// Cooking term definitions for tooltips
export const cookingTerms = {
  'fold': {
    term: 'Fold',
    definition: 'Gently combine ingredients using a spatula in a sweeping motion to keep air in the mixture. Scrape from bottom and fold over top, rotating bowl as you go.',
    example: 'Fold the whipped cream into the batter'
  },
  'broil': {
    term: 'Broil',
    definition: 'Cook with high heat from above, usually 500-550°F. The heating element at the top of your oven glows red. Food should be positioned close to the heat source.',
    example: 'Broil the marshmallows until golden'
  },
  'simmer': {
    term: 'Simmer',
    definition: 'Cook liquid just below boiling, with small bubbles gently breaking the surface. If it\'s rolling with big bubbles, turn the heat down.',
    example: 'Simmer the meatballs in sauce for 30 minutes'
  },
  'thawed and squeezed dry': {
    term: 'Thawed and squeezed dry',
    definition: 'Defrost the frozen ingredient completely, then place in a clean kitchen towel or paper towels and squeeze firmly to remove all excess water. This prevents watery results.',
    example: 'Thaw spinach and squeeze dry before adding to dip'
  },
  'fork tender': {
    term: 'Fork tender',
    definition: 'When a fork easily pierces the food with little resistance and slides out smoothly. Test the thickest part of the food.',
    example: 'Bake potatoes until fork tender'
  },
  'room temperature': {
    term: 'Room temperature',
    definition: 'Let ingredient sit out of the refrigerator for 30-60 minutes before using. For butter, it should be soft enough to dent with your finger but not melting.',
    example: 'Let eggs come to room temperature before baking'
  },
  'softened': {
    term: 'Softened',
    definition: 'Usually refers to butter that\'s pliable but not melted, about 65°F. It should dent easily when pressed but still hold its shape. Leave out 30-60 minutes to soften.',
    example: 'Beat softened butter until fluffy'
  },
  'mince': {
    term: 'Mince',
    definition: 'Cut into very small pieces, about 1/8 inch or smaller. For garlic, you can also use a garlic press.',
    example: 'Mince the garlic finely'
  },
  'dice': {
    term: 'Dice',
    definition: 'Cut into small cubes, typically 1/4 to 1/2 inch. First slice, then cut across into strips, then across again into cubes.',
    example: 'Dice the onion'
  },
  'chop': {
    term: 'Chop',
    definition: 'Cut into irregular pieces. Doesn\'t need to be as uniform as dicing. Can be rough/coarse or fine depending on the recipe.',
    example: 'Roughly chop the walnuts'
  },
  'drain': {
    term: 'Drain',
    definition: 'Remove liquid from food, usually by pouring into a colander or strainer, or by using the lid of the can to hold back the contents while pouring off liquid.',
    example: 'Drain the artichoke hearts'
  },
  'single layer': {
    term: 'Single layer',
    definition: 'Spread food out so pieces don\'t overlap or stack on each other. This ensures even cooking and browning. You may need multiple pans.',
    example: 'Spread nuts in a single layer'
  },
  'internal temp': {
    term: 'Internal temperature',
    definition: 'The temperature measured at the thickest part of the food using a meat thermometer. This is the most reliable way to check if meat is cooked safely.',
    example: 'Cook until internal temp reaches 165°F'
  },
  'rest': {
    term: 'Rest',
    definition: 'Let cooked meat sit for a few minutes after removing from heat. This allows juices to redistribute, making the meat more tender and juicy.',
    example: 'Let the meat rest for 5 minutes before slicing'
  },
  'egg wash': {
    term: 'Egg wash',
    definition: 'A beaten egg (often with a splash of water or milk) brushed on pastry before baking. Creates a golden, shiny finish.',
    example: 'Brush with egg wash for a golden crust'
  },
  'deglaze': {
    term: 'Deglaze',
    definition: 'Add liquid to a hot pan to loosen the flavorful browned bits stuck to the bottom. Scrape with a wooden spoon while the liquid sizzles.',
    example: 'Deglaze the pan with wine'
  }
};

// Function to find cooking terms in text and provide definitions
export const findTermsInText = (text) => {
  const foundTerms = [];
  const lowerText = text.toLowerCase();

  Object.keys(cookingTerms).forEach(key => {
    if (lowerText.includes(key.toLowerCase())) {
      foundTerms.push(cookingTerms[key]);
    }
  });

  return foundTerms;
};

// Get definition for a specific term
export const getTermDefinition = (term) => {
  const key = term.toLowerCase();
  return cookingTerms[key] || null;
};
