import { Product } from '../types';

export const PRODUCTS: Product[] = [
  // WRISTWATCHES
  {
    id: 'arie-watch-gold-01',
    name: 'Royal Chronos Gold Timepiece',
    subtitle: 'High-Luster Gold Link Watch with Obsidian Sunray Dial',
    category: 'watches',
    price: 48500,
    originalPrice: 55000,
    description: 'A striking statement of presence and authority. Finished in rich gold-toned stainless steel with a high-contrast obsidian black dial, precision quartz movement, fluted bezel, and folding deployment clasp.',
    craftsmanship: 'Assembled with stainless steel links and double-locking butterfly clasp for everyday resilience and water resistance.',
    materials: ['Gold-Finished 316L Stainless Steel', 'Hardened Mineral Crystal Glass', 'Japanese Quartz Caliber'],
    dimensions: 'Case Diameter: 41 mm / Band Width: 20 mm',
    inStock: true,
    stockCount: 8,
    isFeatured: true,
    isBestseller: true,
    isNew: false,
    images: [
      '/images/products/prod-watch-gold.jpg',
      '/images/products/prod-watch-chain.jpg'
    ],
    rating: 4.9,
    reviewsCount: 42,
    sku: 'ARIE-WTC-001',
    specs: {
      'Movement': 'High-Precision Quartz Caliber',
      'Glass': 'Scratch-resistant Hardened Crystal',
      'Water Resistance': 'Splash Resistant (3 ATM)',
      'Clasp': 'Folding Safety Clasp',
      'Warranty': '1 Year Arie Guarantee'
    }
  },
  {
    id: 'arie-watch-chronograph-02',
    name: 'Executive Chronograph Black Dial Watch',
    subtitle: 'Multi-Dial Chronograph with Date Display',
    category: 'watches',
    price: 52000,
    originalPrice: 58000,
    description: 'Designed for the modern professional. Features functional multi-dial sub-registers, luminous hands for night legibility, and an integrated solid link bracelet.',
    craftsmanship: 'Heavyweight links engineered for maximum comfort and commanding presence.',
    materials: ['Polished Stainless Steel', 'Gold PVD Accents', 'Hardlex Crystal'],
    dimensions: 'Case Diameter: 42 mm / Band Width: 22 mm',
    inStock: true,
    stockCount: 6,
    isFeatured: true,
    isNew: true,
    images: [
      '/images/products/prod-watch-chronograph.jpg',
      '/images/products/prod-watch-gold.jpg'
    ],
    rating: 5.0,
    reviewsCount: 29,
    sku: 'ARIE-WTC-002',
    specs: {
      'Functions': 'Time, 24-Hour Indicator, Stopwatch',
      'Strap': 'Solid Stainless Steel Link Bracelet',
      'Dial': 'Deep Obsidian Sunburst'
    }
  },
  {
    id: 'arie-watch-chain-03',
    name: 'Classic Two-Tone Metal Link Watch',
    subtitle: 'Understated Elegance for Business & Formal Gatherings',
    category: 'watches',
    price: 42000,
    description: 'Versatile styling that pairs effortlessly with corporate suits or weekend outfits. Crisp baton hour markers on a champagne dial.',
    craftsmanship: 'Seamless link transitions with micro-adjustment links included.',
    materials: ['Stainless Steel', 'Electrolytic Gold Accent', 'Quartz Mechanism'],
    dimensions: 'Case Diameter: 39 mm',
    inStock: true,
    stockCount: 10,
    isFeatured: false,
    isNew: false,
    images: [
      '/images/products/prod-watch-chain.jpg',
      '/images/products/prod-watch-chronograph.jpg'
    ],
    rating: 4.8,
    reviewsCount: 19,
    sku: 'ARIE-WTC-003',
    specs: {
      'Style': 'Dress & Everyday Luxury',
      'Water Resistance': '30m'
    }
  },

  // JEWELRY - NECKLACES, EARRINGS, RINGS, BRACELETS
  {
    id: 'arie-pendant-gold-04',
    name: 'Arie Signature Gold Coin Medallion',
    subtitle: 'Embossed Celestial Sunburst Pendant & Chain',
    category: 'jewelry',
    price: 22500,
    originalPrice: 26000,
    description: 'Our most sought-after signature keepsake. Features an embossed celestial motif on a mirror-polished gold disc, suspended from a radiant twist curb chain.',
    craftsmanship: 'Triple-dip gold electroplating ensures enduring brilliance and tarnish resistance.',
    materials: ['18K Gold Plated Alloy', 'Anti-Tarnish Protective Seal'],
    dimensions: 'Chain Length: 45 cm + 5 cm extender / Medallion: 20 mm',
    inStock: true,
    stockCount: 15,
    isFeatured: true,
    isBestseller: true,
    isNew: false,
    images: [
      '/images/products/prod-pendant-gold.jpg',
      '/images/products/prod-necklace-set.jpg'
    ],
    rating: 4.95,
    reviewsCount: 57,
    sku: 'ARIE-JWL-001',
    specs: {
      'Chain Style': 'Fine Cable Link with Extender',
      'Hypoallergenic': 'Lead & Nickel Free',
      'Pouch': 'Signature Arie Velvet Pouch'
    }
  },
  {
    id: 'arie-necklace-choker-05',
    name: 'Statement Gold Herringbone Choker',
    subtitle: 'Silky Fluid Gold Blade Flat Chain',
    category: 'jewelry',
    price: 18000,
    description: 'Rests flat against the collarbone with mesmerizing fluid drape. Reflects golden radiance from every angle whether worn solo or layered.',
    craftsmanship: 'Seamless precision-pressed links that bend like fabric without kinking.',
    materials: ['18K Gold PVD Coating', 'Stainless Core Base'],
    dimensions: 'Length: 40 cm + 6 cm extender / Width: 5 mm',
    inStock: true,
    stockCount: 12,
    isFeatured: true,
    isNew: true,
    images: [
      '/images/products/prod-necklace-choker.jpg',
      '/images/products/prod-pendant-gold.jpg'
    ],
    rating: 4.9,
    reviewsCount: 34,
    sku: 'ARIE-JWL-002',
    specs: {
      'Width': '5mm Wide Profile',
      'Finish': 'Ultra Mirror Polish'
    }
  },
  {
    id: 'arie-bridal-set-06',
    name: 'Grand Celebration Bridal & Party Jewelry Set',
    subtitle: 'Complete Matching Necklace, Drop Earrings, Ring & Bracelet',
    category: 'jewelry',
    price: 65000,
    originalPrice: 75000,
    description: 'The ultimate ensemble for traditional weddings, galas, and landmark celebrations. Harmonious sparkle with brilliant-cut crystals set into regal gold metalwork.',
    craftsmanship: 'Hand-pronged crystals with secure locking mechanisms on all pieces.',
    materials: ['Gold Plated Alloy', 'Austrian Cut Crystals', 'Hypoallergenic Backings'],
    dimensions: 'Full 4-Piece Matching Set in Gift Case',
    inStock: true,
    stockCount: 5,
    isFeatured: true,
    isBestseller: true,
    isNew: false,
    images: [
      '/images/products/prod-bridal-set.jpg',
      '/images/products/prod-necklace-set.jpg'
    ],
    rating: 5.0,
    reviewsCount: 26,
    sku: 'ARIE-JWL-003',
    specs: {
      'Pieces Included': 'Necklace, Earrings, Ring, Bracelet',
      'Packaging': 'Deluxe Arie Presentation Box'
    }
  },
  {
    id: 'arie-ring-sparkle-07',
    name: 'Sparkling Solitaire Crystal Ring',
    subtitle: 'Brilliant Crown Cut Center Stone with Pavé Band',
    category: 'jewelry',
    price: 14500,
    description: 'Captures and scatters light like diamond fire. Ergonomically shaped for all-day comfort without finger pinching.',
    craftsmanship: 'Four-prong center mount with micro-pavé shoulder setting.',
    materials: ['18K Gold Ion Plating', 'AAA Grade Cubic Zirconia'],
    dimensions: 'Available in US Sizes 6, 7, 8, 9',
    inStock: true,
    stockCount: 14,
    isFeatured: true,
    isNew: false,
    images: [
      '/images/products/prod-ring-sparkle.jpg',
      '/images/products/prod-ring-crystal.jpg'
    ],
    rating: 4.88,
    reviewsCount: 38,
    sku: 'ARIE-JWL-004',
    specs: {
      'Stone Type': 'Heart & Arrow Cut Crystal',
      'Setting': 'Four-Prong Crown'
    }
  },
  {
    id: 'arie-mens-ring-08',
    name: 'Textured Gold & Titanium Men\'s Signet Ring',
    subtitle: 'Commanding Masculine Band with Geometric Faceting',
    category: 'jewelry',
    price: 16000,
    description: 'A bold, heavyweight signet ring engineered for men of distinction. Satin brushed center flanked by bevelled high-polish edges.',
    craftsmanship: 'Solid cast titanium core resistant to scratches and everyday wear.',
    materials: ['Titanium Alloy', '18K Yellow Gold Dip'],
    dimensions: 'Sizes 8, 9, 10, 11 / Width: 8 mm',
    inStock: true,
    stockCount: 11,
    isFeatured: false,
    isNew: true,
    images: [
      '/images/products/prod-mens-ring.jpg',
      '/images/products/prod-ring-sparkle.jpg'
    ],
    rating: 4.9,
    reviewsCount: 21,
    sku: 'ARIE-JWL-005',
    specs: {
      'Profile': 'Flat Top Comfort Fit',
      'Hypoallergenic': '100% Skin Safe'
    }
  },
  {
    id: 'arie-ring-crystal-09',
    name: 'Pavé Crystal Cocktail Ring',
    subtitle: 'Multi-Row Shimmering Band for Evening Glamour',
    category: 'jewelry',
    price: 13500,
    description: 'Dazzling rows of pavé crystals that catch the light effortlessly. Ideal for both milestone celebrations and stylish date nights.',
    craftsmanship: 'Seamless channel setting that holds stones securely.',
    materials: ['Gold Plated Brass', 'Sparkling Crystals'],
    dimensions: 'Sizes 6 to 9',
    inStock: true,
    stockCount: 10,
    isFeatured: false,
    isNew: false,
    images: [
      '/images/products/prod-ring-crystal.jpg',
      '/images/products/prod-ring-sparkle.jpg'
    ],
    rating: 4.85,
    reviewsCount: 18,
    sku: 'ARIE-JWL-006',
    specs: {
      'Design': 'Multi-Row Pavé Band'
    }
  },
  {
    id: 'arie-earrings-drop-10',
    name: 'Radiant Teardrop Gold Earrings',
    subtitle: 'Elongated Sculptural Drop Earrings with Fluid Sway',
    category: 'jewelry',
    price: 12500,
    description: 'Lightweight on the earlobe yet bold in visual impact. The teardrop silhouette flatters every jawline and neckline.',
    craftsmanship: 'Hollow-core electroforming allows featherlight all-day wear.',
    materials: ['Gold Dipped Alloy', 'Sterling Silver Ear Posts'],
    dimensions: 'Drop Length: 42 mm / Width: 14 mm',
    inStock: true,
    stockCount: 16,
    isFeatured: true,
    isNew: false,
    images: [
      '/images/products/prod-earrings-drop.jpg',
      '/images/products/prod-earrings-hoop.jpg'
    ],
    rating: 4.92,
    reviewsCount: 45,
    sku: 'ARIE-JWL-007',
    specs: {
      'Weight': 'Just 4.5 grams per earring',
      'Backing': 'Secure Push-Back with Comfort Disc'
    }
  },
  {
    id: 'arie-earrings-hoop-11',
    name: 'Classic Chunky Gold Hoop Earrings',
    subtitle: 'Timeless Tube Hoops with Snap-Bar Clasp',
    category: 'jewelry',
    price: 11000,
    description: 'The quintessential wardrobe staple. From morning business meetings to evening dinner reservations, these chunky hoops elevate every ensemble.',
    craftsmanship: 'Click-top latch mechanism tested for reliable everyday closure.',
    materials: ['18K Gold IP Plating', 'Stainless Base'],
    dimensions: 'Diameter: 30 mm / Tube Thickness: 5 mm',
    inStock: true,
    stockCount: 20,
    isFeatured: false,
    isNew: false,
    images: [
      '/images/products/prod-earrings-hoop.jpg',
      '/images/products/prod-earrings-stud.jpg'
    ],
    rating: 4.86,
    reviewsCount: 31,
    sku: 'ARIE-JWL-008',
    specs: {
      'Closure': 'Secure Click-Top Latch'
    }
  },
  {
    id: 'arie-earrings-stud-12',
    name: 'Minimalist Diamond-Cut Gold Studs',
    subtitle: 'Subtle Everyday Elegance with Faceted Sparkle',
    category: 'jewelry',
    price: 9500,
    description: 'Understated brilliance that works anywhere. Faceted geometric cuts catch light without needing large stones.',
    craftsmanship: 'Double-notched posts keep earring backs locked in place.',
    materials: ['18K Yellow Gold Plating', 'Hypoallergenic Backs'],
    dimensions: 'Diameter: 8 mm',
    inStock: true,
    stockCount: 18,
    isFeatured: false,
    isNew: false,
    images: [
      '/images/products/prod-earrings-stud.jpg',
      '/images/products/prod-earrings-drop.jpg'
    ],
    rating: 4.8,
    reviewsCount: 22,
    sku: 'ARIE-JWL-009',
    specs: {
      'Posts': 'Surgical Steel Hypoallergenic Posts'
    }
  },
  {
    id: 'arie-bracelet-charm-13',
    name: 'Dainty Gold Charm Link Bracelet',
    subtitle: 'Delicate Paperclip Chain with Suspended Charms',
    category: 'jewelry',
    price: 15000,
    description: 'A playful yet sophisticated addition to any wrist stack. Paperclip links provide modern flair while gold charms bring joyful movement.',
    craftsmanship: 'Soldered jump rings ensure charms remain securely attached.',
    materials: ['Gold Plated Alloy', 'Lobster Claw Fastener'],
    dimensions: 'Length: 17 cm + 4 cm adjustment',
    inStock: true,
    stockCount: 12,
    isFeatured: false,
    isNew: true,
    images: [
      '/images/products/prod-bracelet-charm.jpg',
      '/images/products/prod-cuff-bangle.jpg'
    ],
    rating: 4.9,
    reviewsCount: 19,
    sku: 'ARIE-JWL-010',
    specs: {
      'Adjustable': 'Fits wrists 15cm to 21cm'
    }
  },
  {
    id: 'arie-cuff-bangle-14',
    name: 'Sculptural Open Cuff Bangle',
    subtitle: 'Minimalist Wave Silhouette with Polished Ball Finials',
    category: 'jewelry',
    price: 18500,
    description: 'Effortless to slip on and off. Sleek sculptural gold contour wraps smoothly around the wrist.',
    craftsmanship: 'Flexible spring-temper brass alloy allows subtle size adjustments.',
    materials: ['Heavy Gold Dip', 'Spring Brass Core'],
    dimensions: 'Inner Diameter: 60 mm (Gently Adjustable)',
    inStock: true,
    stockCount: 9,
    isFeatured: true,
    isNew: false,
    images: [
      '/images/products/prod-cuff-bangle.jpg',
      '/images/products/prod-bracelet-charm.jpg'
    ],
    rating: 4.94,
    reviewsCount: 28,
    sku: 'ARIE-JWL-011',
    specs: {
      'Profile': 'Torque Open Cuff'
    }
  },

  // ACCESSORIES - CUFFLINKS, TIES, SUNGLASSES
  {
    id: 'arie-cufflinks-lapel-15',
    name: 'Executive Gold Cufflinks & Lapel Pin Set',
    subtitle: 'Gentleman\'s Sartorial Suiting Companion',
    category: 'accessories',
    price: 17500,
    originalPrice: 20000,
    description: 'Sharpen your formal presence at weddings, conferences, and Sunday best. Includes matching swivel-back cufflinks and an architectural lapel pin.',
    craftsmanship: 'Precision micro-etched geometric face with bullet-back closures.',
    materials: ['Solid Brass with 24K Gold Tone', 'Enamel Inset'],
    dimensions: 'Cufflink: 18 mm / Lapel Pin: 65 mm pin length',
    inStock: true,
    stockCount: 15,
    isFeatured: true,
    isNew: false,
    images: [
      '/images/products/prod-cufflinks-lapel.jpg',
      '/images/products/prod-tie-clip.jpg'
    ],
    rating: 4.95,
    reviewsCount: 39,
    sku: 'ARIE-ACC-001',
    specs: {
      'Set Includes': '1 Pair Cufflinks + 1 Matching Lapel Pin',
      'Box': 'Hard-shell Executive Case'
    }
  },
  {
    id: 'arie-tie-clip-16',
    name: 'Gentleman\'s Silk Tie & Gold Clip Ensemble',
    subtitle: 'Woven Jacquard Tie with Engraved Gold Tie Bar',
    category: 'accessories',
    price: 19000,
    description: 'Rich fabric weave that holds an immaculate Windsor knot, paired with a spring-loaded gold tie clip that keeps neckwear straight all day.',
    craftsmanship: 'High-density jacquard weaving with wool interlining for crease recovery.',
    materials: ['Microfiber Silk Jacquard', 'Polished Brass Tie Bar'],
    dimensions: 'Tie: 148 cm x 7.5 cm / Clip: 55 mm',
    inStock: true,
    stockCount: 12,
    isFeatured: false,
    isNew: true,
    images: [
      '/images/products/prod-tie-clip.jpg',
      '/images/products/prod-cufflinks-lapel.jpg'
    ],
    rating: 4.88,
    reviewsCount: 24,
    sku: 'ARIE-ACC-002',
    specs: {
      'Tie Width': '7.5 cm Modern Blade',
      'Fabric': 'Crease-Resistant Woven Jacquard'
    }
  },
  {
    id: 'arie-sunglasses-17',
    name: 'Designer Tinted UV400 Sunglasses',
    subtitle: 'Gradient Amber Lenses with Gold Wire Frame',
    category: 'accessories',
    price: 14000,
    originalPrice: 17000,
    description: 'Chic retro styling with modern UV protection. Protects your eyes from tropical glare while turning heads on city streets.',
    craftsmanship: 'Silicone comfort nose pads and reinforced hinge screws.',
    materials: ['Alloy Gold Frame', 'Polycarbonate UV400 Lenses'],
    dimensions: 'Lens Width: 54 mm / Bridge: 18 mm / Temple: 142 mm',
    inStock: true,
    stockCount: 14,
    isFeatured: true,
    isBestseller: true,
    isNew: false,
    images: [
      '/images/products/prod-sunglasses.jpg',
      '/images/products/prod-luxury-sunglasses.jpg'
    ],
    rating: 4.9,
    reviewsCount: 47,
    sku: 'ARIE-ACC-003',
    specs: {
      'Protection': '100% UV400 UVA/UVB Filter',
      'Case': 'Protective Hard Case & Cleaning Cloth'
    }
  },
  {
    id: 'arie-luxury-sunglasses-18',
    name: 'Square Aviator Black & Gold Sunglasses',
    subtitle: 'Bold Architectural Frame with Smoke Black Lenses',
    category: 'accessories',
    price: 16500,
    description: 'A modern upgrade to the classic aviator. Flat top brow bar and dark smoke lenses exude confidence.',
    craftsmanship: 'Scratch-resistant anti-reflective lens coating.',
    materials: ['Acetate & Gold-Toned Alloy', 'Polarized Polycarbonate'],
    dimensions: 'Lens Width: 58 mm / Bridge: 16 mm',
    inStock: true,
    stockCount: 11,
    isFeatured: false,
    isNew: true,
    images: [
      '/images/products/prod-luxury-sunglasses.jpg',
      '/images/products/prod-sunglasses.jpg'
    ],
    rating: 4.92,
    reviewsCount: 25,
    sku: 'ARIE-ACC-004',
    specs: {
      'Lens': 'Category 3 UV400 Protection'
    }
  },
  {
    id: 'arie-accessories-set-19',
    name: 'Complete Gentleman\'s Styling Gift Box',
    subtitle: 'Tie, Pocket Square, Cufflinks, Tie Clip & Lapel Pin',
    category: 'accessories',
    price: 38000,
    originalPrice: 45000,
    description: 'The quintessential gift for groomsmen, birthdays, graduations, and executive promotions. Everything needed for an impeccable look in one curated presentation.',
    craftsmanship: 'Color-matched accessories hand-packed in a bespoke gift box.',
    materials: ['Woven Silk', '24K Gold Tone Metal', 'Gift Presentation Box'],
    dimensions: '5-in-1 Comprehensive Formal Set',
    inStock: true,
    stockCount: 7,
    isFeatured: true,
    isBestseller: true,
    isNew: false,
    images: [
      '/images/products/prod-accessories-set.jpg',
      '/images/products/prod-tie-clip.jpg'
    ],
    rating: 5.0,
    reviewsCount: 33,
    sku: 'ARIE-ACC-005',
    specs: {
      'Includes': 'Tie, Pocket Square, Pair of Cufflinks, Tie Clip, Lapel Rose Pin'
    }
  },

  // FOOTBALL JERSEYS
  {
    id: 'arie-jersey-club-20',
    name: 'Premium Club Edition Football Jersey',
    subtitle: 'Breathable Moisture-Wicking Official Quality Knit',
    category: 'jerseys',
    price: 24000,
    originalPrice: 28000,
    description: 'Celebrate your passion in genuine comfort. Crafted with micro-perforated athletic fabric, embroidered club crest, and heat-pressed sponsor graphics.',
    craftsmanship: 'Double-needle flatlock seams reduce chafing during matches or casual wear.',
    materials: ['100% Recycled Aeroready Polyester', 'Embroidered Silicone Crest'],
    dimensions: 'Sizes S, M, L, XL, XXL available',
    inStock: true,
    stockCount: 20,
    isFeatured: true,
    isBestseller: true,
    isNew: false,
    images: [
      '/images/products/prod-jersey-club.jpg',
      '/images/products/prod-football-jersey.jpg'
    ],
    rating: 4.95,
    reviewsCount: 52,
    sku: 'ARIE-JSY-001',
    specs: {
      'Fabric': 'Dri-FIT Moisture Evaporating Mesh',
      'Fit': 'Athletic Regular Fit',
      'Badges': 'Authentic League & Club Patching'
    }
  },
  {
    id: 'arie-jersey-national-21',
    name: 'Player Issue National Team Jersey',
    subtitle: 'Lightweight Matchday Cut with Thermal Breathability',
    category: 'jerseys',
    price: 26500,
    description: 'Vibrant national team pride woven with ultra-light competition fabric. Worn by supporters across Nigeria and international diaspora.',
    craftsmanship: 'Seamless laser-cut ventilation zones across chest and lower back.',
    materials: ['High-Performance Aeroknit Polyester'],
    dimensions: 'Sizes S to XXL',
    inStock: true,
    stockCount: 16,
    isFeatured: false,
    isNew: true,
    images: [
      '/images/products/prod-football-jersey.jpg',
      '/images/products/prod-jersey-club.jpg'
    ],
    rating: 4.9,
    reviewsCount: 37,
    sku: 'ARIE-JSY-002',
    specs: {
      'Style': 'Official Matchday Edition'
    }
  },
  {
    id: 'arie-necklace-set-22',
    name: 'Deluxe Layered Pendant & Earrings Set',
    subtitle: 'Dual-Layer Chain with Matching Drop Studs',
    category: 'jewelry',
    price: 28000,
    description: 'A pre-styled layered look that takes the guesswork out of accessorizing. Shimmers with warm gold tones on any skin complexion.',
    craftsmanship: 'Tangle-free dual chain connector clasp.',
    materials: ['18K Gold Plated Brass', 'Protective Anti-Tarnish Coating'],
    dimensions: 'Short Chain: 40 cm / Long Chain: 50 cm',
    inStock: true,
    stockCount: 11,
    isFeatured: false,
    isNew: false,
    images: [
      '/images/products/prod-necklace-set.jpg',
      '/images/products/prod-pendant-gold.jpg'
    ],
    rating: 4.88,
    reviewsCount: 20,
    sku: 'ARIE-JWL-012',
    specs: {
      'Included': 'Layered Necklace & Matching Earrings'
    }
  }
];

