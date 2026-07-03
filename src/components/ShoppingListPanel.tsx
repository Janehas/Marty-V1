import React, { useState } from 'react';
import { ShoppingListItem } from '../types';
import { Check, Plus, Trash2 } from 'lucide-react';

interface ShoppingListPanelProps {
  list: ShoppingListItem[];
  onToggleCheck: (id: string) => void;
  onAddItem: (name: string, aisleName: string) => void;
  onRemoveItem: (id: string) => void;
}

export default function ShoppingListPanel({ 
  list, 
  onToggleCheck, 
  onAddItem, 
  onRemoveItem 
}: ShoppingListPanelProps) {
  const [newItemName, setNewItemName] = useState('');
  const [newItemAisle, setNewItemAisle] = useState('Épicerie salée');

  const getAisleNumber = (name: string): string => {
    const norm = name.toLowerCase();
    if (norm.includes('fruit') || norm.includes('légume') || norm.includes('legume')) return '1';
    if (norm.includes('boucherie') || norm.includes('viande') || norm.includes('poisson')) return '18';
    if (norm.includes('crèmerie') || norm.includes('fromage') || norm.includes('cremerie') || norm.includes('mozzarella')) return '13';
    if (norm.includes('pâte') || norm.includes('feculent') || norm.includes('féculent') || norm.includes('riz') || norm.includes('lasagne')) return '25';
    if (norm.includes('épicerie salée') || norm.includes('salee') || norm.includes('sauce tomate') || norm.includes('huile')) return '3';
    if (norm.includes('boisson') || norm.includes('eau')) return '10';
    if (norm.includes('boulangerie') || norm.includes('pain') || norm.includes('viennoiserie')) return '24';
    if (norm.includes('lait') || norm.includes('yaourt')) return '15';
    if (norm.includes('hygiène') || norm.includes('hygiene') || norm.includes('beauté')) return '26';
    if (norm.includes('entretien') || norm.includes('nettoyage')) return '22';
    return '';
  };

  const aisleOptions = [
    'Fruits & Légumes',
    'Boucherie',
    'Crèmerie',
    'Pâtes / Féculents',
    'Épicerie salée',
    'Boulangerie',
    'Boissons',
    'Hygiène',
    'Entretien'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;
    onAddItem(newItemName.trim(), newItemAisle);
    setNewItemName('');
  };

  return (
    <div id="shopping-list-panel" className="h-[295px] flex flex-col justify-between pr-2">
      {/* Add Item Form */}
      <form onSubmit={handleSubmit} className="flex gap-2 shrink-0 bg-gray-50 p-2 rounded-xl border border-gray-150 mb-2">
        <label htmlFor="list-item-input" className="sr-only">Nom de l'article à ajouter</label>
        <input
          id="list-item-input"
          type="text"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          placeholder="Ajouter un article à acheter (ex: Lait, Beurre...)"
          className="flex-1 bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs font-medium text-[#1A1A1A] focus:outline-none focus:border-[#FF5C00] focus-visible:ring-2 focus-visible:ring-[#FF5C00]"
        />
        
        <label htmlFor="list-item-aisle-select" className="sr-only">Rayon de l'article</label>
        <select
          id="list-item-aisle-select"
          value={newItemAisle}
          onChange={(e) => setNewItemAisle(e.target.value)}
          className="bg-white border border-gray-200 rounded-lg px-2 py-1 text-xs font-semibold text-[#666666] focus:outline-none focus:border-[#FF5C00] focus-visible:ring-2 focus-visible:ring-[#FF5C00]"
        >
          {aisleOptions.map((option) => {
            const num = getAisleNumber(option);
            return (
              <option key={option} value={option}>
                {option} {num ? `(Rayon ${num})` : ''}
              </option>
            );
          })}
        </select>
        <button
          type="submit"
          className="bg-[#FF5C00] hover:bg-[#D43200] text-white p-1.5 rounded-lg flex items-center justify-center transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-[#FF5C00]"
          title="Ajouter à la liste"
          aria-label="Ajouter à la liste"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
        </button>
      </form>

      {/* Checklist Grid/Scroll Area */}
      <div 
        id="shopping-list-scroll"
        role="group"
        aria-label="Liste de courses interactive"
        className="flex-1 overflow-y-auto space-y-1.5 h-[175px] pr-1 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent"
      >
        {list.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-4">
            <p className="text-xs font-semibold text-[#1A1A1A]">Votre liste est vide</p>
            <p className="text-[11px] text-[#666666] mt-0.5">Saisissez un article ci-dessus pour planifier vos courses.</p>
          </div>
        ) : (
          list.map((item) => (
            <div
              key={item.id}
              onClick={() => onToggleCheck(item.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onToggleCheck(item.id);
                }
              }}
              tabIndex={0}
              role="checkbox"
              aria-checked={item.isChecked}
              aria-label={`${item.name}, Rayon ${item.aisleName}`}
              className={`flex items-center justify-between p-2.5 border rounded-xl cursor-pointer transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5C00] ${
                item.isChecked 
                  ? 'bg-[#F0FAF5]/40 border-[#1A8C4E]/20 text-[#666666]' 
                  : 'bg-white border-gray-200 text-[#1A1A1A] hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                {/* Circular checkbox icon indicator */}
                <div 
                  aria-hidden="true"
                  className={`w-5.5 h-5.5 rounded-full border flex items-center justify-center transition-colors shrink-0 ${
                    item.isChecked 
                      ? 'bg-[#1A8C4E] border-[#1A8C4E] text-white' 
                      : 'border-gray-300 bg-white'
                  }`}
                >
                  {item.isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>

                <div className="min-w-0">
                  <span className={`text-[13px] font-semibold block leading-tight ${item.isChecked ? 'line-through text-gray-400' : ''}`}>
                    {item.name}
                  </span>
                  <span className="text-[10px] text-[#666666] block leading-none mt-0.5">
                    Rayon : {item.aisleName} {getAisleNumber(item.aisleName) ? `(Rayon ${getAisleNumber(item.aisleName)})` : ''}
                  </span>
                </div>
              </div>

              {/* Trash option for items */}
              <button
                id={`btn-delete-list-item-${item.id}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveItem(item.id);
                }}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-[#FF5C00] hover:bg-[#FFF5F0] transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#FF5C00]"
                title={`Supprimer ${item.name}`}
                aria-label={`Supprimer ${item.name} de la liste`}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
