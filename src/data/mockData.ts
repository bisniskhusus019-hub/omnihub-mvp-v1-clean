export const mockUser = {
  id: 'user_001',
  name: 'Rangga Adhitya',
  username: 'rangga.ai',
  headline: 'Solopreneur • AI Product Builder • Digital Creator',
  bio: 'Building simple digital products, AI-powered business tools, and creator systems for modern solopreneurs.',
  avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
  cover: 'https://images.pexels.com/photos/1629212/pexels-photo-1629212.jpeg?auto=compress&cs=tinysrgb&w=1200',
  location: 'Jakarta, Indonesia',
  website: 'https://rangga.ai',
  email: 'rangga@omnihub.io',
};

export const mockSocials = [
  { id: 's1', platform: 'Twitter/X', handle: '@rangga_ai', url: '#', icon: 'twitter' },
  { id: 's2', platform: 'LinkedIn', handle: 'ranggaadhitya', url: '#', icon: 'linkedin' },
  { id: 's3', platform: 'Instagram', handle: '@rangga.ai', url: '#', icon: 'instagram' },
  { id: 's4', platform: 'YouTube', handle: 'RanggaAI', url: '#', icon: 'youtube' },
];

export const mockLinks = [
  { id: 'l1', label: 'My AI Starter Kit — Free Download', url: '#', icon: 'download' },
  { id: 'l2', label: 'Book a 1-on-1 Strategy Call', url: '#', icon: 'calendar' },
  { id: 'l3', label: 'Join My Telegram Community', url: '#', icon: 'message-circle' },
  { id: 'l4', label: 'Watch My Free AI Business Masterclass', url: '#', icon: 'play' },
];

