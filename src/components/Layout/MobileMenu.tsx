import React from 'react';
import { Menu, X } from 'lucide-react';
import NameInput from '../NameInput';
import RankingList from '../RankingList';
import { BotName } from '../../types';

interface MobileMenuProps {
  isOpen: boolean;
  onToggle: () => void;
  names: BotName[];
  onNameSubmit: (name: string) => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onToggle, names, onNameSubmit }) => {
  return (
    <>
      <button
        onClick={onToggle}
        className="fixed top-4 right-4 z-30 p-2 bg-white rounded-lg shadow-md md:hidden"
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      <div 
        className={`fixed inset-0 bg-black/50 z-20 transition-opacity duration-300 md:hidden ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onToggle}
      />

      <div
        className={`fixed top-0 right-0 h-full w-[85vw] sm:w-[400px] bg-white shadow-xl z-20 transform transition-transform duration-300 md:hidden overflow-y-auto ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-4 pt-16">
          <NameInput onSubmit={onNameSubmit} />
          <div className="mt-4">
            <RankingList names={names} />
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileMenu;