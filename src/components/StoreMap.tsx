import React from 'react';

interface StoreMapProps {
  currentStop: number; // 1 to 6
  highlightedAisleId?: string; // Optional aisle to highlight
  onCellClick?: (aisleId: string) => void;
  small?: boolean;
  highContrast?: boolean;
  simplifiedMode?: boolean;
  navigationActive?: boolean; // Active GPS navigation
  avatarStep?: number; // Current step of client avatar
}

export default function StoreMap({
  currentStop,
  highlightedAisleId,
  onCellClick,
  small = false,
  highContrast = false,
  simplifiedMode = false,
  navigationActive = false,
  avatarStep = 0
}: StoreMapProps) {

  // 2D schematic blocks matching the visual image
  const MAP_BLOCKS = [
    // Long light blue bar at the top (Frais/Promos)
    { id: 'blue-bar', label: 'ZONE FRAIS / PROMO', color: '#82B4E0', type: 'rect', x: 250, y: 15, w: 450, h: 40, isSpecial: true, textColor: '#2C5E8A' },
    
    // Left blocks
    { id: '1', label: '1', color: '#CF7C8C', type: 'rect', x: 15, y: 170, w: 210, h: 160, step: 1, name: 'Fruits & Légumes', emoji: '🍎', rx: 6, ry: 6 },
    { id: '2', label: '2', color: '#E5B648', type: 'rect', x: 45, y: 100, w: 180, h: 65, rx: 6, ry: 6 },
    { id: '3', label: '3', color: '#CD5241', type: 'rect', x: 180, y: 45, w: 45, h: 50, step: 5, name: 'Épicerie salée', emoji: '🥫', rx: 4, ry: 4 },

    // Middle top group (4 to 10)
    { id: '28', label: '28', color: '#E1AF3E', type: 'rect', x: 290, y: 60, w: 60, h: 20, rx: 4, ry: 4 },
    { id: '4', label: '4', color: '#E2954F', type: 'rect', x: 270, y: 85, w: 35, h: 30, rx: 4, ry: 4 },
    { id: '5', label: '5', color: '#E2954F', type: 'rect', x: 310, y: 85, w: 35, h: 30, rx: 4, ry: 4 },
    { id: '6', label: '6', color: '#E6BE54', type: 'rect', x: 350, y: 85, w: 45, h: 30, rx: 4, ry: 4 },
    { id: '7', label: '7', color: '#E39C4E', type: 'rect', x: 400, y: 85, w: 80, h: 30, rx: 4, ry: 4 },
    { id: '8', label: '8', color: '#74BC78', type: 'rect', x: 485, y: 85, w: 30, h: 30, rx: 4, ry: 4 },
    { id: '9', label: '9', color: '#E6BE54', type: 'rect', x: 520, y: 85, w: 40, h: 30, rx: 4, ry: 4 },
    { id: '10', label: '10', color: '#7C78B4', type: 'rect', x: 565, y: 85, w: 60, h: 30, rx: 6, ry: 6 },

    // Middle row group (11 to 15)
    { id: '11', label: '11', color: '#E39C4E', type: 'rect', x: 270, y: 120, w: 75, h: 30, rx: 6, ry: 6 },
    { id: '12', label: '12', color: '#C8849E', type: 'rect', x: 350, y: 120, w: 45, h: 30, rx: 4, ry: 4 },
    { id: '13', label: '13', color: '#C8849E', type: 'rect', x: 400, y: 120, w: 80, h: 30, step: 3, name: 'Crèmerie', emoji: '🧀', rx: 4, ry: 4 },
    { id: '14', label: '14', color: '#C8849E', type: 'rect', x: 485, y: 120, w: 50, h: 30, rx: 4, ry: 4 },
    { id: '15', label: '15', color: '#C8849E', type: 'rect', x: 540, y: 120, w: 85, h: 30, rx: 6, ry: 6 },

    // Bottom center group
    { id: 'black-block', label: '', color: '#323235', type: 'rect', x: 310, y: 165, w: 55, h: 20, rx: 3, ry: 3 },
    { id: '16', label: '16', color: '#74BC78', type: 'rect', x: 260, y: 195, w: 60, h: 45, rx: 4, ry: 4 },
    { id: '17', label: '17', color: '#74BC78', type: 'rect', x: 325, y: 195, w: 35, h: 45, rx: 4, ry: 4 },
    { id: '18', label: '18', color: '#74BC78', type: 'path', d: 'M 365,195 L 420,195 C 445,195 450,210 450,240 L 365,240 Z', step: 2, name: 'Boucherie', emoji: '🥩' },
    { id: '19', label: '19', color: '#C8849E', type: 'rect', x: 455, y: 195, w: 65, h: 30, rx: 4, ry: 4 },
    { id: '20', label: '20', color: '#C8849E', type: 'rect', x: 525, y: 195, w: 75, h: 30, rx: 4, ry: 4 },
    { id: '21', label: '21', color: '#E39C4E', type: 'rect', x: 445, y: 230, w: 155, h: 30, rx: 4, ry: 4 },

    // Right group
    { id: '22', label: '22', color: '#C8849E', type: 'rect', x: 660, y: 70, w: 110, h: 25, rx: 4, ry: 4 },
    { id: '23', label: '23', color: '#C8849E', type: 'rect', x: 650, y: 100, w: 115, h: 25, rx: 4, ry: 4 },
    { id: '24', label: '24', color: '#E39C4E', type: 'rect', x: 640, y: 130, w: 165, h: 30, rx: 4, ry: 4 },
    { id: '25', label: '25', color: '#E39C4E', type: 'rect', x: 625, y: 165, w: 165, h: 45, step: 4, name: 'Pâtes / Féculents', emoji: '🍝', rx: 4, ry: 4 },
    { id: 'wc', label: 'WC', color: '#3A3A3C', type: 'rect', x: 795, y: 165, w: 70, h: 45, isWC: true, rx: 4, ry: 4 },
    { id: '26', label: '26', color: '#C8849E', type: 'rect', x: 615, y: 215, w: 100, h: 35, rx: 4, ry: 4 },
    { id: 'brown-block', label: '', color: '#5A3D28', type: 'rect', x: 720, y: 215, w: 130, h: 35, rx: 4, ry: 4 },
    { id: '27', label: '27', color: '#CF7C8C', type: 'rect', x: 605, y: 255, w: 240, h: 55, rx: 8, ry: 8 }
  ];

  // Path line points between steps mapped to center coordinates of each respective shelf block:
  // 1. Fruits & Légumes (Block 1): (120, 250)
  // 2. Boucherie (Block 18): (400, 217)
  // 3. Crèmerie (Block 13): (440, 135)
  // 4. Pâtes / Féculents (Block 25): (707, 187)
  // 5. Épicerie salée (Block 3): (202, 70)
  // 6. Caisses / Sortie (Blue bar area / Center top): (500, 35)
  const STOP_COORDINATES: Record<number, { x: number; y: number }> = {
    1: { x: 120, y: 250 },
    2: { x: 400, y: 217 },
    3: { x: 440, y: 135 },
    4: { x: 707, y: 187 },
    5: { x: 202, y: 70 },
    6: { x: 500, y: 35 }
  };

  const ROUTE_SEGMENTS = [
    { from: 1, to: 2, d: "M 120,250 C 220,250 300,217 400,217" },
    { from: 2, to: 3, d: "M 400,217 C 400,180 440,180 440,135" },
    { from: 3, to: 4, d: "M 440,135 C 550,135 600,187 707,187" },
    { from: 4, to: 5, d: "M 707,187 C 600,210 300,100 202,70" },
    { from: 5, to: 6, d: "M 202,70 C 300,35 400,35 500,35" }
  ];

  // Helper styles that respect block theme colors and highlight current active route
  const getBlockFillColor = (block: any, isHighlighted: boolean, state: string) => {
    if (highContrast) {
      if (isHighlighted || state === 'current') return '#FFFFFF';
      if (state === 'done') return 'rgba(26, 140, 78, 0.15)';
      return '#FFFFFF';
    }
    return block.color;
  };

  const getBlockBorderColor = (block: any, isHighlighted: boolean, state: string) => {
    if (isHighlighted || state === 'current') {
      return '#FF5C00'; // Vibrant active orange
    }
    if (state === 'done') {
      return '#1A8C4E'; // Modern completed green
    }
    return 'rgba(0, 0, 0, 0.12)';
  };

  return (
    <div 
      id={small ? "small-store-map" : "store-map-container"}
      className="relative bg-[#FCFCFC] rounded-xl border border-gray-150 flex flex-col p-2 select-none w-full h-full"
    >
      <div className="relative flex-1 bg-white rounded-lg border border-gray-200 overflow-hidden shadow-inner flex items-center justify-center">
        {/* SVG Store Map Canvas */}
        <svg 
          className="w-full h-full max-h-[250px]"
          viewBox="0 0 1000 350"
          preserveAspectRatio="xMidYMid meet"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Smooth, elegant beige background for the store floor plan */}
          <rect width="1000" height="350" fill="#EAE8E2" rx="12" />

          {/* 1. PATHWAY LINES (ROUTE SEGMENTS) */}
          {ROUTE_SEGMENTS.map((segment, index) => {
            const isCompleted = index < currentStop - 1;
            const isActive = index === currentStop - 2;

            let strokeColor = 'rgba(100, 100, 100, 0.3)';
            let strokeWidth = '2';
            let strokeDash = '6 4';

            if (isCompleted) {
              strokeColor = '#1A8C4E';
              strokeWidth = '2.5';
              strokeDash = 'none';
            } else if (isActive) {
              strokeColor = '#FF5C00';
              strokeWidth = '4.5';
              strokeDash = 'none';
            }

            return (
              <g key={`path-${index}`}>
                {/* Under-glow for active navigation line */}
                {isActive && (
                  <path 
                    d={segment.d} 
                    fill="none" 
                    stroke="rgba(244, 57, 0, 0.45)" 
                    strokeWidth="9" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    className="animate-pulse"
                  />
                )}
                <path 
                  d={segment.d} 
                  fill="none" 
                  stroke={strokeColor} 
                  strokeWidth={strokeWidth} 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  strokeDasharray={strokeDash}
                />
              </g>
            );
          })}

          {/* 2. STORE COLORED SCHEMATIC BLOCKS DRAWINGS */}
          {MAP_BLOCKS.map((block: any) => {
            const isHighlighted = highlightedAisleId === block.id;
            const stopState = block.step 
              ? (block.step < currentStop ? 'done' : block.step === currentStop ? 'current' : 'upcoming')
              : 'none';

            const fillColor = getBlockFillColor(block, isHighlighted, stopState);
            const borderColor = getBlockBorderColor(block, isHighlighted, stopState);
            const isRouteStop = block.step !== undefined;

            let strokeWidth = isHighlighted || stopState === 'current' ? '3.5' : isRouteStop ? '1.8' : '1.2';
            let strokeDash = stopState === 'upcoming' ? '4 3' : 'none';

            if (highContrast) {
              strokeWidth = isHighlighted || stopState === 'current' ? '5' : '2.5';
            }

            // Descriptive labels for screen readers
            const blockName = block.name || (block.id === 'wc' ? 'Toilettes' : block.isSpecial ? block.label : '');
            const blockDesc = blockName 
              ? `${block.label} : ${blockName}. ${block.step ? `Étape ${block.step} du parcours.` : ''}`
              : `Zone ${block.label}`;

            return (
              <g 
                key={block.id} 
                className="cursor-pointer transition-all hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5C00]"
                onClick={() => onCellClick?.(block.id)}
                tabIndex={0}
                role="button"
                aria-label={blockDesc}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onCellClick?.(block.id);
                  }
                }}
              >
                {/* Rectangular blocks */}
                {block.type === 'rect' && (
                  <rect 
                    x={block.x} 
                    y={block.y} 
                    width={block.w} 
                    height={block.h} 
                    rx={block.rx || 3}
                    ry={block.ry || 3}
                    fill={fillColor} 
                    stroke={borderColor} 
                    strokeWidth={strokeWidth}
                    strokeDasharray={strokeDash}
                  />
                )}

                {/* Customized shapes e.g. Curved Block 18 */}
                {block.type === 'path' && (
                  <path 
                    d={block.d}
                    fill={fillColor} 
                    stroke={borderColor} 
                    strokeWidth={strokeWidth}
                    strokeDasharray={strokeDash}
                  />
                )}

                {/* Restrooms Toilet Icon */}
                {block.isWC && (
                  <text 
                    x={block.x + block.w / 2} 
                    y={block.y + block.h / 2 + 5} 
                    fill="white" 
                    fontSize="13" 
                    fontWeight="bold" 
                    textAnchor="middle"
                  >
                    🚻
                  </text>
                )}

                {/* Block Internal Numbers (Only for non-decorative/larger blocks or when not small) */}
                {block.label && !block.isSpecial && !block.isWC && (
                  <text 
                    x={block.type === 'rect' ? block.x + block.w / 2 : 405} 
                    y={block.type === 'rect' ? block.y + block.h / 2 + 4.5 : 222} 
                    fill={highContrast ? '#000000' : 'white'} 
                    fontSize={block.id === '1' || block.id === '27' ? '18' : '12'} 
                    fontWeight="900" 
                    textAnchor="middle"
                    fontFamily="sans-serif"
                    style={{ textShadow: '0.8px 0.8px 1px rgba(0,0,0,0.25)' }}
                  >
                    {block.label}
                  </text>
                )}

                {/* Special text for banners */}
                {block.isSpecial && !small && (
                  <text 
                    x={block.x + block.w / 2} 
                    y={block.y + block.h / 2 + 4.5} 
                    fill={block.textColor} 
                    fontSize="10" 
                    fontWeight="bold" 
                    textAnchor="middle"
                    fontFamily="sans-serif"
                    letterSpacing="1"
                  >
                    {block.label}
                  </text>
                )}

                {/* Detailed Label popups inside major steps */}
                {block.id === '1' && !small && (
                  <g className="pointer-events-none">
                    <rect x="25" y="180" width="145" height="18" rx="4" fill="rgba(255, 255, 255, 0.85)" stroke="rgba(0,0,0,0.05)" strokeWidth="0.5" />
                    <text x="97" y="192" fill="#7E22CE" fontSize="8" fontWeight="black" textAnchor="middle" fontFamily="sans-serif">
                      🍎 Fruits & Légumes
                    </text>
                  </g>
                )}

                {block.id === '18' && !small && (
                  <g className="pointer-events-none">
                    <rect x="368" y="200" width="70" height="18" rx="4" fill="rgba(255, 255, 255, 0.85)" stroke="rgba(0,0,0,0.05)" strokeWidth="0.5" />
                    <text x="403" y="212" fill="#C2410C" fontSize="8" fontWeight="black" textAnchor="middle" fontFamily="sans-serif">
                      🥩 Boucherie
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* 3. OVERLAYING STATION ROUTE STOP CIRCLING BADGES */}
          {Object.entries(STOP_COORDINATES).map(([stepStr, coords]) => {
            const step = Number(stepStr);
            const isActive = step === currentStop;
            const isCompleted = step < currentStop;

            let circleBg = '#94A3B8';
            let borderStroke = '#FFFFFF';

            if (isCompleted) {
              circleBg = '#1A8C4E';
            } else if (isActive) {
              circleBg = '#FF5C00';
              borderStroke = '#FFFFFF';
            }

            return (
              <g key={`stop-node-${step}`} transform={`translate(${coords.x}, ${coords.y})`}>
                {/* Glow pulse ring for current active node */}
                {isActive && (
                  <circle r="18" fill="none" stroke="#FF5C00" strokeWidth="2.5" opacity="0.45" className="animate-ping" style={{ animationDuration: '2.5s' }} />
                )}
                
                {/* Central Circle */}
                <circle r="11.5" fill={circleBg} stroke={borderStroke} strokeWidth="1.8" className="shadow-md" />
                
                {/* Step character or checkmark */}
                {isCompleted ? (
                  <text fill="white" fontSize="9" fontWeight="950" textAnchor="middle" y="3.2" fontFamily="sans-serif">✓</text>
                ) : (
                  <text fill="white" fontSize="10" fontWeight="bold" textAnchor="middle" y="3.5" fontFamily="sans-serif">
                    {step}
                  </text>
                )}
              </g>
            );
          })}

          {/* 4. DYNAMIC GPS NAVIGATION AVATAR & FLOOR ARROWS */}
          {navigationActive && (() => {
            const getAvatarCoords = () => {
              if (avatarStep === 0) return { x: 120, y: 300 }; // Starts near bottom left entrance of Block 1
              return STOP_COORDINATES[avatarStep] || { x: 120, y: 300 };
            };
            const avCoords = getAvatarCoords();
            const nextStop = avatarStep < 6 ? avatarStep + 1 : 6;
            const nextCoords = STOP_COORDINATES[nextStop];

            return (
              <g id="gps-navigation-layer">
                {/* 4a. Connecting dynamic path to next stop */}
                {nextCoords && (
                  <g>
                    {/* Glowing under-line connecting avatar to next stop */}
                    <line 
                      x1={avCoords.x} 
                      y1={avCoords.y} 
                      x2={nextCoords.x} 
                      y2={nextCoords.y} 
                      stroke="#3B82F6" 
                      strokeWidth="4.5" 
                      strokeLinecap="round" 
                      strokeDasharray="6 4" 
                      className="opacity-70"
                    />
                    
                    {/* Directional small arrows along the line representing GPS floor arrows */}
                    {(() => {
                      const dx = nextCoords.x - avCoords.x;
                      const dy = nextCoords.y - avCoords.y;
                      const length = Math.sqrt(dx*dx + dy*dy);
                      if (length < 30) return null;
                      
                      const angle = Math.atan2(dy, dx) * 180 / Math.PI;
                      const arrows = [0.25, 0.5, 0.75];
                      
                      return arrows.map((t, idx) => {
                        const px = avCoords.x + dx * t;
                        const py = avCoords.y + dy * t;
                        return (
                          <g key={`arrow-${idx}`} transform={`translate(${px}, ${py}) rotate(${angle})`}>
                            <path 
                              d="M -4,-3 L 1,0 L -4,3" 
                              fill="none" 
                              stroke="#FFFFFF" 
                              strokeWidth="2" 
                              strokeLinecap="round" 
                              strokeLinejoin="round"
                              className="animate-pulse"
                              style={{ animationDuration: '1s', animationDelay: `${idx * 0.2}s` }}
                            />
                          </g>
                        );
                      });
                    })()}
                  </g>
                )}

                {/* 4b. Bouncing Distance flag next to avatar */}
                {nextCoords && (
                  <g transform={`translate(${avCoords.x}, ${avCoords.y - 18})`}>
                    <rect x="-24" y="-14" width="48" height="13" rx="4" fill="#3B82F6" stroke="white" strokeWidth="1" className="shadow-sm" />
                    <text x="0" y="-5" fill="white" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                      {avatarStep === 0 ? "Départ" : avatarStep === 5 ? "Caisse" : `${Math.max(3, 14 - avatarStep * 2)} m`}
                    </text>
                    <polygon points="0,0 -3,-5 3,-5" fill="#3B82F6" />
                  </g>
                )}

                {/* 4c. Animated Client Avatar Circle */}
                <g 
                  transform={`translate(${avCoords.x}, ${avCoords.y})`}
                  style={{ transition: 'all 1.2s cubic-bezier(0.25, 1, 0.5, 1)' }}
                >
                  {/* Outer pulsating blue halo */}
                  <circle r="17" fill="none" stroke="#3B82F6" strokeWidth="2.5" opacity="0.6" className="animate-ping" style={{ animationDuration: '2s' }} />
                  {/* Background glass pill for high visual fidelity */}
                  <circle r="12" fill="#3B82F6" stroke="#FFFFFF" strokeWidth="2" className="shadow-lg" />
                  {/* Silhouette representation */}
                  <text y="3" fontSize="9" fontWeight="bold" fill="white" textAnchor="middle" fontFamily="sans-serif">👤</text>
                </g>
              </g>
            );
          })()}

          {/* 5. BOUNCING "VOUS ÊTES ICI" FLOATING PIN MAP INDICATOR (ONLY IF NOT IN ACTIVE GPS MODE) */}
          {!navigationActive && (() => {
            const activeCoords = STOP_COORDINATES[currentStop];
            if (!activeCoords) return null;

            return (
              <g transform={`translate(${activeCoords.x}, ${activeCoords.y - 13})`} className="animate-bounce">
                <path 
                  d="M 0,-15 C -4,-15 -7,-12 -7,-8 C -7,-3 0,5 0,5 C 0,5 7,-3 7,-8 C 7,-12 4,-15 0,-15 Z" 
                  fill="#FF5C00" 
                  stroke="white" 
                  strokeWidth="1.2" 
                />
                <circle cx="0" cy="-9.5" r="2.5" fill="white" />
              </g>
            );
          })()}
        </svg>
      </div>
    </div>
  );
}
