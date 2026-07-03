import React from 'react';
import { STORE_PROMOTIONS, PromotionOffer } from '../data';
import { Sparkles, Plus } from 'lucide-react';

interface PromotionsListProps {
  onAddPromoToCart: (promo: PromotionOffer) => void;
}

export default function PromotionsList({ onAddPromoToCart }: PromotionsListProps) {
  return (
    <div id="promotions-list-panel" className="h-[295px] flex flex-col justify-between pr-2">
      <div className="space-y-1.5 shrink-0">
        <div className="flex items-center gap-2 mb-1.5">
          <Sparkles className="w-4 h-4 text-[#1A8C4E]" />
          <span className="text-[12px] font-bold text-[#1A8C4E] uppercase tracking-wider">
            Offres exclusives du jour
          </span>
        </div>
      </div>

      <div 
        id="promotions-scroll-area" 
        className="flex-1 overflow-y-auto space-y-2.5 h-[215px] pr-1 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent"
      >
        {STORE_PROMOTIONS.map((offer) => (
          <div
            key={offer.id}
            id={`promo-offer-${offer.id}`}
            className="p-3 bg-white border border-gray-200 rounded-xl flex justify-between items-center transition-all hover:border-gray-300 hover:bg-[#FFF0E0]/10 border-l-[4px] border-l-[#1A8C4E]"
          >
            {/* Left offer summary */}
            <div className="flex-1 min-w-0 pr-4">
              <span className="text-[10px] font-bold text-[#1A8C4E] bg-[#F0FAF5] px-2 py-0.5 rounded-full inline-block mb-1">
                Remise immédiate {offer.discountBadge}
              </span>
              <h3 className="text-[13.5px] font-semibold text-[#1A1A1A] truncate leading-tight">
                {offer.productName}
              </h3>
              <p className="text-[11.5px] text-[#666666] truncate mt-0.5">
                {offer.brand} · <span className="font-medium text-gray-500">{offer.aisleName}</span>
              </p>
              <p className="text-[11px] text-gray-400 truncate mt-0.5 italic">
                {offer.description}
              </p>
            </div>

            {/* Right side pricing & action */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="text-right">
                <span className="text-[15px] font-bold text-[#1A1A1A] block">
                  {offer.pricePromo}
                </span>
                <span className="text-[11.5px] text-[#AAAAAA] line-through block leading-none">
                  {offer.priceNormal}
                </span>
              </div>
              <button
                id={`btn-add-promo-${offer.id}`}
                onClick={() => onAddPromoToCart(offer)}
                className="w-10 h-10 rounded-lg flex items-center justify-center bg-[#1A8C4E] text-white hover:bg-[#15703E] transition-colors cursor-pointer shadow-sm shrink-0"
                title="Ajouter au panier"
              >
                <Plus className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
