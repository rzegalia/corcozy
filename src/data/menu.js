export const menuSections = [
  {
    id: 'warm-up-1',
    title: 'The Warm-Up',
    timeSlot: '1-4pm',
    description: 'Ease into the evening with comforting sips and nibbles',
    items: [
      {
        id: 'the-liquid-hug-station',
        name: 'The Liquid Hug Station',
        description: 'Hot cocoa bar with marshmallows, whipped cream, peppermint',
        emoji: '☕'
      },
      {
        id: 'orchard-in-a-mug',
        name: 'Orchard in a Mug',
        description: 'Warm apple cider with cinnamon sticks',
        emoji: '🍎'
      },
      {
        id: 'carb-cuddles',
        name: 'Carb Cuddles',
        description: 'Soft pretzel bites with warm cheese sauce',
        emoji: '🥨'
      },
      {
        id: 'the-cozy-bowl',
        name: 'The Cozy Bowl',
        description: 'Warm spinach artichoke dip',
        emoji: '🥣'
      },
      {
        id: 'fireside-crunch',
        name: 'Fireside Crunch',
        description: 'Spiced roasted nuts',
        emoji: '🥜'
      },
      {
        id: 'the-grazing-blanket',
        name: 'The Grazing Blanket',
        description: 'Fruit & cheese board',
        emoji: '🧀'
      }
    ]
  },
  {
    id: 'warm-up-2',
    title: 'The Warm-Up Part II',
    timeSlot: '4-6pm',
    description: 'The appetite builds as the sun sets',
    items: [
      {
        id: 'the-melty-moment',
        name: 'The Melty Moment',
        description: 'Baked brie with honey & walnuts',
        emoji: '🍯'
      },
      {
        id: 'the-spicy-snuggle',
        name: 'The Spicy Snuggle',
        description: 'Jalapeño popper dip',
        emoji: '🌶️'
      },
      {
        id: 'the-loaded-lounge',
        name: 'The Loaded Lounge',
        description: 'Baked potato bar with all the toppings',
        emoji: '🥔'
      },
      {
        id: 'pigs-in-a-blanket',
        name: 'Pigs in a Blanket',
        description: 'With everything bagel seasoning',
        emoji: '🐷'
      }
    ]
  },
  {
    id: 'main-snuggle',
    title: 'The Main Snuggle',
    timeSlot: '6-8pm',
    description: 'The heart of the feast',
    items: [
      {
        id: 'the-meatball-mountain',
        name: 'The Meatball Mountain',
        description: 'Three kinds of homemade meatballs (beef, chicken, turkey) in marinara, build your own subs',
        emoji: '🍝'
      },
      {
        id: 'the-garlic-cloud',
        name: 'The Garlic Cloud',
        description: 'Warm garlic bread',
        emoji: '🥖'
      }
    ]
  },
  {
    id: 'sweet-wind-down',
    title: 'The Sweet Wind-Down',
    timeSlot: '8pm-midnight',
    description: 'Sweet treats to carry us into the new year',
    items: [
      {
        id: 'campfire-dreams',
        name: 'Campfire Dreams',
        description: "S'mores dip with graham crackers",
        emoji: '🏕️'
      },
      {
        id: 'the-sweet-crunch',
        name: 'The Sweet Crunch',
        description: 'Cinnamon sugar chips with Nutella',
        emoji: '🍫'
      },
      {
        id: 'the-bottomless-bowl',
        name: 'The Bottomless Bowl',
        description: 'Popcorn',
        emoji: '🍿'
      },
      {
        id: 'natures-candy',
        name: "Nature's Candy",
        description: 'Frozen grapes',
        emoji: '🍇'
      }
    ]
  }
];

export const getAllItems = () => {
  return menuSections.flatMap(section => section.items);
};

export const getItemById = (id) => {
  return getAllItems().find(item => item.id === id);
};
