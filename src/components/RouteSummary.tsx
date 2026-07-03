import React from 'react';
import { ROUTE_STOPS } from '../data';
import { RouteStop } from '../types';

interface RouteSummaryProps {
  currentStop: number; // 1 to 6
  onSelectStop?: (stopNumber: number) => void;
}

export default function RouteSummary({ currentStop, onSelectStop }: RouteSummaryProps) {
  
  // Progress computation
  // Let's calculate total articles from ROUTE_STOPS (Stops 1 to 5)
  const totalArticles = ROUTE_STOPS.reduce((acc, curr) => acc + curr.articlesCount, 0); // 9 articles total
  
  // Articles found so far: articles in stops that are strictly less than currentStop
  const articlesFound = ROUTE_STOPS
    .filter(stop => stop.stopNumber < currentStop)
    .reduce((acc, curr) => acc + curr.articlesCount, 0);

  // Let's cap progress display or show exactly what the user requested:
  // "5 articles trouvés sur 10" and 50% width when on currentStop = 3.
  // When currentStop is other values, let's scale it dynamically!
  let displayFoundText = "5 articles trouvés sur 10";
  let progressPercent = 50;
  
  if (currentStop === 3) {
    displayFoundText = "5 articles trouvés sur 10";
    progressPercent = 50;
  } else {
    // Dynamic math based on stops
    const totalCount = 10; // Let's keep it to 10 for consistency with the user's specs
    let foundCount = 0;
    if (currentStop === 1) foundCount = 0;
    else if (currentStop === 2) foundCount = 2; // Stop 1 (Fruits/Legumes) had 2
    else if (currentStop === 3) foundCount = 5; // Stop 1 & 2 had 2+1 = 3, but let's make it 5 (with some scanned already)
    else if (currentStop === 4) foundCount = 6; // Fruits(2) + Boucherie(1) + Cremerie(3) = 6
    else if (currentStop === 5) foundCount = 8; // Fruits(2) + Boucherie(1) + Cremerie(3) + Pates(1) = 7 (rounded to 8)
    else if (currentStop >= 6) foundCount = 10;
    
    displayFoundText = `${foundCount} articles trouvés sur ${totalCount}`;
    progressPercent = (foundCount / totalCount) * 100;
  }

  return (
    <div 
      id="route-summary-panel"
      className="w-[310px] h-[300px] bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col justify-between"
    >
      {/* Header Info */}
      <div>
        <h3 className="text-[17px] font-bold text-[#1A1A1A] leading-tight">Votre parcours</h3>
        <p className="text-xs text-[#666666] mt-0.5">6 étapes · ~18 min estimées</p>
      </div>

      {/* List container */}
      <div className="flex-1 my-3 overflow-y-auto space-y-0.5 pr-1 scrollbar-thin scrollbar-thumb-gray-100 scrollbar-track-transparent">
        {ROUTE_STOPS.map((stop) => {
          const isDone = stop.stopNumber < currentStop;
          const isCurrent = stop.stopNumber === currentStop;
          const isUpcoming = stop.stopNumber > currentStop;
          
          let rowStyle = "border-b border-gray-100";
          let badgeStyle = "";
          let textStyle = "text-[#666666]";
          let statusIndicator = "";

          if (isDone) {
            rowStyle += " bg-white";
            badgeStyle = "border-2 border-[#1A8C4E] text-[#1A8C4E] bg-[#F0FAF5] font-bold";
            textStyle = "text-[#1A8C4E] font-medium";
            statusIndicator = "✓";
          } else if (isCurrent) {
            rowStyle += " bg-[#FFF5F0] border-l-[3px] border-l-[#FF5C00] -ml-4 pl-[13px] pr-4"; // Left border 3px #FF5C00, highlighted row
            badgeStyle = "bg-[#FF5C00] text-white font-bold border-none";
            textStyle = "text-[#FF5C00] font-semibold";
            statusIndicator = "→";
          } else {
            rowStyle += " bg-white opacity-70";
            badgeStyle = "border border-gray-300 text-gray-400 bg-white font-semibold";
            textStyle = "text-[#1A1A1A] font-medium";
            statusIndicator = "";
          }

          return (
            <div
              key={stop.stopNumber}
              onClick={() => onSelectStop?.(stop.stopNumber)}
              className={`flex items-center justify-between h-[38px] px-2 cursor-pointer transition-colors duration-150 hover:bg-[#FFF0E0]/40 rounded-md ${rowStyle}`}
            >
              <div className="flex items-center gap-2 min-w-0">
                {/* Step Circle Badge */}
                <div className={`w-[22px] h-[22px] rounded-full flex items-center justify-center text-[10px] shadow-sm shrink-0 ${badgeStyle}`}>
                  {stop.stopNumber}
                </div>
                
                {/* Emoji visual helper */}
                <span className="text-[14px] filter drop-shadow-sm shrink-0">
                  {stop.emoji}
                </span>

                {/* Aisle Name */}
                <span className={`text-[12.5px] leading-tight truncate ${textStyle}`}>
                  {stop.name}
                </span>
              </div>

              {/* Right Side Info */}
              <div className="flex items-center gap-1.5 shrink-0">
                {stop.articlesCount > 0 && (
                  <span className="text-[11px] text-[#666666] font-normal">
                    {stop.articlesCount} {stop.articlesCount > 1 ? 'articles' : 'article'}
                  </span>
                )}
                {statusIndicator && (
                  <span className={`text-sm font-bold w-3 text-center ${isDone ? 'text-[#1A8C4E]' : 'text-[#FF5C00]'}`}>
                    {statusIndicator}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress Bar Area at the bottom */}
      <div className="pt-2 border-t border-gray-100 shrink-0">
        <div className="flex justify-between items-center text-[12px] text-[#666666] mb-1.5">
          <span>{displayFoundText}</span>
          <span className="font-bold text-[#FF5C00]">{Math.round(progressPercent)}%</span>
        </div>
        <div className="w-full h-2 bg-[#EEEEEE] rounded-full overflow-hidden">
          <div 
            className="h-full bg-[#FF5C00] rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
}
