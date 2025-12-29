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
    neededFor: ['carb-cuddles'],
    note: 'For keeping cheese sauce warm'
  },
  {
    id: 'grazing-board',
    name: 'Large Grazing Board / Platter',
    neededFor: ['the-grazing-blanket'],
    note: 'Big enough for the cheese board spread'
  },
  {
    id: 'dutch-oven',
    name: 'Dutch Oven / Large Braising Pot',
    neededFor: ['the-cozy-braise'],
    note: 'Heavy-bottomed pot for braising short ribs (6-8 qt)'
  }
];

export const getEquipmentById = (id) => {
  return equipment.find(e => e.id === id) || null;
};
