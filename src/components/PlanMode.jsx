import { useState } from 'react';
import { menuSections, getItemById } from '../data/menu';
import { equipment } from '../data/equipment';
import MenuItem from './MenuItem';
import ClaimModal from './ClaimModal';

function PlanMode({ firebase }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [equipmentModalOpen, setEquipmentModalOpen] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [equipmentNote, setEquipmentNote] = useState('');

  // Name entry modal state (for equipment claims when no current user)
  const [showNameModal, setShowNameModal] = useState(false);
  const [nameInput, setNameInput] = useState('');

  const handleClaimClick = (item) => {
    const claim = firebase.claims[item.id];
    if (claim) {
      // Item is already claimed - allow unclaim
      if (window.confirm(`Remove ${claim.claimedBy}'s claim on ${item.name}?`)) {
        firebase.unclaimItem(item.id);
      }
    } else {
      // Open modal to claim
      setSelectedItem(item);
      setModalOpen(true);
    }
  };

  const handleClaim = async (name) => {
    if (selectedItem && name.trim()) {
      await firebase.claimItem(selectedItem.id, name.trim());
      setModalOpen(false);
      setSelectedItem(null);
    }
  };

  const handleEquipmentClick = (equip) => {
    const claim = firebase.equipmentClaims[equip.id];
    if (claim) {
      // Already claimed - allow unclaim
      if (window.confirm(`Remove ${claim.claimedBy}'s claim on ${equip.name}?`)) {
        firebase.unclaimEquipment(equip.id);
      }
    } else {
      // Open modal to claim
      setSelectedEquipment(equip);
      setEquipmentNote('');
      setEquipmentModalOpen(true);
    }
  };

  const handleEquipmentClaim = async () => {
    if (selectedEquipment) {
      // Use current user or show name modal
      if (!firebase.currentUser) {
        setEquipmentModalOpen(false);
        setNameInput('');
        setShowNameModal(true);
        return;
      }
      await firebase.claimEquipment(selectedEquipment.id, firebase.currentUser, equipmentNote);
      setEquipmentModalOpen(false);
      setSelectedEquipment(null);
      setEquipmentNote('');
    }
  };

  const handleNameSubmit = async () => {
    if (nameInput.trim() && selectedEquipment) {
      firebase.setCurrentUser(nameInput.trim());
      await firebase.claimEquipment(selectedEquipment.id, nameInput.trim(), equipmentNote);
      setShowNameModal(false);
      setSelectedEquipment(null);
      setEquipmentNote('');
      setNameInput('');
    }
  };

  // Get dish names for equipment display
  const getDishNames = (itemIds) => {
    return itemIds
      .map(id => getItemById(id))
      .filter(Boolean)
      .map(item => item.name)
      .join(', ');
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-xl text-text-secondary mb-2">Claim Your Contribution</h2>
        <p className="text-text-muted text-sm">
          Tap an item to claim it. Your name will be shown so everyone knows who's bringing what.
        </p>
      </div>

      {menuSections.map((section) => (
        <section key={section.id} className="space-y-4">
          <div className="border-b border-bg-card pb-2">
            <h3 className="text-xl font-bold text-accent-gold">{section.title}</h3>
            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <span>{section.timeSlot}</span>
              <span className="text-text-muted">•</span>
              <span className="italic">{section.description}</span>
            </div>
          </div>

          <div className="grid gap-3">
            {section.items.map((item) => (
              <MenuItem
                key={item.id}
                item={item}
                claim={firebase.claims[item.id]}
                onClaimClick={() => handleClaimClick(item)}
              />
            ))}
          </div>
        </section>
      ))}

      {/* Equipment Section */}
      <section className="space-y-4 pt-4 border-t border-bg-card">
        <div className="border-b border-bg-card pb-2">
          <h3 className="text-xl font-bold text-accent-gold">Equipment Needed</h3>
          <p className="text-sm text-text-secondary">
            Unusual items we'll need - claim if you can bring one!
          </p>
        </div>

        <div className="grid gap-3">
          {equipment.map((equip) => {
            const claim = firebase.equipmentClaims[equip.id];
            return (
              <div
                key={equip.id}
                onClick={() => handleEquipmentClick(equip)}
                className={`p-4 rounded-xl cursor-pointer transition-all ${
                  claim
                    ? 'bg-claimed/30 border border-claimed/50'
                    : 'bg-bg-card hover:bg-bg-card-hover border border-transparent'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🍳</span>
                      <span className="font-medium text-text-primary">{equip.name}</span>
                    </div>
                    <p className="text-sm text-text-secondary mt-1">{equip.note}</p>
                    <p className="text-xs text-text-muted mt-1">
                      For: {getDishNames(equip.neededFor)}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    {claim ? (
                      <div className="text-right">
                        <span className="inline-block bg-claimed text-claimed-text text-sm font-medium px-3 py-1 rounded-full">
                          {claim.claimedBy}
                        </span>
                        {claim.note && (
                          <p className="text-xs text-claimed-text mt-1">{claim.note}</p>
                        )}
                      </div>
                    ) : (
                      <span className="inline-block bg-accent-amber/20 text-accent-amber text-sm px-3 py-1 rounded-full">
                        Needed
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Dish Claim Modal */}
      <ClaimModal
        isOpen={modalOpen}
        item={selectedItem}
        onClose={() => {
          setModalOpen(false);
          setSelectedItem(null);
        }}
        onClaim={handleClaim}
      />

      {/* Equipment Claim Modal */}
      {equipmentModalOpen && selectedEquipment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-bg-card rounded-xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              I'll bring this!
            </h3>
            <p className="text-text-secondary mb-4">{selectedEquipment.name}</p>

            <input
              type="text"
              value={equipmentNote}
              onChange={(e) => setEquipmentNote(e.target.value)}
              placeholder="Optional note (e.g., 'my 6-qt Instant Pot')"
              className="w-full bg-bg-secondary border border-text-muted/30 rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-accent-gold mb-4"
              onKeyDown={(e) => e.key === 'Enter' && handleEquipmentClaim()}
            />

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setEquipmentModalOpen(false);
                  setSelectedEquipment(null);
                }}
                className="flex-1 py-3 px-4 rounded-lg bg-bg-secondary text-text-secondary hover:bg-bg-card-hover transition-colors min-h-[44px]"
              >
                Cancel
              </button>
              <button
                onClick={handleEquipmentClaim}
                className="flex-1 py-3 px-4 rounded-lg bg-accent-gold text-bg-primary font-semibold hover:bg-accent-amber transition-colors min-h-[44px]"
              >
                {firebase.currentUser ? `Claim as ${firebase.currentUser}` : 'Claim'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Name Entry Modal */}
      {showNameModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-bg-card rounded-xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold text-text-primary mb-2">Who are you?</h3>
            <p className="text-sm text-text-secondary mb-4">Enter your name to claim this equipment</p>
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
                  setSelectedEquipment(null);
                  setEquipmentNote('');
                }}
                className="flex-1 py-3 px-4 rounded-lg bg-bg-secondary text-text-secondary hover:bg-bg-card-hover transition-colors min-h-[44px]"
              >
                Cancel
              </button>
              <button
                onClick={handleNameSubmit}
                disabled={!nameInput.trim()}
                className="flex-1 py-3 px-4 rounded-lg bg-accent-gold text-bg-primary font-semibold hover:bg-accent-amber transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
              >
                Claim
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PlanMode;
