import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  ShoppingCart, 
  Map, 
  Search, 
  Tag, 
  ClipboardList, 
  User, 
  ArrowLeft, 
  ArrowRight,
  CheckCircle, 
  Wifi, 
  Battery, 
  Scale, 
  Sparkles,
  HelpCircle,
  TrendingDown,
  Settings,
  Scan,
  X,
  ChevronRight,
  ChevronLeft,
  Info,
  Camera,
  Smartphone,
  CreditCard,
  Check,
  MapPin,
  RotateCcw
} from 'lucide-react';

// Data and types
import { CartItem, ShoppingListItem } from './types';
import { CATALOG_PRODUCTS, STORE_PROMOTIONS, STORE_AISLES } from './data';
// @ts-expect-error - PNG file import
import mapMartyUrl from '../assets/Images/Map marty.png';
// @ts-expect-error - PNG file import
import listeDeCourseUrl from '../assets/Images/liste de course.png';
// Components
import StoreMap from './components/StoreMap';
import MartyLogo from './components/MartyLogo';

export default function App() {
  // Navigation states based on the redesigned 7-screen flow
  // appStep can be: 'connect' | 'tutorial' | 'import' | 'experience'
  const [appStep, setAppStep] = useState<'connect' | 'tutorial' | 'import' | 'experience'>('connect');
  const [useFallbackList, setUseFallbackList] = useState(false);
  
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Helper to retrieve detailed product information from its name
  const getProductDetails = (name: string) => {
    const norm = name.toLowerCase();
    if (norm.includes('oignon')) {
      return { price: 0.60, brand: 'Bio Village 500g', weight: '500g', category: 'Fruits & Légumes' };
    }
    if (norm.includes('viande hachée') || norm.includes('viande hachee')) {
      return { price: 4.90, brand: 'Charal 400g', weight: '400g', originalPrice: 5.50, savings: 0.60, category: 'Boucherie' };
    }
    if (norm.includes('mozzarella')) {
      return { price: 1.89, brand: 'Galbani 125g', weight: '125g', originalPrice: 2.20, savings: 0.31, category: 'Crèmerie' };
    }
    if (norm.includes('lasagne') || norm.includes('pâte') || norm.includes('pate')) {
      return { price: 1.20, brand: 'Barilla 500g', weight: '500g', originalPrice: 1.22, savings: 0.02, category: 'Pâtes / Féculents' };
    }
    if (norm.includes('sauce tomate')) {
      return { price: 1.00, brand: 'Barilla 400g', weight: '400g', category: 'Épicerie salée' };
    }
    if (norm.includes('parmesan')) {
      return { price: 1.45, brand: 'Galbani 60g', weight: '60g', category: 'Crèmerie' };
    }
    if (norm.includes('huile d\'olive') || norm.includes('huile dolive') || norm.includes('olive')) {
      return { price: 4.80, brand: 'Puget 50cl', weight: '50cl', category: 'Épicerie salée' };
    }
    if (norm.includes('eau')) {
      return { price: 0.20, brand: 'Cristaline 1.5L', weight: '1.5L', category: 'Boissons' };
    }
    if (norm.includes('baguette') || norm.includes('pain')) {
      return { price: 0.95, brand: 'Boulangerie du Club 250g', weight: '250g', category: 'Boulangerie' };
    }
    if (norm.includes('lait')) {
      return { price: 1.15, brand: 'Lactel 1L', weight: '1L', category: 'Produits laitiers' };
    }
    if (norm.includes('ail')) {
      return { price: 0.90, brand: 'Terroir d\'Origine', weight: '3 têtes', category: 'Fruits & Légumes' };
    }
    if (norm.includes('yaourt')) {
      return { price: 1.99, brand: 'Danone', weight: '1kg', category: 'Produits laitiers' };
    }
    if (norm.includes('gel douche')) {
      return { price: 2.10, brand: 'Le Petit Marseillais', weight: '250ml', category: 'Hygiène' };
    }
    return { price: 1.50, brand: 'Marty Essentiel', weight: 'U', category: 'Divers' };
  };

  // Helper to map category/aisle name to schematic layout numbers
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
  
  // Tab inside 'experience' (Screens 4 and 5) that swipes horizontally
  const [experienceTab, setExperienceTab] = useState<'carte' | 'scan'>('carte');
  
  // State for the product scan popup modal
  const [showScanPopup, setShowScanPopup] = useState(false);

  // States for list import and camera modal
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [noListMode, setNoListMode] = useState(false);
  const [cameraAnalyzing, setCameraAnalyzing] = useState(false);
  const [selectedNoListProduct, setSelectedNoListProduct] = useState(CATALOG_PRODUCTS[0]);

  // Current active step in tutorial instructions (Screen 2)
  const [currentTutorialStep, setCurrentTutorialStep] = useState(0);

  // Path generation loading screen states
  const [isGeneratingPath, setIsGeneratingPath] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isGeneratingPath) {
      setGenerationProgress(0);
      interval = setInterval(() => {
        setGenerationProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval!);
            return 100;
          }
          return prev + 2;
        });
      }, 100);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isGeneratingPath]);

  // GPS navigation status (starts when clicking "Dirige-moi" on Screen 4)
  const [isNavigationActive, setIsNavigationActive] = useState(false);
  const [avatarStep, setAvatarStep] = useState(0); // 0 (entrance) to 6 (caisses)

  // Information modal on Connection screen
  const [showInfoModal, setShowInfoModal] = useState(false);

  // App core states
  const [shoppingList, setShoppingList] = useState<ShoppingListItem[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  
  const shoppingListScrollRef = useRef<HTMLDivElement>(null);
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);

  // Handle shopping list scrolling to toggle visual indicator
  const handleShoppingListScroll = () => {
    if (shoppingListScrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = shoppingListScrollRef.current;
      if (scrollHeight - scrollTop - clientHeight < 15) {
        setShowScrollIndicator(false);
      } else {
        setShowScrollIndicator(true);
      }
    }
  };

  // Check if shopping list actually needs scrollbar when populated
  useEffect(() => {
    if (shoppingListScrollRef.current) {
      const { scrollHeight, clientHeight } = shoppingListScrollRef.current;
      setShowScrollIndicator(scrollHeight > clientHeight + 5);
    }
  }, [shoppingList, appStep]);

  // Group shoppingList items by category (aisleName)
  const groupedShoppingList = useMemo(() => {
    const groups: { [key: string]: ShoppingListItem[] } = {};
    shoppingList.forEach(item => {
      if (!groups[item.aisleName]) {
        groups[item.aisleName] = [];
      }
      groups[item.aisleName].push(item);
    });
    return groups;
  }, [shoppingList]);
  
  // Alert banner for scans
  const [scannedAlert, setScannedAlert] = useState<string | null>(null);

  // Simulated import states for Screen 3
  const [importing, setImporting] = useState(false);
  const [importSource, setImportSource] = useState<'photo' | 'iphone' | null>(null);

  // Contextual Promo Modal (Screen 6)
  const [activePromo, setActivePromo] = useState<any | null>(null);
  const [promoToScan, setPromoToScan] = useState<any | null>(null);

  // Self Checkout states (Screen 7)
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cb' | 'ticket'>('cb');
  const [emailReceipt, setEmailReceipt] = useState('');
  const [emailChecked, setEmailChecked] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [showTpePopup, setShowTpePopup] = useState(false);
  
  const tpeTimeoutRef = useRef<any>(null);
  const successTimeoutRef = useRef<any>(null);

  // Simulated scanner status
  const [isScanningLaserActive, setIsScanningLaserActive] = useState(true);

  // Auto-scanning helper to simulate scanner
  const triggerScannedAlert = (message: string) => {
    setScannedAlert(message);
    setTimeout(() => {
      setScannedAlert(null);
    }, 2000);
  };

  // Define the ordered GPS stops corresponding to items in list
  const gpsStops = [
    { step: 1, name: 'Fruits & Légumes', icon: '🧅', product: 'Oignons Jaunes', brand: 'Bio Village 500g', price: 0.60, weight: '500g' },
    { step: 2, name: 'Boucherie', icon: '🥩', product: 'Viande Hachée 15% mg', brand: 'Charal 400g', price: 4.90, weight: '400g' },
    { step: 3, name: 'Crèmerie', icon: '🧀', product: 'Mozzarella di Bufala', brand: 'Galbani 125g', price: 1.89, weight: '125g' },
    { step: 4, name: 'Pâtes / Féculents', icon: '🍝', product: 'Pâtes Lasagnes', brand: 'Barilla 500g', price: 1.20, weight: '500g' },
    { step: 5, name: 'Épicerie salée', icon: '🥫', product: 'Sauce Tomate Basilic', brand: 'Barilla 400g', price: 1.00, weight: '400g' },
  ];

  // Helper to determine active expected product based on avatar's step
  const currentExpectedProduct = useMemo(() => {
    // If avatar is at step 0 (entrance), the next target is step 1 (Fruits & Légumes)
    const targetStep = avatarStep === 0 ? 1 : avatarStep;
    return gpsStops.find(s => s.step === targetStep) || gpsStops[0];
  }, [avatarStep]);

  // Handle NFC touch / proceed from screen 1
  const handleNfcConnect = () => {
    setAppStep('tutorial');
  };

  // Handle list import on screen 3
  const handleStartCameraImport = () => {
    setShowCameraModal(true);
  };

  // Capture list photo simulation
  const handleCaptureListPhoto = () => {
    setCameraAnalyzing(true);
    setTimeout(() => {
      setCameraAnalyzing(false);
      setShowCameraModal(false);
      
      // Generate standard list of 9 items categorized
      const items: ShoppingListItem[] = [
        { id: 'item-1', name: 'Oignons Jaunes', aisleName: 'Fruits & Légumes', isChecked: false },
        { id: 'item-2', name: 'Viande Hachée 15% mg', aisleName: 'Boucherie', isChecked: false },
        { id: 'item-3', name: 'Mozzarella di Bufala', aisleName: 'Crèmerie', isChecked: false },
        { id: 'item-4', name: 'Pâtes Lasagnes', aisleName: 'Pâtes / Féculents', isChecked: false },
        { id: 'item-5', name: 'Sauce Tomate Basilic', aisleName: 'Épicerie salée', isChecked: false },
        { id: 'item-6', name: 'Parmesan Râpé', aisleName: 'Crèmerie', isChecked: false },
        { id: 'item-7', name: 'Huile d\'Olive', aisleName: 'Épicerie salée', isChecked: false },
        { id: 'item-8', name: 'Eau de Source des Alpes', aisleName: 'Boissons', isChecked: false },
        { id: 'item-9', name: 'Baguette Tradition', aisleName: 'Boulangerie', isChecked: false },
      ];
      setShoppingList(items);
      setNoListMode(false);
      setIsGeneratingPath(true);
      setAppStep('experience');
      setExperienceTab('carte');
      setTimeout(() => {
        setIsGeneratingPath(false);
      }, 5000);
      triggerScannedAlert("Liste analysée ! Marty a tracé votre itinéraire optimal.");
    }, 2500);
  };

  // Proceed without list (direct scan mode)
  const handleNoListProceed = () => {
    setNoListMode(true);
    setShoppingList([]);
    setAppStep('experience');
    setExperienceTab('carte');
    triggerScannedAlert("Mode Scan Libre activé ! Scannez vos articles librement.");
  };

  const handleImportList = (source: 'photo' | 'iphone') => {
    setImporting(true);
    setImportSource(source);
    setTimeout(() => {
      setImporting(false);
      const items: ShoppingListItem[] = [
        { id: 'item-1', name: 'Oignons Jaunes', aisleName: 'Fruits & Légumes', isChecked: false },
        { id: 'item-2', name: 'Viande Hachée 15% mg', aisleName: 'Boucherie', isChecked: false },
        { id: 'item-3', name: 'Mozzarella di Bufala', aisleName: 'Crèmerie', isChecked: false },
        { id: 'item-4', name: 'Pâtes Lasagnes', aisleName: 'Pâtes / Féculents', isChecked: false },
        { id: 'item-5', name: 'Sauce Tomate Basilic', aisleName: 'Épicerie salée', isChecked: false },
        { id: 'item-6', name: 'Parmesan Râpé', aisleName: 'Crèmerie', isChecked: false },
        { id: 'item-7', name: 'Huile d\'Olive', aisleName: 'Épicerie salée', isChecked: false },
        { id: 'item-8', name: 'Eau de Source des Alpes', aisleName: 'Boissons', isChecked: false },
        { id: 'item-9', name: 'Baguette Tradition', aisleName: 'Boulangerie', isChecked: false },
      ];
      setShoppingList(items);
      setNoListMode(false);
      triggerScannedAlert("Liste importée avec succès ! (9 articles trouvés)");
    }, 1800);
  };

  // Triggered when user scans an item in Screen 5
  const handleSimulatedScan = () => {
    if (promoToScan) {
      const newCartItem: CartItem = {
        id: `cart-promo-${Date.now()}`,
        name: `${promoToScan.productName} (Promo 2ème)`,
        brand: promoToScan.brand,
        weight: promoToScan.weight,
        price: promoToScan.promoPrice,
        originalPrice: promoToScan.originalPrice,
        savings: Number((promoToScan.originalPrice - promoToScan.promoPrice).toFixed(2)),
        quantity: 1,
        promoApplied: true,
        category: promoToScan.category
      };

      setCartItems(prev => [...prev, newCartItem]);
      setPromoToScan(null);
      setShowScanPopup(false);
      triggerScannedAlert("Offre promotionnelle ajoutée au panier !");
      return;
    }

    if (noListMode) {
      const product = selectedNoListProduct;
      if (!product) return;

      // Check if product is already in cart
      const existingItem = cartItems.find(item => item.name === product.name);
      if (existingItem) {
        // Increase quantity
        setCartItems(prev => prev.map(item => 
          item.name === product.name ? { ...item, quantity: item.quantity + 1 } : item
        ));
        triggerScannedAlert(`Bip ! Quantité augmentée pour ${product.name}.`);
      } else {
        // Add new cart item
        const newCartItem: CartItem = {
          id: `cart-${Date.now()}`,
          name: product.name,
          brand: product.brand,
          weight: product.weight,
          price: product.price,
          quantity: 1,
          category: product.category
        };
        setCartItems(prev => [...prev, newCartItem]);
        triggerScannedAlert(`Bip ! ${product.name} ajouté au panier.`);
      }

      // Close the scan popup
      setShowScanPopup(false);

      // Trigger Screen 6 Promo modal
      setTimeout(() => {
        setActivePromo({
          productName: product.name,
          offerTitle: `-10 % sur le deuxième de ${product.name}`,
          description: `Profitez d'un tarif préférentiel exclusif Marty. Doublez le plaisir pour seulement ${(product.price * 0.9).toFixed(2)} € de plus !`,
          originalPrice: product.price,
          promoPrice: Number((product.price * 0.9).toFixed(2)),
          brand: product.brand,
          weight: product.weight,
          category: product.category
        });
      }, 800);
      return;
    }

    const product = currentExpectedProduct;
    if (!product) return;

    // Check if product is already in cart
    const alreadyInCart = cartItems.some(item => item.name === product.product);
    if (alreadyInCart) {
      triggerScannedAlert(`${product.product} est déjà scanné !`);
      return;
    }

    // Add to cart
    const newCartItem: CartItem = {
      id: `cart-${Date.now()}`,
      name: product.product,
      brand: product.brand,
      weight: product.weight,
      price: product.price,
      quantity: 1,
      category: product.name
    };

    setCartItems(prev => [...prev, newCartItem]);
    
    // Check off in shopping list
    setShoppingList(prev => prev.map(item => 
      item.name === product.product ? { ...item, isChecked: true } : item
    ));

    triggerScannedAlert(`Bip ! ${product.product} ajouté au panier.`);
    
    // Close the scan popup
    setShowScanPopup(false);

    // Progress the GPS step
    if (avatarStep === 0) {
      setAvatarStep(1);
    } else if (avatarStep < 5) {
      setAvatarStep(prev => prev + 1);
    } else if (avatarStep === 5) {
      setAvatarStep(6); // reached checkout caisses
    }

    // Trigger Screen 6 Promo modal
    setTimeout(() => {
      setActivePromo({
        productName: product.product,
        offerTitle: `-10 % sur le deuxième sachet de ${product.product}`,
        description: `Profitez d'un tarif préférentiel exclusif Marty. Doublez le plaisir pour seulement ${(product.price * 0.9).toFixed(2)} € de plus !`,
        originalPrice: product.price,
        promoPrice: Number((product.price * 0.9).toFixed(2)),
        brand: product.brand,
        weight: product.weight,
        category: product.name
      });
    }, 800);
  };

  // Add promo item to cart (opens the scan simulator popup first)
  const handleAcceptPromo = () => {
    if (!activePromo) return;
    setPromoToScan(activePromo);
    setActivePromo(null);
    setShowScanPopup(true);
  };

  // Calculated totals of scanned items
  const totals = useMemo(() => {
    let totalQty = 0;
    let totalPrice = 0;
    let totalSavings = 0;

    cartItems.forEach(item => {
      totalQty += item.quantity;
      totalPrice += item.price * item.quantity;
      if (item.savings) {
        totalSavings += item.savings * item.quantity;
      }
    });

    return {
      quantity: totalQty,
      price: totalPrice,
      savings: totalSavings
    };
  }, [cartItems]);

  // Checkout Pay action
  const handleConfirmCheckoutPayment = () => {
    setShowTpePopup(true);
  };

  // Called when payment is successfully made on TPE terminal (manual validation)
  const handleTpePaymentCompleted = () => {
    setShowTpePopup(false);
    setCheckoutSuccess(true);

    // Complete reset after showing success screen for 4.5 seconds
    if (successTimeoutRef.current) clearTimeout(successTimeoutRef.current);
    successTimeoutRef.current = setTimeout(() => {
      setAppStep('connect');
      setCartItems([]);
      setShoppingList([]);
      setAvatarStep(0);
      setIsNavigationActive(false);
      setCheckoutOpen(false);
      setCheckoutSuccess(false);
      setEmailReceipt('');
      setEmailChecked(false);
    }, 4500);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      {/* Physical Smart Cart Bezel Wrapper to center the 1280x360 canvas */}
      <div className="bg-gray-950 p-4 rounded-[28px] shadow-2xl border-4 border-gray-800">
        
        {/* Main 1280x360 wide active viewport */}
        <div 
          id="marty-redesigned-viewport"
          className="w-[1280px] h-[360px] bg-slate-50 text-[#1A1A1A] relative font-sans overflow-hidden select-none flex flex-col justify-between"
        >
          
          {/* Top Status Indicators (Apple style) */}
          <div className="absolute top-2.5 right-6 flex items-center gap-3 z-50 text-[10px] font-bold text-gray-500/80 tracking-wider">
            {currentTime && (
              <span className="bg-orange-50 text-[#FF5C00] px-2 py-0.5 rounded-md border border-orange-100 font-mono text-xs">
                {currentTime}
              </span>
            )}
            <span className="bg-gray-100 px-1.5 py-0.5 rounded-md border border-gray-200">
              Chariot #402
            </span>
          </div>

          {/* ========================================================= */}
          {/* ÉCRAN 1 — CONNEXION                                       */}
          {/* ========================================================= */}
          {appStep === 'connect' && (
            <div 
              id="screen-connect"
              onClick={handleNfcConnect}
              className="w-full h-full bg-white flex flex-col items-center justify-center p-6 relative overflow-hidden cursor-pointer"
            >
              {/* Help Circle Button ⓘ in Top-Left */}
              <button 
                id="btn-info-connect"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowInfoModal(true);
                }}
                className="absolute top-4 left-4 w-9 h-9 flex items-center justify-center bg-white/90 hover:bg-white text-[#FF5C00] rounded-full border border-gray-150 shadow-sm transition-all z-20 active:scale-95"
              >
                <Info className="w-5 h-5 stroke-[2]" />
              </button>

              {/* Centered Main content block */}
              <div className="flex flex-col items-center justify-center text-center relative z-10 max-w-2xl">
                {/* Marty Logo with bottom margin to separate it from the text */}
                <MartyLogo size="lg" className="mb-7" />

                {/* Main Welcome Message */}
                <h2 className="text-xl font-bold text-gray-900 tracking-tight leading-snug mb-1">
                  Bonjour 👋 veuillez approcher votre téléphone, ou votre carte de fidélité pour démarrer vos courses de l’écran.
                </h2>
                
                {/* Secondary subtitle */}
                <p className="text-[11px] text-gray-400 font-medium max-w-[500px] mt-1 tracking-wide leading-relaxed">
                  Marty synchronise votre liste de courses et les avantages liés aux promotions en quelques secondes.
                </p>

                {/* NFC Scanning Visual Representation */}
                <div className="relative mt-4 h-28 w-28 flex flex-col items-center justify-center select-none">
                  {/* The Reader Pod centered */}
                  <div className="w-16 h-16 bg-gradient-to-tr from-[#FF5C00] to-[#FF6B4A] rounded-2xl flex items-center justify-center shadow-lg border-2 border-white relative z-0">
                    {/* Laser line inside the pod that flashes when phone approaches */}
                    <div className="absolute inset-x-0 h-0.5 bg-white shadow-[0_0_8px_rgba(255,255,255,1)] animate-[laser-pulse_3.2s_infinite] top-[45%] pointer-events-none" />
                  </div>
                  
                  {/* The floating phone that animates down to the reader pod */}
                  <div className="absolute top-2 animate-[phone-scan-gesture_3.2s_infinite] z-10 flex flex-col items-center">
                    <Smartphone className="w-11 h-11 text-[#FF5C00] fill-orange-50 stroke-[2.2] filter drop-shadow-sm" />
                  </div>
                </div>
              </div>

              {/* Absolute positioned bottom-right Continue button */}
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Avoid triggering NFC scan simulator click on parent
                  setAppStep('import');
                }}
                className="absolute bottom-6 right-6 text-gray-600 hover:text-[#FF5C00] text-[10px] font-black tracking-wider uppercase flex items-center gap-1 transition-all active:scale-95 cursor-pointer bg-white hover:bg-orange-50/50 border border-gray-300 hover:border-[#FF5C00]/60 px-3.5 py-1.5 rounded-full shadow-sm z-20"
              >
                <span>Continuer sans identification</span>
                <ChevronRight className="w-3.5 h-3.5 text-gray-600 group-hover:text-[#FF5C00]" />
              </button>
            </div>
          )}

          {/* ========================================================= */}
          {/* ÉCRAN 2 — COMMENT ÇA MARCHE ?                            */}
          {/* ========================================================= */}
          {appStep === 'tutorial' && (
            <div 
              id="screen-tutorial"
              className="w-full h-full bg-[#FF5C00] flex flex-col justify-between p-5 relative overflow-hidden select-none"
            >
              {/* Back button */}
              <button 
                onClick={() => {
                  if (currentTutorialStep > 0) {
                    setCurrentTutorialStep(prev => prev - 1);
                  } else {
                    setAppStep('connect');
                  }
                }}
                className="absolute top-4 left-4 w-8 h-8 flex items-center justify-center bg-white/20 hover:bg-white/30 text-white rounded-full border border-white/25 shadow-sm transition-all z-50 active:scale-95"
                aria-label="Retour"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>

              {/* Title Header */}
              <div className="text-center pt-0 shrink-0">
                <h2 className="text-xl font-black text-white tracking-tight flex items-center justify-center gap-2">
                  <span>👋</span> Bienvenue Charlotte
                </h2>
                <p className="text-[13px] text-white/80 mt-0.5">
                  Découvrez le fonctionnement de Marty en 4 étapes simples
                </p>
              </div>

              {/* Big Single Step Card view with lateral navigation arrows */}
              <div className="flex-1 flex items-center justify-between my-1 px-2 relative">
                
                {/* Left Arrow Button */}
                <button
                  onClick={() => {
                    if (currentTutorialStep > 0) {
                      setCurrentTutorialStep(prev => prev - 1);
                    }
                  }}
                  disabled={currentTutorialStep === 0}
                  className={`w-10 h-10 rounded-full border border-white/10 bg-white flex items-center justify-center shadow-md active:scale-90 transition-all cursor-pointer shrink-0 z-10 ${
                    currentTutorialStep === 0 ? 'opacity-30 pointer-events-none' : 'hover:bg-orange-50 text-[#FF5C00]'
                  }`}
                >
                  <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
                </button>

                {/* Central Step Card with gorgeous visual content */}
                <div className="flex-1 max-w-[540px] mx-4 h-[160px] bg-white rounded-2xl border border-orange-100/50 shadow-xl p-4 flex items-center gap-4 relative overflow-hidden transition-all duration-300">
                  
                  {/* Subtle background graphic */}
                  <div className="absolute -right-10 -bottom-10 w-24 h-24 bg-orange-50/50 rounded-full blur-xl pointer-events-none" />

                  {/* Left Column of Card: Big Styled Illustration Icon (Transparent background) */}
                  <div className="w-18 h-18 flex items-center justify-center shrink-0 relative select-none">
                    {currentTutorialStep === 0 && (
                      <ClipboardList className="w-11 h-11 text-[#FF5C00] stroke-[1.5] relative z-10" />
                    )}
                    {currentTutorialStep === 1 && (
                      <Map className="w-11 h-11 text-[#FF5C00] stroke-[1.5] relative z-10" />
                    )}
                    {currentTutorialStep === 2 && (
                      <Scan className="w-11 h-11 text-[#FF5C00] stroke-[1.5] relative z-10" />
                    )}
                    {currentTutorialStep === 3 && (
                      <CreditCard className="w-11 h-11 text-[#FF5C00] stroke-[1.5] relative z-10" />
                    )}

                  </div>

                  {/* Right Column of Card: Info text */}
                  <div className="flex-1 flex flex-col justify-center text-left min-w-0">
                    <span className="text-[9px] text-gray-500 font-black tracking-widest uppercase mb-0.5">
                      Étape {currentTutorialStep + 1} sur 4
                    </span>
                    
                    {currentTutorialStep === 0 && (
                      <>
                        <h3 className="text-base font-black text-gray-900 leading-tight truncate">
                          Ajoutez votre liste
                        </h3>
                        <p className="text-[14px] text-gray-600 mt-1 leading-relaxed line-clamp-3">
                          Approchez votre téléphone ou votre liste papier de la caméra située à droite de la tablette Marty.
                        </p>
                      </>
                    )}

                    {currentTutorialStep === 1 && (
                      <>
                        <h3 className="text-base font-black text-gray-900 leading-tight truncate">
                          Suivez l’itinéraire
                        </h3>
                        <p className="text-[14px] text-gray-600 mt-1 leading-relaxed line-clamp-3">
                          Marty analyse votre liste, retrouve vos produits en magasin et vous guide dans les rayons dans l’ordre le plus pratique.
                        </p>
                      </>
                    )}

                    {currentTutorialStep === 2 && (
                      <>
                        <h3 className="text-base font-black text-gray-900 leading-tight truncate">
                          Scannez vos articles
                        </h3>
                        <p className="text-[14px] text-gray-600 mt-1 leading-relaxed line-clamp-3">
                          Scannez chaque article à l’aide du scanner situé à gauche de la tablette Marty, puis placez-le dans le caddie.
                        </p>
                      </>
                    )}

                    {currentTutorialStep === 3 && (
                      <>
                        <h3 className="text-base font-black text-gray-900 leading-tight truncate">
                          Payez directement
                        </h3>
                        <p className="text-[14px] text-gray-600 mt-1 leading-relaxed line-clamp-3">
                          Sélectionnez “Payer”, puis réglez vos courses directement depuis le terminal situé à droite de la tablette Marty, sans passer par la caisse.
                        </p>
                      </>
                    )}
                  </div>

                </div>

                {/* Right Arrow Button */}
                <button
                  onClick={() => {
                    if (currentTutorialStep < 3) {
                      setCurrentTutorialStep(prev => prev + 1);
                    } else {
                      setAppStep('import');
                    }
                  }}
                  className="w-10 h-10 rounded-full border border-white/10 bg-white flex items-center justify-center shadow-md hover:bg-orange-50 text-[#FF5C00] active:scale-90 transition-all cursor-pointer shrink-0 z-10"
                >
                  <ChevronRight className="w-5 h-5 stroke-[2.5]" />
                </button>

              </div>

              {/* Progress indicator dots and action CTAs */}
              <div className="flex flex-col items-center gap-2.5 shrink-0 pb-0.5">
                {/* Dots indicator */}
                <div className="flex items-center gap-2">
                  {[0, 1, 2, 3].map((stepIdx) => (
                    <button
                      key={stepIdx}
                      onClick={() => setCurrentTutorialStep(stepIdx)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        currentTutorialStep === stepIdx 
                          ? 'bg-white w-5' 
                          : 'bg-white/30 hover:bg-white/55 w-1.5'
                      }`}
                      aria-label={`Aller à l'étape ${stepIdx + 1}`}
                    />
                  ))}
                </div>

                {/* CTA buttons */}
                <div className="flex items-center">
                  <button 
                    onClick={() => setAppStep('import')}
                    className="bg-white hover:bg-orange-50 text-gray-900 text-xs font-black px-10 py-2.5 rounded-full shadow-lg transition-all transform active:scale-97 flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>
                      {currentTutorialStep === 3 ? "C'est parti !" : "Passer le guide"}
                    </span>
                    <ArrowRight className="w-4 h-4 stroke-[2.5] text-gray-900" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* ÉCRAN 3 — IMPORT DE LA LISTE                             */}
          {/* ========================================================= */}
          {appStep === 'import' && (
            <div 
              id="screen-import"
              className="w-full h-full bg-white flex flex-col justify-between p-6 relative overflow-hidden"
            >
              {/* Back to Screen 2 */}
              <button 
                onClick={() => setAppStep('tutorial')}
                className="absolute top-4 left-4 w-9 h-9 flex items-center justify-center bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-full border border-gray-100 shadow-sm transition-all z-50 active:scale-95"
              >
                <ArrowLeft className="w-4.5 h-4.5" />
              </button>

              {/* Title */}
              <div className="text-center pt-1">
                <h2 className="text-lg font-bold text-gray-900 tracking-tight">
                  Votre liste de courses
                </h2>
                <p className="text-xs text-gray-500 mt-0.5 leading-none">
                  Importez votre liste pour générer automatiquement votre itinéraire intelligent
                </p>
              </div>

              {/* Import Options Cards */}
              <div className="flex justify-center gap-6 my-2 px-10 items-center flex-1">
                {/* Method 1: Photo with Popup Camera */}
                <button 
                  onClick={handleStartCameraImport}
                  disabled={importing}
                  className="w-[400px] h-[220px] rounded-3xl border-2 p-6 text-left flex flex-col justify-between shadow-md transition-all hover:shadow-lg cursor-pointer border-gray-200 hover:border-[#FF5C00]/50 bg-slate-50 active:scale-98"
                >
                  <div className="w-14 h-14 rounded-2xl bg-orange-100 text-[#FF5C00] flex items-center justify-center shadow-inner">
                    <Camera className="w-7 h-7 stroke-[2.5]" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-gray-950 leading-tight">Prendre une photo de votre liste</h3>
                    <p className="text-xs text-gray-500 mt-1.5 leading-snug">Scannez une liste papier manuscrite ou sur votre téléphone</p>
                  </div>
                </button>

                {/* Method 2: Je n'ai pas de liste */}
                <button 
                  onClick={handleNoListProceed}
                  disabled={importing}
                  className="w-[400px] h-[220px] rounded-3xl border-2 p-6 text-left flex flex-col justify-between shadow-md transition-all hover:shadow-lg cursor-pointer border-gray-200 hover:border-[#FF5C00]/50 bg-slate-50 active:scale-98"
                >
                  <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center shadow-inner">
                    <Scan className="w-7 h-7 stroke-[2.5]" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-gray-950 leading-tight">Je n'ai pas de liste</h3>
                    <p className="text-xs text-gray-500 mt-1.5 leading-snug">Procédez directement au scan de vos produits sans itinéraire</p>
                  </div>
                </button>
              </div>

              {/* Loading / Status indication */}
              {importing && (
                <div className="h-6 flex items-center justify-center">
                  <div className="flex items-center gap-2 text-xs text-[#FF5C00] font-semibold">
                    <div className="w-4 h-4 rounded-full border-2 border-[#FF5C00] border-t-transparent animate-spin" />
                    <span>Importation et traitement intelligent en cours...</span>
                  </div>
                </div>
              )}


            </div>
          )}

          {/* ========================================================= */}
          {/* MAIN EXPERIENCE (ÉCRANS 4 & 5)                            */}
          {/* ========================================================= */}
          {appStep === 'experience' && (
            <div className="w-full h-full flex overflow-hidden">
              {isGeneratingPath ? (
                <div className="flex-1 h-full flex flex-col items-center justify-center bg-gray-50/50 p-8">
                  {/* Animated shopping cart moving & jumping left to right */}
                  <div className="w-full max-w-4xl px-8 h-16 relative overflow-hidden flex items-end mb-6 border-b border-dashed border-gray-300 pb-2 select-none">
                    <div className="animate-cart-roll w-full absolute left-0 bottom-2 flex justify-center">
                      <div className="animate-cart-bounce text-[#FF5C00]">
                        <ShoppingCart className="w-10 h-10 stroke-[2.5]" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Main text: "Votre meilleur itinéraire est en train d'être généré..." */}
                  <h3 className="text-xl font-bold text-gray-900 tracking-tight text-center mb-2">
                    Votre meilleur itinéraire est en train d'être généré...
                  </h3>
                  
                  <p className="text-xs text-gray-500 text-center max-w-[500px] mb-8">
                    Marty calcule le parcours optimal en temps réel pour optimiser votre parcours et économiser votre énergie.
                  </p>
                  
                  {/* Progress Bar Container */}
                  <div className="w-full max-w-md bg-gray-200 h-2.5 rounded-full overflow-hidden shadow-inner mb-3">
                    <div 
                      className="bg-[#FF5C00] h-full transition-all duration-100 ease-out rounded-full"
                      style={{ width: `${generationProgress}%` }}
                    />
                  </div>
                  
                  {/* Percentage Indicator */}
                  <span className="text-xs font-mono font-bold text-[#FF5C00]">
                    {generationProgress}%
                  </span>
                </div>
              ) : (
                <>
                  {/* LEFT ACTIVE PANEL (840px width): Swipable between Map (Screen 4) & Scan (Screen 5) */}
                  <div className="w-[850px] h-full flex flex-col justify-between p-3.5 border-r border-gray-150 relative bg-white shrink-0">
                
                {/* Header of experience */}
                <div className="flex justify-between items-center h-7 shrink-0">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => {
                        setAppStep('import');
                        setIsNavigationActive(false);
                        setAvatarStep(0);
                      }}
                      className="w-7 h-7 rounded-full flex items-center justify-center bg-gray-50 hover:bg-gray-100 text-gray-500 border border-gray-200"
                      title="Modifier votre liste"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                    <span className="text-xs font-extrabold text-gray-900 tracking-tight flex items-center gap-1">
                      <span className="text-[#FF5C00]">Marty</span>
                    </span>
                  </div>
                </div>

                {/* Subscreen content area - Always show the GPS map navigation view (no tabs) */}
                <div className="flex-1 my-1.5 overflow-hidden">
                  {noListMode ? (
                    /* FREE SCAN MODE VIEW */
                    <div className="w-full h-full flex gap-3">
                      {/* Left: Beautiful Barcode Scanette Viewfinder / Direct Scan Panel */}
                      <div className="flex-1 h-[240px] relative rounded-xl border border-[#FF5C00] overflow-hidden bg-slate-950 shadow-sm select-none flex flex-col justify-between p-3.5 text-white">
                        {/* Background subtle neon barcode grid */}
                        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#FF5C00_1px,transparent_1px),linear-gradient(to_bottom,#FF5C00_1px,transparent_1px)] [background-size:14px_14px]" />
                        
                        {/* Glowing laser scan line visual effect */}
                        <div className="absolute top-0 left-0 right-0 h-0.5 bg-red-500 shadow-[0_0_8px_rgba(239,68,68,1)] animate-scan pointer-events-none" />

                        {/* Top banner */}
                        <div className="flex justify-between items-center relative z-10">
                          <div className="flex items-center gap-1.5">
                            <span className="flex h-1.5 w-1.5 relative">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF5C00] opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#FF5C00]"></span>
                            </span>
                            <span className="text-[9px] font-black text-[#FF5C00] uppercase tracking-widest">Scanner Marty</span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1 font-mono">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                            Scanner Prêt
                          </span>
                        </div>

                        {/* Centered product target to scan */}
                        <div className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-2.5 flex items-center gap-3 relative z-10">
                          <span className="text-2xl leading-none bg-slate-950 p-2 rounded-lg border border-slate-800 shadow-xs shrink-0 select-none">
                            {STORE_AISLES.find(a => a.name.toLowerCase().includes(selectedNoListProduct.category.toLowerCase()) || selectedNoListProduct.category.toLowerCase().includes(a.name.toLowerCase()) || selectedNoListProduct.category.toLowerCase().includes(a.id.toLowerCase()))?.emoji || '🛒'}
                          </span>
                          <div className="min-w-0 flex-1 text-left">
                            <span className="text-[8px] text-[#FF5C00] font-bold uppercase tracking-wider block leading-none mb-0.5">
                              ARTICLE SÉLECTIONNÉ
                            </span>
                            <h3 className="text-[11.5px] font-black text-white truncate leading-snug">
                              {selectedNoListProduct.name}
                            </h3>
                            <p className="text-[9.5px] text-slate-400 mt-0.5 leading-none font-medium">
                              {selectedNoListProduct.brand} • {selectedNoListProduct.weight}
                            </p>
                          </div>
                        </div>

                        {/* Action Button: Click to Scan directly */}
                        <button
                          onClick={() => {
                            handleSimulatedScan();
                          }}
                          className="w-full h-10.5 bg-[#FF5C00] hover:bg-[#D43200] active:scale-[0.99] text-white text-[10.5px] font-black rounded-xl shadow-lg transition-all cursor-pointer uppercase tracking-wider flex items-center justify-center gap-1.5 border border-[#FF8F6B]/30 relative z-10"
                        >
                          <Scan className="w-4 h-4" />
                          Biper l'article ({selectedNoListProduct.price.toFixed(2)} €)
                        </button>
                      </div>

                      {/* Right: Store Catalog Selector scrollable */}
                      <div className="w-[280px] h-[240px] flex flex-col justify-between p-3 bg-slate-50 border border-gray-150 rounded-xl shrink-0 shadow-inner relative overflow-hidden">
                        <div className="h-5 shrink-0 border-b border-gray-200 flex justify-between items-center pb-1">
                          <span className="text-[10px] text-gray-800 font-extrabold uppercase tracking-wider">
                            Catalogue du magasin
                          </span>
                          <span className="text-[9px] text-gray-400 font-bold">
                            {CATALOG_PRODUCTS.length} articles
                          </span>
                        </div>

                        {/* Scroll area listing store products */}
                        <div className="flex-1 overflow-y-auto space-y-1.5 my-2 pr-1 scrollbar-thin">
                          {CATALOG_PRODUCTS.map((item) => {
                            const inCartCount = cartItems.find(c => c.name === item.name)?.quantity || 0;
                            return (
                              <div 
                                key={item.id}
                                onClick={() => setSelectedNoListProduct(item)}
                                className={`border rounded-xl p-2 flex items-center justify-between transition-all cursor-pointer ${
                                  selectedNoListProduct.id === item.id
                                    ? 'border-[#FF5C00] bg-orange-50/5'
                                    : 'border-gray-150 bg-white hover:bg-orange-50/10'
                                }`}
                              >
                                <div className="min-w-0 flex-1 flex items-center gap-2">
                                  <span className="text-xl shrink-0">
                                    {STORE_AISLES.find(a => a.name.toLowerCase().includes(item.category.toLowerCase()) || item.category.toLowerCase().includes(a.name.toLowerCase()) || item.category.toLowerCase().includes(a.id.toLowerCase()))?.emoji || '📦'}
                                  </span>
                                  <div className="min-w-0 flex-1 text-left">
                                    <h4 className="text-[10.5px] font-black text-gray-900 truncate leading-tight">
                                      {item.name}
                                    </h4>
                                    <p className="text-[8.5px] text-gray-400 truncate leading-none mt-0.5">
                                      {item.brand} • {item.price.toFixed(2)} €
                                    </p>
                                  </div>
                                </div>
                                
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedNoListProduct(item);
                                  }}
                                  className={`ml-2 text-[9px] font-black px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition-all active:scale-95 cursor-pointer ${
                                    selectedNoListProduct.id === item.id
                                      ? 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                                      : 'bg-[#FF5C00] hover:bg-[#D43200] text-white'
                                  }`}
                                >
                                  <Scan className="w-2.5 h-2.5" />
                                  <span>{selectedNoListProduct.id === item.id ? 'Sélectionné' : 'Sélectionner'} {inCartCount > 0 ? `(${inCartCount})` : ''}</span>
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* STANDARD GPS NAVIGATION VIEW */
                    <div className="w-full h-full flex gap-3">
                      {/* Left: Beautiful rectangle status panel showing currently targeted product */}
                      <div className="w-[200px] h-[240px] flex flex-col justify-between p-2.5 bg-gradient-to-tr from-[#FFFDFB] to-[#FFFFFC] border-2 border-orange-100 rounded-xl shrink-0 shadow-sm relative overflow-hidden">
                        {/* Subtle decorative elements */}
                        <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-orange-100/25 rounded-full blur-xl pointer-events-none" />
                        <div className="absolute -left-6 -top-6 w-16 h-16 bg-blue-50/30 rounded-full blur-lg pointer-events-none" />

                        <div className="space-y-1.5 relative z-10 flex flex-col h-full justify-between">
                          {/* Top badge */}
                          <div className="flex items-center justify-between">
                            <span className="text-[8.5px] bg-orange-500/10 text-[#FF5C00] font-black px-1.5 py-0.5 rounded-full uppercase tracking-wider border border-orange-200">
                              En cours
                            </span>
                            <span className="text-[9.5px] text-gray-400 font-bold font-mono">
                              Étape {currentExpectedProduct.step}/5
                            </span>
                          </div>

                          {/* Central product display - Static display */}
                          <div className="bg-white/90 p-2 rounded-xl border border-orange-100/50 shadow-xs flex flex-col gap-1.5">
                            <div className="flex items-center gap-2">
                              <span className="text-2xl leading-none bg-orange-50 p-1.5 rounded-lg border border-orange-100/40 shrink-0">
                                {currentExpectedProduct.icon}
                              </span>
                              <div className="min-w-0 flex-1">
                                <span className="text-[8.5px] text-[#FF5C00] font-black uppercase tracking-wider block leading-none mb-0.5">
                                  {currentExpectedProduct.name}
                                </span>
                                <h3 className="text-[11px] font-black text-gray-900 truncate leading-snug">
                                  {currentExpectedProduct.product}
                                </h3>
                                <p className="text-[9px] text-gray-500 truncate mt-0.5 leading-none">
                                  {currentExpectedProduct.brand} • {currentExpectedProduct.weight}
                                </p>
                              </div>
                            </div>
                            
                            {/* Product location info */}
                            <div className="mt-0.5 pt-1 border-t border-gray-100 flex justify-between items-center text-[9px]">
                              <span className="text-gray-400 font-semibold">Localisation :</span>
                              <span className="font-extrabold text-[#FF5C00] bg-orange-50 px-1.5 py-0.2 rounded-md font-mono border border-orange-100/50">
                                {getAisleNumber(currentExpectedProduct.name)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right: Camera Guidance Feed (AR View) with thin orange border */}
                      <div 
                        onClick={() => setShowScanPopup(true)}
                        className="flex-1 h-[240px] relative rounded-xl border border-[#FF5C00] overflow-hidden bg-black shadow-sm select-none cursor-pointer group/ar hover:border-orange-500 transition-all"
                        title="Cliquez pour simuler le scan de l'article"
                      >
                        <img 
                          src={mapMartyUrl}
                          alt="Carte Marty"
                          className="w-full h-full object-cover group-hover/ar:scale-101 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover/ar:bg-black/10 transition-colors" />
                      </div>
                    </div>
                  )}
                </div>

                {/* BOTTOM EXPERIENCE BAR */}
                <div className="h-6 flex items-center justify-between border-t border-gray-100 pt-1.5 shrink-0">
                  <div className="text-[10px] text-gray-400 font-medium">
                    {noListMode ? (
                      <span className="text-[#FF5C00] font-bold">📍 Mode Scan Libre actif · Scannez vos articles au fur et à mesure sans itinéraire</span>
                    ) : (
                      `📍 GPS connecté · Proche de : ${currentExpectedProduct.name}`
                    )}
                  </div>

                  <div className="text-[10px] text-gray-400 font-semibold font-mono">
                    Total articles: {totals.quantity}
                  </div>
                </div>

              </div>

              {/* ========================================================= */}
              {/* FIXED RIGHT PANEL (430px width): SHOPPING LIST & TOTALS   */}
              {/* ========================================================= */}
              <div className="w-[430px] h-full bg-[#FCFCFC] p-3.5 flex flex-col justify-between shrink-0 select-none border-l border-gray-100">
                
                {/* Header title */}
                <div className="flex justify-between items-center h-7 shrink-0 border-b border-gray-100 pb-1.5">
                  <h3 className="text-xs font-extrabold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                    <ClipboardList className="w-4 h-4 text-[#FF5C00]" />
                    <span>Votre liste de courses</span>
                  </h3>
                  <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded-full">
                    {shoppingList.filter(item => item.isChecked).length} / {shoppingList.length} scannés
                  </span>
                </div>

                {/* Scroll container wrapper */}
                <div className="flex-1 my-2 relative overflow-hidden flex flex-col min-h-0">
                  {/* Vertical Scroll Area for list of items */}
                  <div 
                    ref={shoppingListScrollRef}
                    onScroll={handleShoppingListScroll}
                    className="flex-1 overflow-y-auto space-y-2 pr-1 pb-10 scrollbar-thin scrollbar-thumb-gray-200"
                  >
                    {(Object.entries(groupedShoppingList) as [string, ShoppingListItem[]][]).map(([categoryName, items]) => {
                      // Find category emoji or default to 📦
                      const categoryAisle = STORE_AISLES.find(a => 
                        a.name.toLowerCase().includes(categoryName.toLowerCase()) || 
                        a.id.toLowerCase().includes(categoryName.toLowerCase()) ||
                        categoryName.toLowerCase().includes(a.id.toLowerCase())
                      );
                      const categoryEmoji = categoryAisle ? categoryAisle.emoji : '📦';

                      return (
                        <div key={categoryName} className="space-y-1 mb-3">
                          {/* Category Header */}
                          <div className="flex items-center gap-1.5 px-2 py-1 text-[10px] font-extrabold text-[#FF5C00] uppercase tracking-wider bg-orange-50/45 rounded-lg border border-orange-100/30">
                            <span className="text-sm filter drop-shadow-xs leading-none">{categoryEmoji}</span>
                            <span className="font-sans leading-none">
                              {categoryName} {getAisleNumber(categoryName) ? `(${getAisleNumber(categoryName)})` : ''}
                            </span>
                            <span className="ml-auto text-[9px] bg-orange-100/50 text-[#FF5C00] px-1.5 py-0.2 rounded-full font-black">
                              {items.filter(i => i.isChecked).length} / {items.length}
                            </span>
                          </div>

                          {/* Category Items */}
                          <div className="space-y-1">
                            {items.map((item) => {
                              const matchedStop = gpsStops.find(s => s.product === item.name);
                              const icon = matchedStop ? matchedStop.icon : '🛒';
                              const isNextExpected = isNavigationActive && currentExpectedProduct.product === item.name;

                              return (
                                <div 
                                  key={item.id}
                                  onClick={() => {
                                    const nextChecked = !item.isChecked;
                                    // Allow manual checking/unchecking for demo fallback
                                    setShoppingList(prev => prev.map(s => 
                                      s.id === item.id ? { ...s, isChecked: nextChecked } : s
                                    ));

                                    if (nextChecked) {
                                      // Add to cart if not already present
                                      const alreadyInCart = cartItems.some(c => c.name === item.name);
                                      if (!alreadyInCart) {
                                        const details = getProductDetails(item.name);
                                        const newCartItem: CartItem = {
                                          id: `cart-manual-${item.id}`,
                                          name: item.name,
                                          brand: details.brand,
                                          weight: details.weight,
                                          price: details.price,
                                          originalPrice: details.originalPrice,
                                          savings: details.savings,
                                          quantity: 1,
                                          category: details.category
                                        };
                                        setCartItems(prev => [...prev, newCartItem]);
                                        triggerScannedAlert(`Bip ! ${item.name} ajouté au panier.`);
                                      }

                                      // Progress the GPS / avatar step to the next product
                                      if (matchedStop) {
                                        if (matchedStop.step === 5) {
                                          setAvatarStep(6);
                                        } else {
                                          setAvatarStep(matchedStop.step + 1);
                                        }
                                      }
                                    } else {
                                      // Remove from cart
                                      setCartItems(prev => prev.filter(c => c.name !== item.name && c.name !== `${item.name} (Promo 2ème)`));

                                      // Move GPS / avatar step back to this product's step
                                      if (matchedStop) {
                                        setAvatarStep(matchedStop.step);
                                      }
                                    }

                                    if (item.name === 'Mozzarella di Bufala' && nextChecked) {
                                      setTimeout(() => {
                                        setActivePromo({
                                          productName: 'Mozzarella di Bufala',
                                          offerTitle: '-10 % sur le deuxième sachet de Mozzarella di Bufala',
                                          description: "Profitez d'un tarif préférentiel exclusif Marty. Doublez le plaisir pour seulement 1.70 € de plus !",
                                          originalPrice: 1.89,
                                          promoPrice: 1.70,
                                          brand: 'Galbani 125g',
                                          weight: '125g',
                                          category: 'Crèmerie'
                                        });
                                      }, 500);
                                    }
                                  }}
                                  className={`flex items-center justify-between p-2 rounded-xl border transition-all cursor-pointer ${
                                    item.isChecked 
                                      ? 'bg-emerald-50/40 border-emerald-100 text-gray-500' 
                                      : isNextExpected
                                        ? 'bg-orange-50/40 border-[#FF5C00]/40 shadow-xs ring-1 ring-[#FF5C00]/20'
                                        : 'bg-white border-gray-150 hover:bg-slate-50'
                                  }`}
                                >
                                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                    {/* Checkbox */}
                                    <div className={`w-[18px] h-[18px] rounded-md flex items-center justify-center border transition-all shrink-0 ${
                                      item.isChecked 
                                        ? 'bg-emerald-500 border-emerald-500 text-white' 
                                        : 'border-gray-300 bg-white'
                                    }`}>
                                      {item.isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                                    </div>

                                    {/* Product Icon / Emoji */}
                                    <div className="text-sm leading-none shrink-0">{icon}</div>

                                    <div className="min-w-0 flex-1">
                                      <h4 className={`text-xs font-bold truncate leading-tight ${item.isChecked ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                                        {item.name}
                                      </h4>
                                    </div>
                                  </div>

                                  {/* Badges */}
                                  <div className="flex items-center gap-1.5 shrink-0">
                                    {isNextExpected && (
                                      <span className="text-[8px] bg-[#FF5C00] text-white font-extrabold px-1.5 py-0.5 rounded-full animate-pulse uppercase tracking-wider">
                                        GPS
                                      </span>
                                    )}
                                    {item.isChecked && (
                                      <span className="text-[8px] bg-emerald-100 text-emerald-700 font-extrabold px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                                        Panier
                                      </span>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Elegant fade & scroll hint overlay */}
                  {showScrollIndicator && (
                    <div className="absolute bottom-0 inset-x-0 h-12 bg-gradient-to-t from-[#FCFCFC] to-transparent pointer-events-none flex items-end justify-center">
                      <span className="text-[8.5px] bg-gray-900/85 text-white font-black px-2.5 py-1 rounded-full flex items-center gap-1 mb-1.5 shadow-md backdrop-blur-xs animate-bounce tracking-wider uppercase">
                        <span>Faites défiler</span>
                        <ChevronRight className="w-2.5 h-2.5 rotate-90 stroke-[3]" />
                      </span>
                    </div>
                  )}
                </div>

                {/* Under the list: Grand Encart displaying Total & PAYER button */}
                <div className="bg-gradient-to-tr from-[#1E293B] to-[#0F172A] rounded-2xl p-3 text-white border border-slate-850 shadow-md h-[95px] flex items-start justify-between shrink-0">
                  <div className="leading-none">
                    <span className="text-gray-400 uppercase tracking-wider font-extrabold" style={{ fontSize: '12px' }}>SOLDE ACTUEL</span>
                    <h4 className="font-black tracking-tight leading-none" style={{ fontSize: '21px', marginTop: '3px' }}>
                      {totals.price === 0 ? "0,00 €" : `${totals.price.toFixed(2)} €`}
                    </h4>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="text-emerald-400 font-bold leading-none uppercase" style={{ fontSize: '10.5px' }}>Économies</span>
                      <span className="font-extrabold text-emerald-400 leading-none" style={{ fontSize: '14px' }}>
                        −{totals.savings.toFixed(2)} €
                      </span>
                    </div>
                  </div>

                  <button 
                    onClick={() => setCheckoutOpen(true)}
                    className="bg-emerald-500 hover:bg-emerald-400 text-white text-[12px] font-black px-7 py-2.5 rounded-xl transition-all shadow-md transform active:scale-97 cursor-pointer uppercase tracking-wider mt-1"
                  >
                    Payer
                  </button>
                </div>

              </div>
            </>
          )}
            </div>
          )}

          {/* ========================================================= */}
          {/* ÉCRAN 1 ⓘ HELP INFORMATION MODAL OVERLAY                  */}
          {/* ========================================================= */}
          {showInfoModal && (
            <div 
              role="dialog"
              className="absolute inset-0 bg-[#0F172A]/80 backdrop-blur-xs flex items-center justify-center z-50 p-6"
            >
              <div className="bg-white rounded-2xl border border-gray-100 shadow-2xl p-5 max-w-sm w-full text-center relative animate-fade-in">
                <button 
                  onClick={() => setShowInfoModal(false)}
                  className="absolute top-3.5 right-3.5 text-gray-400 hover:text-gray-600 cursor-pointer"
                  aria-label="Fermer"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="w-12 h-12 bg-orange-50 text-[#FF5C00] rounded-full flex items-center justify-center mx-auto mb-3 border border-orange-100 shadow-inner">
                  <HelpCircle className="w-6 h-6 stroke-[2]" />
                </div>

                <h3 className="text-sm font-extrabold text-gray-900 uppercase tracking-wide">Besoin d'aide ?</h3>
                <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                  Rendez-vous au stand d'accueil Marty situé à l'entrée ou demandez assistance à un employé du magasin en rayon.
                </p>

                <button 
                  onClick={() => setShowInfoModal(false)}
                  className="mt-4 w-full bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold py-2.5 rounded-xl transition-all cursor-pointer"
                >
                  Fermer
                </button>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* ÉCRAN 6 — PROMOTION CONTEXTUELLE OVERLAY MODAL             */}
          {/* ========================================================= */}
          {activePromo && (
            <div 
              role="dialog"
              className="absolute inset-0 bg-[#0F172A]/75 backdrop-blur-xs flex items-center justify-center z-50 p-6"
            >
              <div className="bg-white rounded-3xl border border-gray-100 shadow-2xl p-5 max-w-lg w-full flex gap-5 animate-fade-in relative">
                
                {/* Close Button */}
                <button 
                  onClick={() => setActivePromo(null)}
                  className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 cursor-pointer w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center active:scale-95 transition-all"
                  aria-label="Fermer"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Left side: Product Image placeholder */}
                <div className="w-[140px] h-[170px] rounded-2xl bg-[#FFFBF9] border border-orange-100 flex flex-col justify-between p-3 shrink-0 text-center relative overflow-hidden">
                  <div className="absolute top-2 left-2 bg-emerald-500 text-white text-[8px] font-extrabold px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                    PROMO MARTY
                  </div>

                  <div className="text-5xl my-auto select-none animate-bounce" style={{ animationDuration: '3s' }}>
                    {gpsStops.find(s => s.product === activePromo.productName)?.icon || '🎁'}
                  </div>

                  <div>
                    <span className="text-[10px] font-extrabold text-[#FF5C00] block uppercase tracking-wider">{activePromo.productName}</span>
                    <span className="text-[9px] text-gray-400 block">{activePromo.weight}</span>
                  </div>
                </div>

                {/* Right side: Promo description and CTAs */}
                <div className="flex-1 flex flex-col justify-between py-1 text-left">
                  <div>
                    <span className="text-[10px] text-emerald-600 font-extrabold uppercase tracking-widest block mb-0.5">Avantage Exclusif</span>
                    <h3 className="text-sm font-black text-gray-900 leading-snug">
                      {activePromo.offerTitle}
                    </h3>
                    <p className="text-[10.5px] text-gray-500 mt-1.5 leading-relaxed">
                      {activePromo.description}
                    </p>
                  </div>

                  {/* Prices comparison */}
                  <div className="flex items-center gap-3 bg-emerald-50/50 border border-emerald-100 rounded-xl p-2.5 my-1.5 justify-between">
                    <div>
                      <span className="text-[9px] text-gray-400 block leading-none">Prix normal</span>
                      <span className="text-xs text-gray-500 line-through block mt-0.5">{activePromo.originalPrice.toFixed(2)} €</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] text-emerald-600 block font-bold leading-none uppercase">OFFRE PROMO</span>
                      <span className="text-sm font-black text-emerald-600 block mt-0.5">{activePromo.promoPrice.toFixed(2)} €</span>
                    </div>
                  </div>

                  {/* Actions buttons */}
                  <button 
                    onClick={handleAcceptPromo}
                    className="w-full bg-[#1A8C4E] hover:bg-[#15713E] text-white text-xs font-black py-2.5 rounded-xl transition-all shadow-md transform active:scale-97 cursor-pointer flex items-center justify-center gap-1.5 uppercase tracking-wider"
                  >
                    <span>Scanner l'article</span>
                  </button>
                </div>

              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* SIMULATEUR DE SCAN POPUP MODAL (PRODUIT À PROXIMITÉ)       */}
          {/* ========================================================= */}
          {showScanPopup && (
            <div 
              role="dialog"
              onClick={() => {
                setShowScanPopup(false);
                setPromoToScan(null);
              }}
              className="absolute inset-0 bg-[#0F172A]/80 backdrop-blur-md flex items-center justify-center z-50 p-3 cursor-pointer"
            >
              <div 
                onClick={(e) => {
                  e.stopPropagation();
                  handleSimulatedScan();
                }}
                className="bg-white rounded-2xl border border-gray-150 shadow-2xl p-4.5 max-w-sm w-full flex flex-col justify-between animate-fade-in text-left relative overflow-hidden cursor-pointer hover:border-orange-300 active:scale-[0.99] transition-all"
                title="Cliquez sur le bloc pour simuler le scan de l'article"
              >
                
                {/* Laser scan line visual effect */}
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-red-500 shadow-[0_0_8px_rgba(239,68,68,1)] animate-scan pointer-events-none" />

                {/* Close button */}
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowScanPopup(false);
                    setPromoToScan(null);
                  }}
                  className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 cursor-pointer w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center active:scale-95 transition-all z-10"
                  aria-label="Fermer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>

                <div className="space-y-3">
                  {/* Title & Badge */}
                  <div className="flex items-center gap-2">
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF5C00] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF5C00]"></span>
                    </span>
                    <h3 className="text-[10px] font-black text-[#FF5C00] uppercase tracking-widest">Scanner Marty</h3>
                  </div>

                  <div>
                    <h2 className="text-sm font-black text-gray-950 leading-snug">
                      Scannez le produit avec le scan situé à gauche du dispositif.
                    </h2>
                    <p className="text-[10px] text-gray-500 mt-0.5 leading-relaxed">
                      Présentez le code-barres de l'article devant le scanner physique de votre chariot.
                    </p>
                  </div>

                  {/* Target item to scan details */}
                  <div className="bg-orange-50/50 border border-orange-100 rounded-xl p-2.5 flex items-center gap-2.5">
                    <span className="text-2xl leading-none bg-white p-1.5 rounded-lg border border-orange-200/40 shadow-xs shrink-0 select-none">
                      {promoToScan ? (
                        gpsStops.find(s => s.product === promoToScan.productName)?.icon || '🎁'
                      ) : noListMode ? (
                        STORE_AISLES.find(a => a.name.toLowerCase().includes(selectedNoListProduct.category.toLowerCase()) || selectedNoListProduct.category.toLowerCase().includes(a.name.toLowerCase()) || selectedNoListProduct.category.toLowerCase().includes(a.id.toLowerCase()))?.emoji || '🛒'
                      ) : (
                        currentExpectedProduct.icon
                      )}
                    </span>
                    <div className="min-w-0 flex-1">
                      <span className="text-[8.5px] text-[#FF5C00] font-bold uppercase tracking-wider block leading-none mb-0.5">
                        {promoToScan ? 'OFFRE DEUXIÈME ARTICLE' : noListMode ? 'ARTICLE SÉLECTIONNÉ' : 'ARTICLE ATTENDU'}
                      </span>
                      <h3 className="text-[11px] font-black text-gray-900 truncate leading-snug">
                        {promoToScan ? `${promoToScan.productName} (Promo 2ème)` : noListMode ? selectedNoListProduct.name : currentExpectedProduct.product}
                      </h3>
                      <p className="text-[9px] text-gray-500 mt-0.5 leading-none font-medium">
                        {promoToScan ? (
                          `${promoToScan.brand} • ${promoToScan.weight}`
                        ) : noListMode ? (
                          `${selectedNoListProduct.brand} • ${selectedNoListProduct.weight}`
                        ) : (
                          `${currentExpectedProduct.brand} • ${currentExpectedProduct.weight}`
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Virtual Scan Area simulation */}
                  <div className="relative w-full h-16 bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden flex flex-col items-center justify-center select-none">
                    <div className="absolute top-0 bottom-0 left-0 right-0 pointer-events-none opacity-20 bg-[radial-gradient(#FF5C00_1px,transparent_1px)] [background-size:16px_16px]" />
                    {/* Laser line overlay */}
                    <div className="absolute left-0 right-0 h-0.5 bg-red-600 shadow-[0_0_12px_rgba(239,68,68,1)] animate-scan" />
                    
                    {/* Fake Barcode */}
                    <span className="text-2xl text-zinc-300 font-mono tracking-tight leading-none mt-1">█║▌║║▌║█║▌║║█║▌</span>
                    <span className="text-[8px] text-zinc-500 font-mono tracking-[4px] mt-0.5">3 123456 789012</span>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* ÉCRAN 7 — SELF CHECKOUT MODAL SHEET                        */}
          {/* ========================================================= */}
          {checkoutOpen && (
            <div 
              role="dialog"
              className="absolute inset-0 bg-[#0F172A]/85 backdrop-blur-xs flex items-center justify-center z-50 p-6"
            >
              <div className="bg-white rounded-3xl border border-gray-100 shadow-2xl p-5 max-w-4xl w-full h-[320px] flex gap-5 relative animate-fade-in text-left">
                
                {/* TPE Terminal Prompt Overlay */}
                {showTpePopup && (
                  <div 
                    onClick={handleTpePaymentCompleted}
                    className="absolute inset-0 bg-[#0F172A]/95 backdrop-blur-md rounded-3xl z-55 flex flex-col items-center justify-center p-6 text-center animate-fade-in cursor-pointer"
                    title="Cliquez pour valider le paiement"
                  >
                    {/* Header badge */}
                    <div className="bg-orange-500/15 text-[#FF5C00] border border-[#FF5C00]/25 rounded-full px-4 py-1 text-xs font-black uppercase tracking-widest mb-3">
                      Paiement en cours
                    </div>

                    {/* Instruction text */}
                    <h3 className="text-lg font-black text-white max-w-[600px] leading-relaxed">
                      Approchez-vous du terminal de paiement pour régler vos courses en toute autonomie.
                    </h3>

                    {/* Animated arrow pointing right & TPE Graphic */}
                    <div className="flex items-center gap-6 mt-4">
                      {/* Middle: Moving/sliding arrows pointing right */}
                      <div className="flex items-center gap-1.5 text-[#FF5C00]">
                        <span className="text-lg font-bold animate-slide-arrow-1">▶</span>
                        <span className="text-xl font-bold animate-slide-arrow-2">▶</span>
                        <span className="text-2xl font-bold animate-slide-arrow-3">▶</span>
                      </div>

                      {/* Right: Graphic representation of physical TPE */}
                      <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 px-3.5 py-1.5 rounded-xl shadow-lg relative overflow-hidden">
                        {/* Green indicator light flashing */}
                        <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                        <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500" />
                        
                        {/* TPE SVG */}
                        <svg className="w-7 h-7 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="5" y="2" width="14" height="20" rx="3" className="fill-slate-900" />
                          <rect x="8" y="5" width="8" height="5" rx="1" className="stroke-[1.5]" />
                          <circle cx="9" cy="14" r="0.8" className="fill-slate-400 stroke-none" />
                          <circle cx="12" cy="14" r="0.8" className="fill-slate-400 stroke-none" />
                          <circle cx="15" cy="14" r="0.8" className="fill-slate-400 stroke-none" />
                          <circle cx="9" cy="17" r="0.8" className="fill-slate-400 stroke-none" />
                          <circle cx="12" cy="17" r="0.8" className="fill-slate-400 stroke-none" />
                          <circle cx="15" cy="17" r="0.8" className="fill-slate-400 stroke-none" />
                          <path d="M7 11h10" className="stroke-[1.5]" />
                        </svg>
                        
                        <div className="text-left leading-none">
                          <span className="text-xs font-black text-white block tracking-widest uppercase">TPE</span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mt-0.5 font-mono">À DROITE</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {checkoutSuccess ? (
                  /* Checkout Payment Success Screen inside modal */
                  <div className="w-full flex flex-col items-center justify-center text-center py-6">
                    <div className="w-16 h-16 bg-[#F0FAF5] text-[#1A8C4E] rounded-full flex items-center justify-center mb-3 border border-[#1A8C4E]/20 shadow-inner">
                      <CheckCircle className="w-10 h-10 stroke-[2.5] animate-bounce" />
                    </div>
                    <h3 className="text-lg font-black text-gray-900 tracking-tight">Merci pour votre visite !</h3>
                    <p className="text-xs text-gray-500 mt-1.5 max-w-[500px]">
                      Votre paiement a été validé avec succès. Vous pouvez maintenant quitter le magasin Marty en toute sérénité.
                    </p>
                    {emailChecked && emailReceipt && (
                      <p className="text-[10px] text-[#FF5C00] font-semibold mt-2 bg-orange-50 border border-orange-100 px-3 py-1 rounded-full">
                        Reçu envoyé par email à : {emailReceipt}
                      </p>
                    )}
                    <span className="text-[11px] font-mono font-bold text-[#FF5C00] tracking-wider block mt-4 animate-pulse">
                      ▲ VEUILLEZ LAISSER LE CHARIOT POUR LE CLIENT SUIVANT. À BIENTÔT !
                    </span>
                  </div>
                ) : (
                  /* Active verification and checkout */
                  <>
                    {/* Left side: Payment Methods & Receipt config */}
                    <div className="w-[320px] h-full flex flex-col justify-between shrink-0 text-left border-r border-gray-150 pr-5 py-0.5">
                      <div className="space-y-3">
                        <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest leading-none">Moyens de paiement</h3>
                        
                        {/* Interactive toggle CB / Ticket resto */}
                        <div className="grid grid-cols-2 gap-2">
                          <button 
                            onClick={() => setPaymentMethod('cb')}
                            className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                              paymentMethod === 'cb' 
                                ? 'border-[#FF5C00] bg-[#FFF8F5] ring-1 ring-[#FF5C00]/20' 
                                : 'border-gray-200 hover:bg-gray-50'
                            }`}
                          >
                            <CreditCard className={`w-5 h-5 ${paymentMethod === 'cb' ? 'text-[#FF5C00]' : 'text-gray-400'}`} />
                            <span className="text-[11px] font-bold text-gray-900 mt-2 block">Carte bancaire</span>
                          </button>

                          <button 
                            onClick={() => setPaymentMethod('ticket')}
                            className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                              paymentMethod === 'ticket' 
                                ? 'border-[#FF5C00] bg-[#FFF8F5] ring-1 ring-[#FF5C00]/20' 
                                : 'border-gray-200 hover:bg-gray-50'
                            }`}
                          >
                            <span className="text-lg leading-none">🍽️</span>
                            <span className="text-[11px] font-bold text-gray-900 mt-2 block">Ticket Resto</span>
                          </button>
                        </div>

                        {/* Checkbox receive receipt by email */}
                        <div className="space-y-2 pt-1">
                          <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input 
                              type="checkbox" 
                              checked={emailChecked}
                              onChange={(e) => setEmailChecked(e.target.checked)}
                              className="w-4.5 h-4.5 accent-[#FF5C00] rounded-md cursor-pointer"
                            />
                            <span className="text-[11px] font-bold text-gray-700">Recevoir votre reçu par email</span>
                          </label>

                          {emailChecked && (
                            <div className="relative">
                              <input 
                                type="email" 
                                placeholder="votre.email@gmail.com" 
                                value={emailReceipt}
                                onChange={(e) => setEmailReceipt(e.target.value)}
                                className="w-full text-xs border border-gray-200 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-[#FF5C00] font-medium"
                              />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Modal actions */}
                      <div className="flex gap-2">
                        <button 
                          onClick={() => setCheckoutOpen(false)}
                          className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold py-2.5 rounded-xl transition-all cursor-pointer"
                        >
                          Retour
                        </button>
                        <button 
                          onClick={handleConfirmCheckoutPayment}
                          className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-black py-2.5 rounded-xl transition-all shadow-md transform active:scale-97 cursor-pointer uppercase tracking-wider"
                        >
                          Régler {totals.price.toFixed(2)} €
                        </button>
                      </div>
                    </div>

                    {/* Right side: Recipient receipt scroll details */}
                    <div className="flex-1 h-full flex flex-col justify-between py-0.5">
                      <div className="flex justify-between items-end border-b border-gray-150 pb-1 h-6 shrink-0">
                        <span className="text-[11px] font-black text-gray-900 uppercase tracking-widest">Panier à régler</span>
                        <span className="text-[10px] text-gray-400 font-bold">{cartItems.length} lignes de produits</span>
                      </div>

                      {/* Scroll area listing products inside checkout */}
                      <div className="flex-1 my-2 overflow-y-auto space-y-1 pr-1 text-xs">
                        {cartItems.map((item) => (
                          <div key={item.id} className="flex justify-between items-center py-1.5 border-b border-gray-100/60 font-medium">
                            <div className="min-w-0 flex-1">
                              <span className="text-gray-900 font-bold block">{item.name}</span>
                              <span className="text-[9.5px] text-gray-400">{item.brand}</span>
                            </div>
                            <div className="text-right shrink-0">
                              <span className="text-gray-800 font-bold">x{item.quantity}</span>
                              <span className="text-gray-900 font-extrabold block">{(item.price * item.quantity).toFixed(2)} €</span>
                            </div>
                          </div>
                        ))}
                        {cartItems.length === 0 && (
                          <div className="h-full flex items-center justify-center text-gray-400 italic">
                            Aucun article dans le panier.
                          </div>
                        )}
                      </div>

                      {/* Summary calculations */}
                      <div className="bg-slate-50 border border-slate-100 rounded-xl p-2.5 space-y-1 h-[65px] flex flex-col justify-center shrink-0">
                        <div className="flex justify-between items-center text-[10px] font-semibold text-gray-500">
                          <span>Sous-total HT :</span>
                          <span>{(totals.price * 0.8).toFixed(2)} €</span>
                        </div>
                        <div className="flex justify-between items-center text-[10px] font-bold text-emerald-600">
                          <span>Remise cumulée :</span>
                          <span>−{totals.savings.toFixed(2)} €</span>
                        </div>
                        <div className="flex justify-between items-center text-xs font-black text-gray-900 border-t border-gray-200 pt-1">
                          <span>Total TTC à payer :</span>
                          <span>{totals.price.toFixed(2)} €</span>
                        </div>
                      </div>
                    </div>
                  </>
                )}

              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* POPUP APPAREIL PHOTO POUR IMPORTATION PHOTO LISTE         */}
          {/* ========================================================= */}
          {showCameraModal && (
            <div 
              role="dialog"
              className="absolute inset-0 bg-white/75 backdrop-blur-md flex items-center justify-center z-50 p-3"
            >
              <div className="bg-white border border-gray-200/80 rounded-3xl shadow-2xl p-6 max-w-md w-full text-center relative animate-fade-in flex flex-col gap-4 text-gray-900">
                <button 
                  onClick={() => setShowCameraModal(false)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 bg-gray-100 hover:bg-gray-200/85 w-7 h-7 rounded-full flex items-center justify-center cursor-pointer transition-all active:scale-90 z-30"
                  aria-label="Fermer"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="px-2">
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Scanner de liste Marty</h3>
                  <h2 className="text-xs font-semibold text-gray-700 mt-1.5 leading-relaxed">
                    Tenez votre téléphone ou votre papier quelques secondes devant l’objectif, jusqu’à ce que la liste soit détectée.
                  </h2>
                </div>

                {/* Simulated Camera Viewfinder with scanning laser and high fidelity list graphic */}
                <div 
                  onClick={!cameraAnalyzing ? handleCaptureListPhoto : undefined}
                  className={`relative h-48 w-full max-w-[340px] mx-auto bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden flex items-center justify-center shadow-inner transition-all ${
                    !cameraAnalyzing ? 'cursor-pointer hover:border-[#FF5C00]/70 group/viewfinder' : ''
                  }`}
                >
                  {cameraAnalyzing ? (
                    <div className="absolute inset-0 bg-slate-950/95 flex flex-col items-center justify-center p-3 z-20">
                      {/* Animated shopping cart moving left to right */}
                      <div className="w-40 h-8 relative overflow-hidden flex items-end mb-2 border-b border-dashed border-slate-800 pb-1">
                        <div className="animate-cart-roll w-full absolute left-0 bottom-1 flex justify-center">
                          <div className="animate-cart-bounce text-[#FF5C00]">
                            <ShoppingCart className="w-6 h-6 stroke-[2.5]" />
                          </div>
                        </div>
                      </div>
                      <p className="text-[10px] font-black text-[#FF5C00] tracking-wider uppercase animate-pulse">
                        Analyse de l'écriture...
                      </p>
                      <p className="text-[9.5px] text-slate-400 text-center mt-1 max-w-[240px]">
                        Marty décode votre écriture pour concevoir votre itinéraire.
                      </p>
                    </div>
                  ) : (
                    <>
                      {/* Click overlay feedback */}
                      <div className="absolute inset-0 bg-black/0 group-hover/viewfinder:bg-black/25 flex items-center justify-center transition-all z-10">
                        <div className="bg-black/70 backdrop-blur-xs text-white px-2.5 py-1 rounded-lg text-[9px] font-bold flex items-center gap-1 opacity-0 group-hover/viewfinder:opacity-100 transition-opacity">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-camera w-3.5 h-3.5 text-[#FF5C00]" aria-hidden="true">
                            <path d="M13.997 4a2 2 0 0 1 1.76 1.05l.486.9A2 2 0 0 0 18.003 7H20a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1.997a2 2 0 0 0 1.759-1.048l.489-.904A2 2 0 0 1 10.004 4z"></path>
                            <circle cx="12" cy="13" r="3"></circle>
                          </svg>
                          Cliquez pour capturer
                        </div>
                      </div>

                      {/* Real Shopping List Image with drawing fallback if file is missing/not converted */}
                      {useFallbackList ? (
                        <div className="w-36 bg-amber-50 rounded-lg p-2.5 shadow-md border border-amber-200/50 flex flex-col gap-1 text-left text-amber-900 select-none transform -rotate-1 relative opacity-85 scale-100">
                          <div className="absolute -top-1 right-1 text-sm opacity-25">📝</div>
                          <h4 className="text-[8px] font-black tracking-widest border-b border-amber-200 pb-0.5 text-amber-800 uppercase font-mono">Liste Courses</h4>
                          <ul className="text-[8px] font-mono space-y-0.5 list-disc pl-2.5">
                            <li className="line-through text-amber-700/55">- Oignons jaunes 🧅</li>
                            <li>- Viande hachée 🥩</li>
                            <li>- Mozzarella di bufala 🧀</li>
                            <li>- Pâtes lasagnes 🍝</li>
                            <li>- Sauce tomate basilic 🥫</li>
                            <li>- Parmesan râpé 🧀</li>
                          </ul>
                        </div>
                      ) : (
                        <img 
                          src={listeDeCourseUrl} 
                          alt="Liste de courses" 
                          onError={() => setUseFallbackList(true)}
                          className="w-full h-full object-cover select-none" 
                        />
                      )}

                      {/* Camera corners */}
                      <div className="absolute top-3.5 left-3.5 w-4 h-4 border-t-2 border-l-2 border-white/70" />
                      <div className="absolute top-3.5 right-3.5 w-4 h-4 border-t-2 border-r-2 border-white/70" />
                      <div className="absolute bottom-3.5 left-3.5 w-4 h-4 border-b-2 border-l-2 border-white/70" />
                      <div className="absolute bottom-3.5 right-3.5 w-4 h-4 border-b-2 border-r-2 border-white/70" />

                      {/* Scanning Laser beam */}
                      <div className="absolute inset-x-0 h-0.5 bg-[#FF5C00] shadow-[0_0_10px_#FF5C00] animate-bounce top-[20%] opacity-80" style={{ animationDuration: '4s' }} />
                    </>
                  )}
                </div>

                {/* Bottom instructions & simple automatic detection notice */}
                <div className="flex flex-col items-center gap-1 mt-1">
                  <p className="text-[11px] text-[#FF5C00] font-medium italic animate-pulse">
                    Détection automatique en cours...
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Floating alert notification toast */}
          {scannedAlert && (
            <div 
              role="status"
              className="absolute top-4 left-1/2 -translate-x-1/2 bg-[#1A8C4E] text-white text-[11px] font-black px-4 py-2 rounded-full shadow-2xl z-50 flex items-center gap-1.5 border border-white/10 animate-fade-in"
            >
              <CheckCircle className="w-4 h-4 text-white" />
              <span>{scannedAlert}</span>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
