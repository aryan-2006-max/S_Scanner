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
    image_url: 'https://storage.googleapis.com/shy-pub/340140/aashirvaad-atta-1702468645457_SKU-0836_0.jpg',
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
    image_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQA8W6mOONBqfFL3qcZYCx2VLlMbBod0FBpFA&s',
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
    image_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqmRQvXHQL-o8xxzzuALaOfTpB0sJBcRkQFQ&s',
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
    image_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOZ87eqKp3vrm-ctUpBs7OsF6LvPA8a9AGmg&s',
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
    image_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQe7SJHXil5PKdhhBWfbIUf9FRXeQ8aGk6WLw&s',
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
    image_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbhOkYEzEgt3DsGFPKG_NBtEM4uL7_IMUibA&s',
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
  '8901764010016': {
    id: 'demo-13',
    name: 'Dabur Honey (500g)',
    price: 235.00,
    category: 'Staples',
    barcode: '8901764010016',
    image_url: 'https://m.media-amazon.com/images/I/71O4OnjaHVL._AC_UF894,1000_QL80_.jpg',
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
    image_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSe0ih26gA4rqR4lv_d22j2lcyLLruDzWB4Pg&s',
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
    image_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQO2CPqOUbWhaX0mqULv4biDTQGfPUU5YCP-A&s',
    description: 'Achaari masti flavored snack',
    weight: '72.5 g',
    stock: 'in_stock',
  },
  '8901719100574': {
    id: 'demo-18',
    name: 'Red Bull Energy Drink',
    price: 115.00,
    category: 'Beverages',
    barcode: '8901719100574',
    image_url: 'data:image/jpeg;base64,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',
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
