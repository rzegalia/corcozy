import { useState } from 'react';
import { menuSections } from '../data/menu';
import MenuItem from './MenuItem';
import ClaimModal from './ClaimModal';

function PlanMode({ firebase }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

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

      <ClaimModal
        isOpen={modalOpen}
        item={selectedItem}
        onClose={() => {
          setModalOpen(false);
          setSelectedItem(null);
        }}
        onClaim={handleClaim}
      />
    </div>
  );
}

export default PlanMode;