export const mockProducts = [
  {
    id: 'prod_001',
    title: 'AI Business Blueprint 2026',
    description: 'Complete step-by-step guide to launching an AI-powered solopreneur business from zero to $5K/month.',
    price: 297000,
    priceUSD: 19,
    category: 'Digital Products',
    image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400',
    fileType: 'PDF + Templates',
    fileSize: '24.5 MB',
    seller: { id: 'user_001', name: 'Rangga Adhitya', username: 'rangga.ai', avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=80' },
    sales: 148,
    rating: 4.9,
  },
  {
    id: 'prod_002',
    title: 'Notion SaaS OS Pro',
    description: 'All-in-one Notion workspace template for managing your entire SaaS business — CRM, roadmap, finances.',
    price: 199000,
    priceUSD: 12,
    category: 'Digital Products',
    image: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=400',
    fileType: 'Notion Template',
    fileSize: '—',
    seller: { id: 'user_001', name: 'Rangga Adhitya', username: 'rangga.ai', avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=80' },
    sales: 312,
    rating: 4.8,
  },
  {
    id: 'prod_003',
    title: 'Cold Email Mastery Course',
    description: 'Learn how to write high-converting cold emails that land clients consistently. Includes 50+ templates.',
    price: 499000,
    priceUSD: 32,
    category: 'Services',
    image: 'https://images.pexels.com/photos/1591062/pexels-photo-1591062.jpeg?auto=compress&cs=tinysrgb&w=400',
    fileType: 'Video Course',
    fileSize: '2.1 GB',
    seller: { id: 'user_002', name: 'Sari Dewi', username: 'saridewi.pro', avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=80' },
    sales: 89,
    rating: 4.7,
  },
  {
    id: 'prod_004',
    title: 'Premium Leather Minimal Wallet',
    description: 'Handcrafted slim wallet made from genuine Italian leather. RFID blocking. Fits 8 cards.',
    price: 380000,
    priceUSD: 24,
    category: 'Physical Goods',
    image: 'https://images.pexels.com/photos/2079246/pexels-photo-2079246.jpeg?auto=compress&cs=tinysrgb&w=400',
    fileType: null,
    fileSize: null,
    seller: { id: 'user_003', name: 'Budi Santoso', username: 'craftbudi', avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=80' },
    sales: 203,
    rating: 4.6,
  },
  {
    id: 'prod_005',
    title: 'ChatGPT Prompt Engineering Vault',
    description: '500+ battle-tested ChatGPT prompts for business, marketing, copywriting, and productivity.',
    price: 149000,
    priceUSD: 9,
    category: 'Digital Products',
    image: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=400',
    fileType: 'PDF + Notion',
    fileSize: '8.2 MB',
    seller: { id: 'user_002', name: 'Sari Dewi', username: 'saridewi.pro', avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=80' },
    sales: 671,
    rating: 4.9,
  },
  {
    id: 'prod_006',
    title: 'Freelance Brand Identity Kit',
    description: 'Done-for-you brand identity system: logo variants, color palettes, typography, social media templates.',
    price: 350000,
    priceUSD: 22,
    category: 'Services',
    image: 'https://images.pexels.com/photos/196645/pexels-photo-196645.jpeg?auto=compress&cs=tinysrgb&w=400',
    fileType: 'Figma + PNG',
    fileSize: '156 MB',
    seller: { id: 'user_004', name: 'Maya Chen', username: 'mayadesigns', avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=80' },
    sales: 44,
    rating: 5.0,
  },
];

export const mockTransactions = [
  { id: 'txn_001', buyer: 'Ahmad Fariz', product: 'AI Business Blueprint 2026', amount: 297000, amountUSD: 19, status: 'completed', date: '2026-06-07', currency: 'IDR' },
  { id: 'txn_002', buyer: 'Putri Lestari', product: 'Notion SaaS OS Pro', amount: 199000, amountUSD: 12, status: 'completed', date: '2026-06-07', currency: 'IDR' },
  { id: 'txn_003', buyer: 'James Walker', product: 'AI Business Blueprint 2026', amount: 19, amountUSD: 19, status: 'pending', date: '2026-06-06', currency: 'USD' },
  { id: 'txn_004', buyer: 'Rizki Maulana', product: 'ChatGPT Prompt Engineering Vault', amount: 149000, amountUSD: 9, status: 'completed', date: '2026-06-06', currency: 'IDR' },
  { id: 'txn_005', buyer: 'Sarah Kim', product: 'Notion SaaS OS Pro', amount: 12, amountUSD: 12, status: 'refunded', date: '2026-06-05', currency: 'USD' },
  { id: 'txn_006', buyer: 'Dewi Ratna', product: 'AI Business Blueprint 2026', amount: 297000, amountUSD: 19, status: 'completed', date: '2026-06-05', currency: 'IDR' },
];

export const mockForumChannels = [
  { id: 'ch1', name: 'general-announcements', icon: 'megaphone', unread: 3 },
  { id: 'ch2', name: 'growth-hacking', icon: 'trending-up', unread: 7 },
  { id: 'ch3', name: 'freelance-gigs', icon: 'briefcase', unread: 0 },
  { id: 'ch4', name: 'digital-products', icon: 'package', unread: 12 },
];

export const mockForumPosts = [
  {
    id: 'post_001',
    channel: 'ch1',
    author: 'Rangga Adhitya',
    authorAvatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=80',
    title: 'OmniHub v1.0 is officially live — welcome to the future of solopreneurship',
    body: 'After 6 months of building, I am beyond excited to finally share OmniHub with you all. This platform is designed to replace 7+ tools for solopreneurs. Drop your questions below!',
    upvotes: 94,
    comments: 31,
    time: '2h ago',
  },
  {
    id: 'post_002',
    channel: 'ch2',
    author: 'Sari Dewi',
    authorAvatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=80',
    title: 'How I got 1,000 email subscribers in 30 days using only free tools',
    body: 'Thread time! I used a combination of Twitter/X, Reddit, and a simple lead magnet. Here is the exact system I used step by step, no paid ads required.',
    upvotes: 67,
    comments: 24,
    time: '5h ago',
  },
  {
    id: 'post_003',
    channel: 'ch3',
    author: 'Budi Santoso',
    authorAvatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=80',
    title: 'Looking for a React developer for a 2-week sprint project — $800 budget',
    body: 'Building a SaaS dashboard MVP. Need someone comfortable with React, Tailwind, and Supabase. Remote-friendly, async-first team. DM me if interested.',
    upvotes: 15,
    comments: 8,
    time: '1d ago',
  },
  {
    id: 'post_004',
    channel: 'ch4',
    author: 'Maya Chen',
    authorAvatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=80',
    title: 'My Gumroad vs OmniHub comparison after selling $10K in digital products',
    body: 'I have been selling on Gumroad for 2 years. After switching to OmniHub last month, here is what I noticed: lower fees, better checkout UX, and the built-in community is a game changer.',
    upvotes: 52,
    comments: 19,
    time: '2d ago',
  },
];

export const mockKanbanTasks = {
  todo: [
    { id: 'task_001', title: 'Validate new offer niche', priority: 'high', assignee: 'RA' },
    { id: 'task_002', title: 'Draft sales page copy', priority: 'medium', assignee: 'RA' },
    { id: 'task_003', title: 'Design email sequence', priority: 'low', assignee: 'SD' },
  ],
  inProgress: [
    { id: 'task_004', title: 'Setup Gumroad payout configuration', priority: 'high', assignee: 'RA' },
    { id: 'task_005', title: 'Record intro video for course', priority: 'medium', assignee: 'MC' },
  ],
  done: [
    { id: 'task_006', title: 'Generate database schemas', priority: 'high', assignee: 'RA' },
    { id: 'task_007', title: 'Setup Supabase project', priority: 'medium', assignee: 'RA' },
    { id: 'task_008', title: 'Design brand identity', priority: 'low', assignee: 'MC' },
  ],
};

export const mockStats = {
  totalRevenue: 4821000,
  totalRevenueUSD: 310,
  totalSales: 148,
  activeLinkClicks: 2340,
  conversionRate: 6.3,
};

export const mockInvoice = {
  number: '#INV-2026-001',
  dateIssued: '2026-06-07',
  dateDue: '2026-06-14',
  status: 'PAID',
  seller: {
    name: 'Rangga Adhitya',
    company: 'OmniHub Digital',
    address: 'Jl. Sudirman No. 100, Jakarta Selatan',
    email: 'rangga@omnihub.io',
    taxId: 'ID-TAX-20260001',
  },
  buyer: {
    name: 'Ahmad Fariz',
    company: 'Fariz Creative Studio',
    address: 'Jl. Gatot Subroto No. 45, Bandung',
    email: 'ahmad.fariz@email.com',
  },
  items: [
    { description: 'AI Business Blueprint 2026', qty: 1, unitPrice: 297000, total: 297000 },
    { description: 'Notion SaaS OS Pro', qty: 2, unitPrice: 199000, total: 398000 },
  ],
  subtotal: 695000,
  processingFee: 20850,
  grandTotal: 715850,
};

export const mockAIMessages = [
  { id: 'm1', role: 'assistant', text: 'Hi! I am your OmniHub AI Assistant. How can I help you today?' },
  { id: 'm2', role: 'user', text: 'How do I set up my digital product shop?' },
  { id: 'm3', role: 'assistant', text: 'Great question! To set up your shop, go to Dashboard > Add New Product. You can upload your digital file, set a price in IDR or USD, and configure your download delivery. Your product will be live instantly. Need help with pricing strategy?' },
];
