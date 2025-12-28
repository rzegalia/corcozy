// Unusual equipment needed for the party
// Only items a fully-stocked kitchen might NOT have

export const equipment = [
  {
    id: 'crockpot-1',
    name: 'Crockpot / Slow Cooker #1',
    neededFor: ['the-liquid-hug-station'],
    note: 'For hot cocoa'
  },
  {
    id: 'crockpot-2',
    name: 'Crockpot / Slow Cooker #2',
    neededFor: ['orchard-in-a-mug'],
    note: 'For apple cider'
  },
  {
    id: 'crockpot-3',
    name: 'Crockpot / Slow Cooker #3',
    neededFor: ['carb-cuddles', 'the-meatball-mountain'],
    note: 'For cheese sauce or keeping meatballs warm'
  },
  {
    id: 'cast-iron',
    name: 'Cast Iron Skillet',
    neededFor: ['campfire-dreams'],
    note: 'Or any oven-safe dish for broiling s\'mores dip'
  },
  {
    id: 'grazing-board',
    name: 'Large Grazing Board / Platter',
    neededFor: ['the-grazing-blanket'],
    note: 'Big enough for the cheese board spread'
  },
  {
    id: 'baking-sheets-extra',
    name: 'Extra Baking Sheets (2-3)',
    neededFor: ['the-meatball-mountain'],
    note: 'Meatballs need 2-3 sheets at once'
  }
];

export const getEquipmentById = (id) => {
  return equipment.find(e => e.id === id) || null;
};
