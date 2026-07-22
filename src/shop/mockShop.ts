import { Order, Payout, Product, RefundReq } from './types'

const IMG = {
  master: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=700&q=80&auto=format&fit=crop',
  tracks: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=700&q=80&auto=format&fit=crop',
  journal: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=700&q=80&auto=format&fit=crop',
  tabla: 'https://images.unsplash.com/photo-1543443258-92b04ad5ec6b?w=700&q=80&auto=format&fit=crop',
  brush: 'https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=700&q=80&auto=format&fit=crop',
  alt1: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=700&q=80&auto=format&fit=crop',
}
const AV = {
  abhishek: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&q=80&auto=format&fit=crop',
  meera: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=200&q=80&auto=format&fit=crop',
  arjun: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=200&q=80&auto=format&fit=crop',
  kavya: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80&auto=format&fit=crop',
}

export const seedProducts: Product[] = [
  {
    id: 'art-of-songwriting', type: 'Masterclass', title: 'The Art of Indian Songwriting',
    summary: 'Write original songs rooted in Indian melody and language.',
    description: 'A complete masterclass on composing and writing songs that blend classical sensibilities with contemporary structure. Learn melody, lyric-writing, arrangement and production fundamentals.',
    category: 'Music', subcategory: 'Composition', tags: ['Songwriting', 'Composition', 'Lyrics'], language: 'Hindi, English',
    sellerId: 'abhishek-singh-chouhan', sellerName: 'Abhishek Singh Chouhan', sellerAvatar: AV.abhishek,
    price: 1499, currency: 'INR', compareAt: 2499, free: false, rating: 4.9, reviews: 128,
    images: [IMG.master, IMG.alt1], cover: IMG.master, status: 'published', createdAt: '2026-06-10',
    instructor: 'Abhishek Singh Chouhan', level: 'All Levels', duration: '4h 20m', certificate: true, accessDuration: 'Lifetime',
    outcomes: ['Write a complete original song', 'Build melody from a raga', 'Structure verses and hooks', 'Produce a simple demo'],
    requirements: 'A device to record ideas. No prior experience needed.', audience: 'Aspiring songwriters and musicians',
    syllabus: [
      { id: 's1', title: 'Foundations', description: 'Melody, mood and intent', lessons: [
        { id: 'l1', title: 'Welcome & overview', duration: '6m', freePreview: true, resources: ['Course guide.pdf'] },
        { id: 'l2', title: 'Melody from raga', duration: '22m', freePreview: false, resources: [] },
        { id: 'l3', title: 'Finding your hook', duration: '18m', freePreview: false, resources: ['Hook worksheet.pdf'] },
      ] },
      { id: 's2', title: 'Writing & structure', description: 'Lyrics and song form', lessons: [
        { id: 'l4', title: 'Lyric writing basics', duration: '25m', freePreview: false, resources: [] },
        { id: 'l5', title: 'Verse, chorus, bridge', duration: '20m', freePreview: false, resources: [] },
      ] },
      { id: 's3', title: 'Producing a demo', description: 'Bring it together', lessons: [
        { id: 'l6', title: 'Arrangement', duration: '24m', freePreview: false, resources: ['Stems.zip'] },
        { id: 'l7', title: 'Final demo walkthrough', duration: '28m', freePreview: false, resources: [] },
      ] },
    ],
    sales: 128, createdByMe: false,
  },
  {
    id: 'classical-practice-tracks', type: 'Digital', title: 'Indian Classical Practice Tracks',
    summary: 'A studio-quality tanpura and rhythm pack for daily practice.',
    description: 'Forty high-quality backing tracks across ragas and talas for riyaz and practice. Loop-ready, tuned to standard pitches.',
    category: 'Music', subcategory: 'Practice', tags: ['Audio', 'Riyaz', 'Backing Tracks'], language: 'Instrumental',
    sellerId: 'abhishek-singh-chouhan', sellerName: 'Abhishek Singh Chouhan', sellerAvatar: AV.abhishek,
    price: 499, currency: 'INR', free: false, rating: 4.8, reviews: 64,
    images: [IMG.tracks], cover: IMG.tracks, status: 'published', createdAt: '2026-06-18',
    digitalType: 'Audio', fileFormat: 'WAV + MP3', fileSize: '820 MB', version: '1.2', licence: 'Personal Use',
    downloadLimit: '5 downloads', usage: 'For personal practice and non-commercial use.', sampleUrl: 'https://example.com/sample',
    sales: 64, createdByMe: false,
  },
  {
    id: 'folk-art-journal', type: 'Physical', title: 'Handcrafted Folk Art Journal',
    summary: 'A hand-bound journal with original folk-art cover.',
    description: 'A limited-run journal, hand-bound with cotton paper and a screen-printed folk-art cover. 160 pages, lay-flat binding.',
    category: 'Craft', subcategory: 'Stationery', tags: ['Handmade', 'Folk Art', 'Journal'], language: '—',
    sellerId: 'meera-kulkarni', sellerName: 'Meera Kulkarni', sellerAvatar: AV.meera,
    price: 899, currency: 'INR', compareAt: 1099, free: false, rating: 4.7, reviews: 41,
    images: [IMG.journal], cover: IMG.journal, status: 'published', createdAt: '2026-06-02',
    sku: 'MK-JRNL-01', materials: 'Cotton paper, board, cotton thread', dimensions: '21 × 14 × 2 cm', weight: '340 g', origin: 'India',
    stock: 24, lowStock: 5, variants: [
      { id: 'v1', name: 'Cover: Indigo', price: 899, stock: 14 },
      { id: 'v2', name: 'Cover: Ochre', price: 899, stock: 10 },
    ],
    shippingRegions: 'India', processing: '2–3 days', deliveryEstimate: '5–7 days', shippingType: 'Flat Rate', shippingCost: 60,
    returnEligible: true, returnWindow: '7 days', care: 'Keep away from moisture.',
    sales: 41, createdByMe: false,
  },
  {
    id: 'tabla-practice-kit', type: 'Physical', title: 'Beginner Tabla Practice Kit',
    summary: 'Everything a beginner needs to start tabla.',
    description: 'A starter kit with a practice pad, tuning hammer, powder and a printed beginner guide. Ideal for new students.',
    category: 'Music', subcategory: 'Instruments', tags: ['Tabla', 'Beginner', 'Kit'], language: '—',
    sellerId: 'arjun-mehta', sellerName: 'Arjun Mehta', sellerAvatar: AV.arjun,
    price: 1299, currency: 'INR', free: false, rating: 4.6, reviews: 22,
    images: [IMG.tabla], cover: IMG.tabla, status: 'published', createdAt: '2026-06-20',
    sku: 'AM-TABLA-KIT', materials: 'Rubber pad, steel, wood', dimensions: '30 × 20 × 10 cm', weight: '1.1 kg', origin: 'India',
    stock: 0, lowStock: 3, variants: [],
    shippingRegions: 'India', processing: '3–4 days', deliveryEstimate: '6–9 days', shippingType: 'Flat Rate', shippingCost: 90,
    returnEligible: true, returnWindow: '10 days', care: 'Wipe pad clean after use.',
    sales: 22, createdByMe: false,
  },
  {
    id: 'brush-texture-pack', type: 'Digital', title: 'Folk Art Brush & Texture Pack',
    summary: 'Hand-made brushes and textures for digital folk art.',
    description: 'A set of 60 procreate brushes and 30 paper textures derived from traditional folk techniques. Commercial licence included.',
    category: 'Visual Arts', subcategory: 'Assets', tags: ['Brushes', 'Textures', 'Digital Art'], language: '—',
    sellerId: 'kavya-sharma', sellerName: 'Kavya Sharma', sellerAvatar: AV.kavya,
    price: 649, currency: 'INR', free: false, rating: 4.9, reviews: 89,
    images: [IMG.brush], cover: IMG.brush, status: 'published', createdAt: '2026-06-25',
    digitalType: 'Design Asset', fileFormat: '.brushset, .png', fileSize: '210 MB', version: '2.0', licence: 'Commercial Use',
    downloadLimit: 'Unlimited', usage: 'Use in personal and commercial artwork.', sampleUrl: 'https://example.com/sample',
    sales: 89, createdByMe: false,
  },
]