export const CURRENCY_RATES: Record<string, { symbol: string; rate: number; name: string }> = {
  NGN: { symbol: '₦', rate: 1.0, name: 'NGN (₦)' },
  USD: { symbol: '$', rate: 0.00067, name: 'USD ($)' },
  GBP: { symbol: '£', rate: 0.00052, name: 'GBP (£)' },
  EUR: { symbol: '€', rate: 0.00061, name: 'EUR (€)' }
};

export const BUSINESS_INFO = {
  name: 'Arie Jewelry and Accessories',
  shortName: 'Arie Jewelry',
  tagline: 'Authentic, Affordable, and Elegant Jewelry & Accessories',
  address: 'Opposite Army Barracks, Lokoja, Kogi State, Nigeria',
  location: 'Lokoja, Kogi State, Nigeria',
  whatsapp: '08164907596',
  whatsappUrl: 'https://wa.me/2348164907596',
  phone: '+234 816 490 7596',
  instagram: '@ariejewelryandaccessories',
  instagramUrl: 'https://www.instagram.com/ariejewelryandaccessories?igsh=MWxzaXo5cHhxOGthcQ%3D%3D&utm_source=qr',
  tiktok: '@arie_jewelry',
  tiktokUrl: 'https://www.tiktok.com/@arie_jewelry?_r=1&_t=ZS-9APQcbVu4zY',
  facebook: 'Arie Jewelry and Accessories',
  facebookUrl: 'https://www.facebook.com/share/19dba575nT/?mibextid=wwXIfr',
  deliveryPromise: 'Nationwide Delivery across all 36 States in Nigeria'
};
