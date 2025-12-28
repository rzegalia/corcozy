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

  // Confirmation modal for removing claims
  const [confirmModal, setConfirmModal] = useState({ show: false, type: null, id: null, name: null, claimedBy: null });

  const handleClaimClick = async (item) => {
    const claim = firebase.claims[item.id];
    if (claim) {
      // Item is already claimed - show confirmation modal
      setConfirmModal({ show: true, type: 'dish', id: item.id, name: item.name, claimedBy: claim.claimedBy });
    } else if (firebase.currentUser) {
      // User is logged in - claim directly without modal
      await firebase.claimItem(item.id, firebase.currentUser);
    } else {
      // No current user - show modal to get name
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
      // Already claimed - show confirmation modal
      setConfirmModal({ show: true, type: 'equipment', id: equip.id, name: equip.name, claimedBy: claim.claimedBy });
    } else {
      // Open modal to claim
      setSelectedEquipment(equip);
      setEquipmentNote('');
      setEquipmentModalOpen(true);
    }
  };

  const handleConfirmRemove = () => {
    if (confirmModal.type === 'dish') {
      firebase.unclaimItem(confirmModal.id);
    } else if (confirmModal.type === 'equipment') {
      firebase.unclaimEquipment(confirmModal.id);
    }
    setConfirmModal({ show: false, type: null, id: null, name: null, claimedBy: null });
  };

  const handleEquipmentClaim = async () => {
    if (selectedEquipment) {
      // Use current user (always set from welcome modal)
      await firebase.claimEquipment(selectedEquipment.id, firebase.currentUser, equipmentNote);
      setEquipmentModalOpen(false);
      setSelectedEquipment(null);
      setEquipmentNote('');
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
                I'll Bring This
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for removing claims */}
      {confirmModal.show && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-bg-card rounded-xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              Remove Claim?
            </h3>
            <p className="text-text-secondary mb-4">
              Remove {confirmModal.claimedBy}'s claim on {confirmModal.name}?
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setConfirmModal({ show: false, type: null, id: null, name: null, claimedBy: null })}
                className="flex-1 py-3 px-4 rounded-lg bg-bg-secondary text-text-secondary hover:bg-bg-card-hover transition-colors min-h-[44px]"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRemove}
                className="flex-1 py-3 px-4 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors min-h-[44px]"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default PlanMode;
