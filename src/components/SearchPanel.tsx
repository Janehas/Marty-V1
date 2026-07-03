import React, { useState, useMemo } from 'react';
import { CATALOG_PRODUCTS, CatalogItem } from '../data';
import { Search, MapPin, Plus } from 'lucide-react';

interface SearchPanelProps {
  onSelectProduct: (aisleId: string, item: CatalogItem) => void;
  onAddItemToCart: (item: CatalogItem) => void;
}

export default function SearchPanel({ onSelectProduct, onAddItemToCart }: SearchPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [activeItem, setActiveItem] = useState<CatalogItem | null>(null);

  const categories = ['Tous', 'Fruits & Légumes', 'Boucherie', 'Crèmerie', 'Épicerie salée', 'Boulangerie'];

  const filteredProducts = useMemo(() => {
    return CATALOG_PRODUCTS.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            product.brand.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'Tous' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div id="search-panel" className="h-[295px] flex flex-col justify-between pr-2">
      {/* Top Search Input & Category Filter Tabs */}
      <div className="space-y-2 shrink-0">
        <div className="relative">
          <label htmlFor="search-input" className="sr-only">Rechercher un produit dans le catalogue de Marty</label>
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
          <input
            id="search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher un produit... (ex: Mozzarella, Viande, Lasagnes, Oignons...)"
            className="w-full pl-10 pr-4 py-2.5 bg-[#F9F9F9] border border-gray-200 rounded-xl text-sm font-medium text-[#1A1A1A] placeholder-gray-400 focus:outline-none focus:border-[#FF5C00] focus:ring-1 focus:ring-[#FF5C00] focus-visible:ring-2 focus-visible:ring-[#FF5C00]"
          />
        </div>

        {/* Category Filter Tabs */}
        <div 
          id="category-tabs" 
          role="tablist"
          aria-label="Filtrer les produits par catégorie"
          className="flex gap-1 overflow-x-auto pb-1 scrollbar-none"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              role="tab"
              aria-selected={selectedCategory === cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-[11.5px] font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5C00] ${
                selectedCategory === cat
                  ? 'bg-[#FF5C00] text-white'
                  : 'bg-gray-100 text-[#666666] hover:bg-[#FFF0E0] hover:text-[#FF5C00]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product List Scroll Area */}
      <div 
        id="search-results-scroll-area" 
        className="flex-1 overflow-y-auto mt-2 space-y-1.5 h-[170px] pr-1 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent"
      >
        {filteredProducts.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-4">
            <p className="text-xs font-semibold text-[#1A1A1A]">Aucun produit trouvé</p>
            <p className="text-[11px] text-[#666666] mt-0.5">Essayez avec une autre recherche ou une autre catégorie.</p>
          </div>
        ) : (
          filteredProducts.map((product) => {
            const isSelected = activeItem?.id === product.id;
            return (
              <div
                key={product.id}
                id={`catalog-item-${product.id}`}
                onClick={() => {
                  setActiveItem(product);
                  onSelectProduct(product.aisleId, product);
                }}
                className={`flex items-center justify-between p-2.5 bg-white border rounded-xl transition-all duration-150 cursor-pointer ${
                  isSelected 
                    ? 'border-[#FF5C00] bg-[#FFF5F0]' 
                    : 'border-gray-200 hover:border-gray-300 hover:bg-[#FFF0E0]/20'
                }`}
              >
                {/* Left Side Details */}
                <div className="flex-1 min-w-0 flex items-center gap-3">
                  <div className="w-9 h-9 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-100 text-sm shrink-0 font-bold text-gray-700">
                    {product.name[0]}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-semibold text-[#1A1A1A] leading-tight truncate">
                        {product.name}
                      </span>
                      {product.promoApplied && (
                        <span className="text-[9px] font-bold text-white bg-[#1A8C4E] px-1 py-0.25 rounded-md shrink-0">
                          PROMO
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-[#666666] block truncate">
                      {product.brand} · {product.weight}
                    </span>
                  </div>
                </div>

                {/* Right Side Controls & Prices */}
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <span className="text-[14px] font-bold text-[#1A1A1A] block">
                      {product.price.toFixed(2)} €
                    </span>
                    {product.originalPrice && (
                      <span className="text-[11px] text-[#AAAAAA] line-through block leading-none">
                        {product.originalPrice.toFixed(2)} €
                      </span>
                    )}
                  </div>

                  {/* Actions Container */}
                  <div className="flex items-center gap-1">
                    {/* Locate Button */}
                    <button
                      id={`btn-locate-${product.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveItem(product);
                        onSelectProduct(product.aisleId, product);
                      }}
                      className="w-8 h-8 rounded-lg flex items-center justify-center border border-gray-200 text-gray-500 hover:text-[#FF5C00] hover:bg-[#FFF5F0] transition-colors cursor-pointer"
                      title="Localiser dans le magasin"
                    >
                      <MapPin className="w-4 h-4" />
                    </button>
                    {/* Add to Cart Button */}
                    <button
                      id={`btn-add-${product.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddItemToCart(product);
                      }}
                      className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#FF5C00] text-white hover:bg-[#D43200] transition-colors cursor-pointer"
                      title="Ajouter au panier"
                    >
                      <Plus className="w-4.5 h-4.5 stroke-[2.5]" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
