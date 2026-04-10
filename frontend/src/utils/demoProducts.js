// ═══════════════════════════════════════════
// Demo Product Catalog — works offline / without backend
// ═══════════════════════════════════════════

const DEMO_PRODUCTS = {
  '8901030793912': {
    id: 'demo-1',
    name: 'Aashirvaad Atta (5kg)',
    price: 285.00,
    category: 'Staples',
    barcode: '8901030793912',
    image_url: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_image/451651a.jpg',
    description: 'Premium whole wheat atta for soft rotis',
    weight: '5 kg',
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
  },
  '8901058010503': {
    id: 'demo-9',
    name: 'Parle-G Biscuits (800g)',
    price: 82.00,
    category: 'Biscuits',
    barcode: '8901058010503',
    image_url: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_image/23647a.jpg',
    description: 'India\'s favorite glucose biscuits — family pack',
    weight: '800 g',
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

export default DEMO_PRODUCTS;
