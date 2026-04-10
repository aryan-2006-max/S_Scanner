// ═══════════════════════════════════════════
// Demo Product Catalog — works offline / without backend
// Each product has a `stock` field: 'in_stock' | 'low_stock' | 'out_of_stock'
// ═══════════════════════════════════════════

const DEMO_PRODUCTS = {
  '8901030793912': {
    id: 'demo-1',
    name: 'Aashirvaad Atta (5kg)',
    price: 285.00,
    category: 'Staples',
    barcode: '8901030793912',
    image_url: 'https://www.thegrocart.com/products/aashirvaad-atta-5kg-SKU-5381',
    description: 'Premium whole wheat atta for soft rotis',
    weight: '5 kg',
    stock: 'in_stock',
  },
  '8901725183004': {
    id: 'demo-2',
    name: 'Tata Salt (1kg)',
    price: 28.00,
    category: 'Staples',
    barcode: '8901725183004',
    image_url: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_image/32702a.jpg',
    description: 'Iodized vacuum evaporated salt',
    weight: '1 kg',
    stock: 'in_stock',
  },
  '8901063024144': {
    id: 'demo-3',
    name: 'Maggi 2-Minute Noodles',
    price: 56.00,
    category: 'Instant Food',
    barcode: '8901063024144',
    image_url: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_image/3702a.jpg',
    description: 'Classic masala instant noodles (Pack of 8)',
    weight: '560 g',
    stock: 'in_stock',
  },
  '8902080700202': {
    id: 'demo-4',
    name: 'Coca-Cola (750ml)',
    price: 40.00,
    category: 'Beverages',
    barcode: '8902080700202',
    image_url: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_image/2764a.jpg',
    description: 'Refreshing carbonated soft drink',
    weight: '750 ml',
    stock: 'in_stock',
  },
  '8901491101769': {
    id: 'demo-5',
    name: "Lay's Classic Salted (90g)",
    price: 30.00,
    category: 'Snacks',
    barcode: '8901491101769',
    image_url: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_image/2614a.jpg',
    description: 'Crispy potato chips — classic salted flavor',
    weight: '90 g',
    stock: 'in_stock',
  },
  '8901063157002': {
    id: 'demo-6',
    name: 'KitKat (37.3g)',
    price: 40.00,
    category: 'Chocolates',
    barcode: '8901063157002',
    image_url: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_image/390939a.jpg',
    description: 'Crispy wafer covered in smooth chocolate',
    weight: '37.3 g',
    stock: 'low_stock',
  },
  '0012345678905': {
    id: 'demo-7',
    name: 'Echo Dot (5th Gen)',
    price: 4499.00,
    category: 'Electronics',
    barcode: '0012345678905',
    image_url: 'https://m.media-amazon.com/images/I/518cRYanpbL._SL500_.jpg',
    description: 'Smart speaker with Alexa',
    weight: '304 g',
    stock: 'out_of_stock',
  },
  '0012345678929': {
    id: 'demo-8',
    name: 'Kindle Paperwhite',
    price: 13999.00,
    category: 'Electronics',
    barcode: '0012345678929',
    image_url: 'https://m.media-amazon.com/images/I/61PHFxWPOkL._SL500_.jpg',
    description: 'Waterproof e-reader with backlight',
    weight: '205 g',
    stock: 'in_stock',
  },
  '8901058010503': {
    id: 'demo-9',
    name: 'Parle-G Biscuits (800g)',
    price: 82.00,
    category: 'Biscuits',
    barcode: '8901058010503',
    image_url: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_image/23647a.jpg',
    description: "India's favorite glucose biscuits — family pack",
    weight: '800 g',
    stock: 'in_stock',
  },
  '8901262150071': {
    id: 'demo-10',
    name: 'Amul Butter (500g)',
    price: 280.00,
    category: 'Dairy',
    barcode: '8901262150071',
    image_url: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_image/29432a.jpg',
    description: 'Pasteurized salted butter',
    weight: '500 g',
    stock: 'in_stock',
  },
  '8901012110058': {
    id: 'demo-11',
    name: 'Surf Excel Matic (2kg)',
    price: 399.00,
    category: 'Household',
    barcode: '8901012110058',
    image_url: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_image/10975a.jpg',
    description: 'Front load washing detergent',
    weight: '2 kg',
    stock: 'in_stock',
  },
  '8901023020804': {
    id: 'demo-12',
    name: 'Colgate MaxFresh (150g)',
    price: 97.00,
    category: 'Personal Care',
    barcode: '8901023020804',
    image_url: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_image/31610a.jpg',
    description: 'Cooling crystal toothpaste',
    weight: '150 g',
    stock: 'in_stock',
  },
  '8901764010016': {
    id: 'demo-13',
    name: 'Dabur Honey (500g)',
    price: 235.00,
    category: 'Staples',
    barcode: '8901764010016',
    image_url: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_image/14282a.jpg',
    description: '100% pure natural honey',
    weight: '500 g',
    stock: 'in_stock',
  },
  '8901030535024': {
    id: 'demo-14',
    name: 'Sunfeast Dark Fantasy',
    price: 45.00,
    category: 'Biscuits',
    barcode: '8901030535024',
    image_url: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_image/390526a.jpg',
    description: 'Choco filled cookies',
    weight: '75 g',
    stock: 'low_stock',
  },
  '8901030765421': {
    id: 'demo-15',
    name: 'Bingo Mad Angles',
    price: 20.00,
    category: 'Snacks',
    barcode: '8901030765421',
    image_url: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_image/365413a.jpg',
    description: 'Achaari masti flavored snack',
    weight: '72.5 g',
    stock: 'in_stock',
  },
  '8901088713412': {
    id: 'demo-16',
    name: 'Dettol Handwash (200ml)',
    price: 55.00,
    category: 'Personal Care',
    barcode: '8901088713412',
    image_url: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_image/10992a.jpg',
    description: 'Liquid handwash — original',
    weight: '200 ml',
    stock: 'in_stock',
  },
  '8901262011105': {
    id: 'demo-17',
    name: 'Amul Milk (1L) - Toned',
    price: 29.00,
    category: 'Dairy',
    barcode: '8901262011105',
    image_url: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_image/9693a.jpg',
    description: 'Pasteurized toned milk',
    weight: '1 L',
    stock: 'in_stock',
  },
  '8901719100574': {
    id: 'demo-18',
    name: 'Red Bull Energy Drink',
    price: 115.00,
    category: 'Beverages',
    barcode: '8901719100574',
    image_url: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_image/26050a.jpg',
    description: 'Energy drink — gives you wings',
    weight: '250 ml',
    stock: 'out_of_stock',
  },
  '8901063083301': {
    id: 'demo-19',
    name: 'Nescafé Classic (100g)',
    price: 290.00,
    category: 'Beverages',
    barcode: '8901063083301',
    image_url: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_image/3636a.jpg',
    description: 'Instant coffee — pure soluble',
    weight: '100 g',
    stock: 'in_stock',
  },
  '8901023007132': {
    id: 'demo-20',
    name: 'Vim Dishwash Bar (500g)',
    price: 42.00,
    category: 'Household',
    barcode: '8901023007132',
    image_url: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_image/11133a.jpg',
    description: 'Lemon power dishwash bar',
    weight: '500 g',
    stock: 'in_stock',
  },
  '8901063036215': {
    id: 'demo-21',
    name: 'Cadbury Dairy Milk Silk',
    price: 80.00,
    category: 'Chocolates',
    barcode: '8901063036215',
    image_url: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_image/7862a.jpg',
    description: 'Smooth & creamy milk chocolate',
    weight: '60 g',
    stock: 'in_stock',
  },
  '8902080560707': {
    id: 'demo-22',
    name: 'Sprite (750ml)',
    price: 38.00,
    category: 'Beverages',
    barcode: '8902080560707',
    image_url: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_image/2757a.jpg',
    description: 'Clear lemon-lime sparkling drink',
    weight: '750 ml',
    stock: 'in_stock',
  },
  '8901063056220': {
    id: 'demo-23',
    name: 'Oreo Biscuits (120g)',
    price: 30.00,
    category: 'Biscuits',
    barcode: '8901063056220',
    image_url: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_image/4606a.jpg',
    description: 'Vanilla flavored creme biscuits',
    weight: '120 g',
    stock: 'low_stock',
  },
  '8901030793000': {
    id: 'demo-24',
    name: 'Fortune Sunlite Oil (1L)',
    price: 150.00,
    category: 'Staples',
    barcode: '8901030793000',
    image_url: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_image/1530a.jpg',
    description: 'Refined sunflower cooking oil',
    weight: '1 L',
    stock: 'in_stock',
  },
};

/**
 * Lookup a demo product by barcode.
 * Returns { product: {...} } or null if not found.
 */
export function lookupDemoProduct(barcode) {
  const product = DEMO_PRODUCTS[barcode];
  return product ? { product: { ...product } } : null;
}

/**
 * Get all demo products as an array.
 */
export function getAllDemoProducts() {
  return Object.values(DEMO_PRODUCTS);
}

/**
 * Search demo products by name, category, or description.
 * Returns matching products (fuzzy match).
 */
export function searchDemoProducts(query) {
  if (!query || query.trim().length === 0) return [];
  const q = query.toLowerCase().trim();
  const terms = q.split(/\s+/);

  return Object.values(DEMO_PRODUCTS).filter(product => {
    const haystack = `${product.name} ${product.category} ${product.description || ''} ${product.barcode}`.toLowerCase();
    return terms.every(term => haystack.includes(term));
  }).sort((a, b) => {
    // Prioritize name matches over description matches
    const aNameMatch = a.name.toLowerCase().includes(q) ? 1 : 0;
    const bNameMatch = b.name.toLowerCase().includes(q) ? 1 : 0;
    return bNameMatch - aNameMatch;
  });
}

export default DEMO_PRODUCTS;
