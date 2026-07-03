import React from 'react';
import { CartItem } from '../types';
import { Minus, Plus, Trash2 } from 'lucide-react';

interface CartListProps {
  items: CartItem[];
  onUpdateQuantity: (id: string, newQuantity: number) => void;
  onRemoveItem: (id: string) => void;
}

export default function CartList({ items, onUpdateQuantity, onRemoveItem }: CartListProps) {
  if (items.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 text-center">
        <p className="text-sm font-semibold text-[#1A1A1A] mb-1">Votre panier est vide</p>
        <p className="text-xs text-[#666666] max-w-[280px]">
          Déplacez-vous dans les rayons ou utilisez le scanner pour ajouter des articles.
        </p>
      </div>
    );
  }

  return (
    <div 
      id="cart-items-scroll-area"
      className="h-[250px] overflow-y-auto pr-2 space-y-2 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent"
    >
      {items.map((item) => (
        <div
          key={item.id}
          id={`cart-item-${item.id}`}
          className={`flex items-center justify-between p-3 bg-[#F9F9F9] rounded-xl border border-[#EEEEEE] transition-all hover:bg-[#FFF0E0]/30 ${
            item.promoApplied ? 'border-l-[4px] border-l-[#1A8C4E]' : ''
          }`}
        >
          {/* Left info area */}
          <div className="flex-1 min-w-0 pr-3">
            <div className="flex items-center gap-2 mb-0.5">
              <h3 className="text-sm font-semibold text-[#1A1A1A] leading-tight truncate">
                {item.name}
              </h3>
              {item.promoApplied && (
                <span className="text-[10px] font-bold text-white bg-[#1A8C4E] px-1.5 py-0.5 rounded-full">
                  PROMO
                </span>
              )}
            </div>
            <p className="text-[12px] text-[#666666] truncate">
              {item.brand} · <span className="font-medium">{item.weight}</span>
            </p>
          </div>

          {/* Price & Savings area */}
          <div className="flex flex-col items-end justify-center min-w-[100px] pr-4">
            <div className="flex items-center gap-1.5">
              {item.originalPrice && (
                <span className="text-[13px] text-[#AAAAAA] line-through font-medium">
                  {(item.originalPrice * item.quantity).toFixed(2)} €
                </span>
              )}
              <span className="text-base font-bold text-[#1A1A1A]">
                {(item.price * item.quantity).toFixed(2)} €
              </span>
            </div>
            {item.savings && (
              <span className="text-[11px] font-semibold text-[#1A8C4E]">
                Économie : −{(item.savings * item.quantity).toFixed(2)} €
              </span>
            )}
          </div>

          {/* Right quantity controls */}
          <div className="flex items-center gap-2.5">
            <div className="flex items-center bg-white rounded-lg border border-gray-200 shadow-sm p-0.5">
              {/* Minus Button */}
              <button
                id={`btn-decrease-${item.id}`}
                onClick={() => {
                  if (item.quantity > 1) {
                    onUpdateQuantity(item.id, item.quantity - 1);
                  } else {
                    onRemoveItem(item.id);
                  }
                }}
                className="w-9 h-9 flex items-center justify-center rounded-md border border-gray-100 bg-gray-50 hover:bg-[#FFF0E0] active:bg-gray-100 text-[#1A1A1A] transition-colors cursor-pointer min-h-[36px] min-w-[36px]"
                title={item.quantity > 1 ? "Retirer un exemplaire" : "Supprimer de la liste"}
                aria-label="Retirer"
              >
                <Minus className="w-4 h-4 stroke-[2.5]" />
              </button>

              {/* Quantity Value display */}
              <span className="w-8 text-center text-sm font-bold text-[#1A1A1A]">
                {item.quantity}
              </span>

              {/* Plus Button */}
              <button
                id={`btn-increase-${item.id}`}
                onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                className="w-9 h-9 flex items-center justify-center rounded-md border border-gray-100 bg-gray-50 hover:bg-[#FFF0E0] active:bg-gray-100 text-[#1A1A1A] transition-colors cursor-pointer min-h-[36px] min-w-[36px]"
                title="Ajouter un exemplaire"
                aria-label="Ajouter"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>

            {/* Trash Bin */}
            <button
              id={`btn-remove-${item.id}`}
              onClick={() => onRemoveItem(item.id)}
              className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-400 hover:text-[#FF5C00] hover:bg-[#FFF5F0] transition-colors cursor-pointer"
              title="Supprimer l'article"
            >
              <Trash2 className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
