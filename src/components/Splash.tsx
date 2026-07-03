import React from 'react';
import { ShoppingCart, Compass, CheckCircle } from 'lucide-react';
import MartyLogo from './MartyLogo';

interface SplashProps {
  onStart: () => void;
}

export default function Splash({ onStart }: SplashProps) {
  return (
    <div 
      id="splash-screen"
      onClick={onStart}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onStart();
        }
      }}
      tabIndex={0}
      role="button"
      aria-label="Écran d'accueil de Marty. Approchez votre téléphone ou carte de fidélité de l'écran pour commencer. Cliquez n'importe où sur l'écran pour simuler cette action sans contact."
      className="w-full h-full bg-white flex flex-col justify-between p-8 relative overflow-hidden cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-[#FF5C00] select-none"
    >
      {/* Background visual accents */}
      <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[#FFF5F0] rounded-l-[180px] -mr-16 flex items-center justify-center pointer-events-none">
        <div className="opacity-[0.06] -rotate-12 scale-[2.5] transform origin-center">
          <MartyLogo size="xl" />
        </div>
      </div>

      {/* Header section */}
      <div className="flex justify-between items-center z-10">
        <div className="flex items-center gap-3">
          <MartyLogo size="md" />
          <div className="h-6 w-px bg-gray-200"></div>
          <div>
            <p className="text-[10px] text-[#666666] uppercase tracking-wider font-bold">Chariot Intelligent</p>
          </div>
        </div>
        <div className="text-right text-xs text-[#666666] font-medium font-mono bg-gray-100 px-3 py-1.5 rounded-full border border-gray-200">
          MARTY-OS v4.2.1 · ID: #402
        </div>
      </div>


      {/* Main pitch / welcome - Centered Logo and instruction */}
      <div className="flex-1 flex flex-col items-center justify-center text-center z-10 my-auto py-4">
        {/* Large Centered Logo */}
        <div className="transform scale-150 mb-6">
          <MartyLogo size="xl" />
        </div>

        {/* Instructional Phrase */}
        <p className="text-base sm:text-lg font-bold text-[#1A1A1A] tracking-tight max-w-[620px] mb-2 bg-amber-50 text-[#D43200] px-4 py-2 rounded-full border border-amber-200/60 animate-pulse" style={{ animationDuration: '3s' }}>
          Rapprochez votre téléphone ou carte de fidélité pour procéder
        </p>

        <p className="text-[11px] text-[#D43200] font-medium mb-3">
          (Cliquez n'importe où sur l'écran pour simuler la détection sans contact)
        </p>

        <p className="text-xs text-[#666666] leading-relaxed max-w-[500px]">
          Marty pèse vos articles automatiquement, applique les promotions exclusives en temps réel et optimise votre parcours.
        </p>

        <div className="flex gap-6 mt-3">
          <div className="flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-[#1A8C4E]" />
            <span className="text-[11px] font-semibold text-[#1A1A1A]">Balance Intégrée</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-[#1A8C4E]" />
            <span className="text-[11px] font-semibold text-[#1A1A1A]">Guidage Intuitif</span>
          </div>
        </div>
      </div>

      {/* Footer and CTA */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-100 z-10">
        <p className="text-[10px] text-[#666666] max-w-[90%]">
          En démarrant, vous acceptez les conditions d'utilisation du service de pesée connectée Marty.
        </p>
      </div>
    </div>
  );
}