export const getProduct = (id?: string) => seedProducts.find((p) => p.id === id)

export const seedOrders: Order[] = [
  {
    id: 'ord-1', orderId: 'IICA-SHOP-7741', buyerName: 'Reshma Patra', buyerEmail: 'reshma@example.com',
    items: [{ productId: 'classical-practice-tracks', title: 'Indian Classical Practice Tracks', cover: IMG.tracks, type: 'Digital', sellerId: 'abhishek-singh-chouhan', sellerName: 'Abhishek Singh Chouhan', qty: 1, price: 499 }],
    amount: 499, status: 'Available', createdAt: '2026-07-15', hasDigital: true, hasPhysical: false,
  },
  {
    id: 'ord-2', orderId: 'IICA-SHOP-7758', buyerName: 'Reshma Patra', buyerEmail: 'reshma@example.com',
    items: [{ productId: 'folk-art-journal', title: 'Handcrafted Folk Art Journal', cover: IMG.journal, type: 'Physical', sellerId: 'meera-kulkarni', sellerName: 'Meera Kulkarni', qty: 1, price: 899, variantName: 'Cover: Indigo' }],
    amount: 959, status: 'Shipped', createdAt: '2026-07-18', hasDigital: false, hasPhysical: true,
    address: { name: 'Reshma Patra', phone: '9876543210', line: '12 Rang Bhavan', city: 'Bhubaneswar', state: 'Odisha', country: 'India', postal: '751001', instructions: '' },
    courier: 'BlueDart', tracking: 'BD1290042IN',
  },
]

export const seedRefunds: RefundReq[] = []

export const seedPayouts: Payout[] = [
  { id: 'po-1', amount: 12400, date: '2026-07-01', status: 'Paid', orders: 18 },
  { id: 'po-2', amount: 8600, date: '2026-07-15', status: 'Processing', orders: 11 },
  { id: 'po-3', amount: 5200, date: '2026-08-01', status: 'Scheduled', orders: 7 },
]
