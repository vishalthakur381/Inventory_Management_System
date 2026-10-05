import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

const client = axios.create({
  baseURL: API_BASE,
  timeout: 2500,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to requests if present
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('inventory_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Initial seed categories
const INITIAL_CATEGORIES = [
  { _id: 'cat-1', name: 'Electrical & Power Equipment', description: 'Inverters, industrial cables, switchgear, and backup batteries', productCount: 3 },
  { _id: 'cat-2', name: 'Industrial Safety & Workwear', description: 'ISI safety shoes, reflective jackets, helmets, and Kevlar gloves', productCount: 2 },
  { _id: 'cat-3', name: 'Packaging Materials & Cartons', description: '3-ply/5-ply corrugated boxes, thermal shipping labels, and BOPP tape', productCount: 2 },
  { _id: 'cat-4', name: 'Office Infrastructure & Logistics IT', description: 'Ergonomic chairs, barcode scanners, thermal receipt printers, and desk mounts', productCount: 1 },
];

// Initial supplier records
const INITIAL_SUPPLIERS = [
  {
    _id: 'sup-1',
    name: 'Bharat Electricals & Logistics Ltd',
    contactPerson: 'Rajesh Sharma',
    email: 'r.sharma@bharatelectricals.in',
    phone: '+91 98112 45678',
    address: 'Plot 42, Okhla Industrial Area Phase-III, New Delhi, Delhi 110020',
    gstin: '07AAACB2211D1Z8',
    productCount: 4,
  },
  {
    _id: 'sup-2',
    name: 'Western Hub Logistics & Industrial Co.',
    contactPerson: 'Priya Patel',
    email: 'priya.p@westernhublogistics.com',
    phone: '+91 98201 87654',
    address: 'Survey No. 88, Bhiwandi Warehousing Hub, Thane, Maharashtra 421302',
    gstin: '27AABCT3901B1ZU',
    productCount: 2,
  },
  {
    _id: 'sup-3',
    name: 'Deccan Cargo & Packaging Solutions',
    contactPerson: 'Venkatesh Rao',
    email: 'venkat@deccanpackaging.in',
    phone: '+91 94480 34567',
    address: 'Sector 4, Peenya Industrial Area, Bengaluru, Karnataka 560058',
    gstin: '29AAACD4567M1ZX',
    productCount: 2,
  },
];

// Initial product inventory items
const INITIAL_PRODUCTS = [
  {
    _id: 'prod-1',
    productId: 'SKU-DEL-1021',
    productName: 'Luminous EcoVolt Pure Sine Wave Inverter 1050VA',
    category: { _id: 'cat-1', name: 'Electrical & Power Equipment' },
    supplier: { _id: 'sup-1', name: 'Bharat Electricals & Logistics Ltd' },
    price: 7499,
    quantity: 36,
    stockStatus: 'in-stock',
    createdAt: new Date(Date.now() - 3600000 * 24 * 3).toISOString(),
  },
  {
    _id: 'prod-2',
    productId: 'SKU-DEL-1022',
    productName: 'Havells 2.5 sq mm Industrial Copper Wiring (90m Roll)',
    category: { _id: 'cat-1', name: 'Electrical & Power Equipment' },
    supplier: { _id: 'sup-1', name: 'Bharat Electricals & Logistics Ltd' },
    price: 2150,
    quantity: 8,
    stockStatus: 'low-stock',
    createdAt: new Date(Date.now() - 3600000 * 24 * 5).toISOString(),
  },
  {
    _id: 'prod-3',
    productId: 'SKU-DEL-1023',
    productName: 'Honeywell 2D Handheld Industrial Barcode & QR Scanner',
    category: { _id: 'cat-1', name: 'Electrical & Power Equipment' },
    supplier: { _id: 'sup-1', name: 'Bharat Electricals & Logistics Ltd' },
    price: 3850,
    quantity: 0,
    stockStatus: 'out-of-stock',
    createdAt: new Date(Date.now() - 3600000 * 24 * 7).toISOString(),
  },
  {
    _id: 'prod-4',
    productId: 'SKU-BHW-2041',
    productName: 'Karam ISI-Marked Steel Toe Armor Safety Shoes (Size 9)',
    category: { _id: 'cat-2', name: 'Industrial Safety & Workwear' },
    supplier: { _id: 'sup-2', name: 'Western Hub Logistics & Industrial Co.' },
    price: 1450,
    quantity: 42,
    stockStatus: 'in-stock',
    createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
  },
  {
    _id: 'prod-5',
    productId: 'SKU-BHW-2042',
    productName: '3M Reflexive High-Visibility Fluorescent Safety Vest',
    category: { _id: 'cat-2', name: 'Industrial Safety & Workwear' },
    supplier: { _id: 'sup-2', name: 'Western Hub Logistics & Industrial Co.' },
    price: 320,
    quantity: 5,
    stockStatus: 'low-stock',
    createdAt: new Date(Date.now() - 3600000 * 24 * 4).toISOString(),
  },
  {
    _id: 'prod-6',
    productId: 'SKU-BLR-3011',
    productName: 'Self-Adhesive Direct Thermal Shipping Labels 4x6 (Roll of 1000)',
    category: { _id: 'cat-3', name: 'Packaging Materials & Cartons' },
    supplier: { _id: 'sup-3', name: 'Deccan Cargo & Packaging Solutions' },
    price: 380,
    quantity: 140,
    stockStatus: 'in-stock',
    createdAt: new Date(Date.now() - 3600000 * 24 * 1).toISOString(),
  },
  {
    _id: 'prod-7',
    productId: 'SKU-BLR-3012',
    productName: '5-Ply Heavy Duty Corrugated Dispatch Carton Box (Pack of 50)',
    category: { _id: 'cat-3', name: 'Packaging Materials & Cartons' },
    supplier: { _id: 'sup-3', name: 'Deccan Cargo & Packaging Solutions' },
    price: 950,
    quantity: 0,
    stockStatus: 'out-of-stock',
    createdAt: new Date(Date.now() - 3600000 * 24 * 9).toISOString(),
  },
  {
    _id: 'prod-8',
    productId: 'SKU-BLR-4001',
    productName: 'Godrej Interio High-Back Ergonomic Lumbar Mesh Chair',
    category: { _id: 'cat-4', name: 'Office Infrastructure & Logistics IT' },
    supplier: { _id: 'sup-1', name: 'Bharat Electricals & Logistics Ltd' },
    price: 8990,
    quantity: 7,
    stockStatus: 'low-stock',
    createdAt: new Date(Date.now() - 3600000 * 24 * 6).toISOString(),
  },
];

// Initial Indian Stock Audit Log
const INITIAL_TRANSACTIONS = [
  {
    id: 'tx-101',
    productId: 'SKU-DEL-1021',
    productName: 'Luminous EcoVolt Pure Sine Wave Inverter 1050VA',
    type: 'restock',
    change: +15,
    previousQty: 21,
    newQty: 36,
    performedBy: 'Rajesh Sharma (Depot Incharge)',
    notes: 'Inbound consignment received against PO #IND-9023 from Okhla depot',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: 'tx-102',
    productId: 'SKU-BHW-2042',
    productName: '3M Reflexive High-Visibility Fluorescent Safety Vest',
    type: 'adjustment',
    change: -8,
    previousQty: 13,
    newQty: 5,
    performedBy: 'Amit Verma (Shift Supervisor)',
    notes: 'Outbound dispatch for Bhiwandi night shift warehouse crew',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
  {
    id: 'tx-103',
    productId: 'SKU-BLR-3011',
    productName: 'Self-Adhesive Direct Thermal Shipping Labels 4x6 (Roll of 1000)',
    type: 'restock',
    change: +50,
    previousQty: 90,
    newQty: 140,
    performedBy: 'Priya Patel (Operations Head)',
    notes: 'Bulk restocking delivered from Peenya packaging facility',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
  },
  {
    id: 'tx-104',
    productId: 'SKU-DEL-1023',
    productName: 'Honeywell 2D Handheld Industrial Barcode & QR Scanner',
    type: 'adjustment',
    change: -4,
    previousQty: 4,
    newQty: 0,
    performedBy: 'Amit Verma (Shift Supervisor)',
    notes: 'Transferred units to North Zone logistics sorting hub (Stockout reached)',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
];

// Initial warehouse staff members
const INITIAL_STAFF = [
  {
    _id: 'usr-staff-1',
    name: 'Amit Verma',
    email: 'amit.verma@bharatstock.in',
    role: 'staff',
    designation: 'Floor Inventory Supervisor',
    warehouseLocation: 'Bhiwandi Warehousing Hub, Mumbai',
    phone: '+91 98201 11223',
    permissions: 'Read-Only (Catalog & Audits)',
    status: 'Active',
    createdAt: new Date(Date.now() - 3600000 * 24 * 14).toISOString(),
  },
  {
    _id: 'usr-staff-2',
    name: 'Sunita Rao',
    email: 'sunita.rao@bharatstock.in',
    role: 'staff',
    designation: 'Inbound Logistics Assistant',
    warehouseLocation: 'Peenya Logistics Complex, Bengaluru',
    phone: '+91 94480 55667',
    permissions: 'Read-Only (Catalog & Audits)',
    status: 'Active',
    createdAt: new Date(Date.now() - 3600000 * 24 * 6).toISOString(),
  },
  {
    _id: 'usr-staff-3',
    name: 'Vikas Sharma',
    email: 'vikas.sharma@bharatstock.in',
    role: 'staff',
    designation: 'Outbound Dispatch Checker',
    warehouseLocation: 'Okhla Central Hub, Delhi NCR',
    phone: '+91 98112 99887',
    permissions: 'Read-Only (Catalog & Audits)',
    status: 'Active',
    createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
  },
];

// Helper to initialize and retrieve local store
const getLocalStore = () => {
  const existingProds = localStorage.getItem('inv_products');
  if (!existingProds || existingProds.includes('PRD-8941') || existingProds.includes('PRD-8942')) {
    localStorage.setItem('inv_categories', JSON.stringify(INITIAL_CATEGORIES));
    localStorage.setItem('inv_suppliers', JSON.stringify(INITIAL_SUPPLIERS));
    localStorage.setItem('inv_products', JSON.stringify(INITIAL_PRODUCTS));
    localStorage.setItem('inv_transactions', JSON.stringify(INITIAL_TRANSACTIONS));
    localStorage.setItem('inv_staff', JSON.stringify(INITIAL_STAFF));
  }

  if (!localStorage.getItem('inv_staff')) {
    localStorage.setItem('inv_staff', JSON.stringify(INITIAL_STAFF));
  }

  return {
    categories: JSON.parse(localStorage.getItem('inv_categories') || '[]'),
    suppliers: JSON.parse(localStorage.getItem('inv_suppliers') || '[]'),
    products: JSON.parse(localStorage.getItem('inv_products') || '[]'),
    transactions: JSON.parse(localStorage.getItem('inv_transactions') || '[]'),
    staff: JSON.parse(localStorage.getItem('inv_staff') || '[]'),
  };
};

const saveLocalStore = (data) => {
  if (data.categories) localStorage.setItem('inv_categories', JSON.stringify(data.categories));
  if (data.suppliers) localStorage.setItem('inv_suppliers', JSON.stringify(data.suppliers));
  if (data.products) localStorage.setItem('inv_products', JSON.stringify(data.products));
  if (data.transactions) localStorage.setItem('inv_transactions', JSON.stringify(data.transactions));
  if (data.staff) localStorage.setItem('inv_staff', JSON.stringify(data.staff));
};

const logTransaction = (entry) => {
  const store = getLocalStore();
  const tx = {
    id: 'tx-' + Date.now(),
    timestamp: new Date().toISOString(),
    ...entry,
  };
  store.transactions.unshift(tx);
  if (store.transactions.length > 100) store.transactions.pop();
  saveLocalStore({ transactions: store.transactions });
  return tx;
};

const calcStockStatus = (qty) => {
  const q = Number(qty) || 0;
  if (q === 0) return 'out-of-stock';
  if (q <= 10) return 'low-stock';
  return 'in-stock';
};

export const api = {
  // Check backend server & mongo health
  async checkHealth() {
    try {
      const res = await axios.get('http://localhost:5000/', { timeout: 1500 });
      return {
        online: true,
        database: res.data.database === 'Connected' ? 'Connected' : 'Standalone Storage Active',
      };
    } catch {
      return { online: false, database: 'Standalone Storage Active' };
    }
  },

  // Auth Endpoints
  async login(identifier, password) {
    try {
      const res = await client.post('/auth/login', { email: identifier, password });
      if (res.data?.success) return res.data;
    } catch (err) {
      // If server explicitly returned 400 or 401, credentials are invalid
      if (err.response && (err.response.status === 400 || err.response.status === 401)) {
        return {
          success: false,
          message: err.response.data?.message || 'Invalid email or password',
        };
      }
      // Otherwise server might be offline, fallback to standalone validation
    }

    // Standalone / Offline Validation
    const cleanId = (identifier || '').trim().toLowerCase();
    
    // Check locally registered users first
    try {
      const registered = JSON.parse(localStorage.getItem('inv_registered_users') || '[]');
      const found = registered.find((u) => u.email.toLowerCase() === cleanId || u.phone === cleanId);
      if (found) {
        if (found.password === password) {
          const userData = {
            _id: found._id,
            name: found.name,
            email: found.email,
            role: found.role || 'staff',
            token: 'jwt-auth-token-' + found._id,
          };
          return { success: true, data: userData };
        } else {
          return { success: false, message: 'Incorrect password for registered account.' };
        }
      }
    } catch {
      // pass
    }

    // Verified standard accounts:
    // 1. Admin: admin@bharatstock.in / password123
    // 2. Staff: staff@bharatstock.in / amit.verma@bharatstock.in / password123
    const isAdminAccount = cleanId === 'admin@bharatstock.in' || cleanId === 'admin' || cleanId === '9876543210';
    const isStaffAccount = cleanId === 'staff@bharatstock.in' || cleanId === 'staff' || cleanId === 'amit.verma@bharatstock.in';

    if (isAdminAccount || isStaffAccount) {
      if (password !== 'password123') {
        return { success: false, message: 'Invalid credentials. Please verify your password.' };
      }
      const userData = {
        _id: isAdminAccount ? 'usr-admin-101' : 'usr-staff-102',
        name: isAdminAccount ? 'Rajesh Sharma (Owner)' : 'Amit Verma (Floor Staff)',
        email: isAdminAccount ? 'admin@bharatstock.in' : 'amit.verma@bharatstock.in',
        role: isAdminAccount ? 'admin' : 'staff',
        token: 'jwt-auth-token-bharatstock-2026',
      };
      return { success: true, data: userData };
    }

    // Any other custom credentials require a non-empty password of >= 6 chars
    if (password && password.length >= 6) {
      const isOwner = cleanId.includes('owner') || cleanId.includes('admin');
      const customUser = {
        _id: 'usr-' + Date.now(),
        name: cleanId.split('@')[0].replace('.', ' ').toUpperCase(),
        email: cleanId.includes('@') ? cleanId : `${cleanId}@bharatstock.in`,
        role: isOwner ? 'admin' : 'staff',
        token: 'jwt-auth-token-bharatstock-2026',
      };
      return { success: true, data: customUser };
    }

    return { success: false, message: 'Invalid credentials. Please verify your email and password.' };
  },

  async register(name, email, password, role) {
    try {
      const res = await client.post('/auth/register', { name, email, password, role });
      if (res.data?.success) return res.data;
    } catch (err) {
      if (err.response && err.response.data?.message) {
        return { success: false, message: err.response.data.message };
      }
      // Offline fallback
    }

    const assignedRole = role || (email.toLowerCase().includes('admin') ? 'admin' : 'staff');
    const newUser = {
      _id: 'usr-' + Date.now(),
      name,
      email,
      password, // stored locally for offline mode login match
      role: assignedRole,
      token: 'jwt-auth-token-' + Date.now(),
    };

    try {
      const registered = JSON.parse(localStorage.getItem('inv_registered_users') || '[]');
      registered.push(newUser);
      localStorage.setItem('inv_registered_users', JSON.stringify(registered));
    } catch {
      // pass
    }

    return {
      success: true,
      data: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        token: newUser.token,
      },
    };
  },

  // Dashboard Stats
  async getDashboardStats() {
    try {
      const res = await client.get('/dashboard/stats');
      if (res.data?.success) return res.data.data;
    } catch {
      // Fallback
    }

    const { products, categories, suppliers, transactions } = getLocalStore();
    const inStockCount = products.filter((p) => p.stockStatus === 'in-stock').length;
    const lowStockCount = products.filter((p) => p.stockStatus === 'low-stock').length;
    const outOfStockCount = products.filter((p) => p.stockStatus === 'out-of-stock').length;

    const totalInventoryValue = products.reduce((acc, p) => acc + (p.price || 0) * (p.quantity || 0), 0);
    const totalUnits = products.reduce((acc, p) => acc + (p.quantity || 0), 0);

    const categoryStats = categories.map((c) => ({
      name: c.name,
      count: products.filter((p) => (p.category?._id || p.category) === c._id).length,
    }));

    const lowStockAlerts = products
      .filter((p) => p.stockStatus !== 'in-stock')
      .slice(0, 6);

    return {
      kpis: {
        totalProducts: products.length,
        totalCategories: categories.length,
        totalSuppliers: suppliers.length,
        totalInventoryValue: Number(totalInventoryValue.toFixed(2)),
        totalUnits,
        inStockCount,
        lowStockCount,
        outOfStockCount,
      },
      lowStockAlerts,
      categoryStats,
      recentTransactions: transactions.slice(0, 5),
    };
  },

  // Products
  async getProducts(params = {}) {
    try {
      const res = await client.get('/products', { params });
      if (res.data?.success && res.data.data.length > 0) return res.data;
    } catch {
      // Fallback
    }

    const { products } = getLocalStore();
    let filtered = [...products];

    if (params.search) {
      const s = params.search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.productName.toLowerCase().includes(s) ||
          (p.productId && p.productId.toLowerCase().includes(s))
      );
    }

    if (params.category) {
      filtered = filtered.filter((p) => (p.category?._id || p.category) === params.category);
    }

    if (params.supplier) {
      filtered = filtered.filter((p) => (p.supplier?._id || p.supplier) === params.supplier);
    }

    if (params.stockStatus && params.stockStatus !== 'all') {
      filtered = filtered.filter((p) => p.stockStatus === params.stockStatus);
    }

    return {
      success: true,
      data: filtered,
      total: filtered.length,
      count: filtered.length,
    };
  },

  async createProduct(data, actor = 'Operations Incharge') {
    try {
      const res = await client.post('/products', data);
      if (res.data?.success) return res.data.data;
    } catch {
      // Fallback
    }

    const store = getLocalStore();
    const cat = store.categories.find((c) => c._id === data.category) || { _id: data.category, name: 'Electrical & Power Equipment' };
    const sup = store.suppliers.find((s) => s._id === data.supplier) || { _id: data.supplier, name: 'Bharat Electricals Ltd' };

    const initialQty = Number(data.quantity) || 0;
    const newProd = {
      _id: 'prod-' + Date.now(),
      productId: 'SKU-IND-' + Math.floor(1000 + Math.random() * 9000),
      productName: data.productName,
      category: cat,
      supplier: sup,
      price: Number(data.price),
      quantity: initialQty,
      stockStatus: calcStockStatus(initialQty),
      createdAt: new Date().toISOString(),
    };

    store.products.unshift(newProd);
    saveLocalStore({ products: store.products });

    logTransaction({
      productId: newProd.productId,
      productName: newProd.productName,
      type: 'creation',
      change: +initialQty,
      previousQty: 0,
      newQty: initialQty,
      performedBy: actor,
      notes: `Catalogued new SKU: ${newProd.productName}`,
    });

    return newProd;
  },

  async updateProduct(id, data, actor = 'Operations Incharge') {
    try {
      const res = await client.put(`/products/${id}`, data);
      if (res.data?.success) return res.data.data;
    } catch {
      // Fallback
    }

    const store = getLocalStore();
    const idx = store.products.findIndex((p) => p._id === id);
    if (idx !== -1) {
      const oldProd = store.products[idx];
      const cat = store.categories.find((c) => c._id === data.category) || oldProd.category;
      const sup = store.suppliers.find((s) => s._id === data.supplier) || oldProd.supplier;
      const qty = data.quantity !== undefined ? Number(data.quantity) : oldProd.quantity;

      store.products[idx] = {
        ...oldProd,
        ...data,
        category: cat,
        supplier: sup,
        quantity: qty,
        stockStatus: calcStockStatus(qty),
      };
      saveLocalStore({ products: store.products });

      if (qty !== oldProd.quantity) {
        logTransaction({
          productId: oldProd.productId,
          productName: oldProd.productName,
          type: 'adjustment',
          change: qty - oldProd.quantity,
          previousQty: oldProd.quantity,
          newQty: qty,
          performedBy: actor,
          notes: 'Updated inventory record specifications & count',
        });
      }

      return store.products[idx];
    }
  },

  async adjustStock(id, change, actor = 'Operations Incharge') {
    try {
      const res = await client.patch(`/products/${id}/stock`, { change });
      if (res.data?.success) return res.data.data;
    } catch {
      // Fallback
    }

    const store = getLocalStore();
    const prod = store.products.find((p) => p._id === id);
    if (prod) {
      const prev = prod.quantity;
      prod.quantity = Math.max(0, prod.quantity + change);
      prod.stockStatus = calcStockStatus(prod.quantity);
      saveLocalStore({ products: store.products });

      logTransaction({
        productId: prod.productId,
        productName: prod.productName,
        type: change > 0 ? 'restock' : 'adjustment',
        change,
        previousQty: prev,
        newQty: prod.quantity,
        performedBy: actor,
        notes: change > 0 ? `Stock intake consignment (+${change} units)` : `Dispatched outbound consignment (${change} units)`,
      });

      return prod;
    }
  },

  async deleteProduct(id, actor = 'Admin') {
    try {
      await client.delete(`/products/${id}`);
    } catch {
      // Fallback
    }

    const store = getLocalStore();
    const prod = store.products.find((p) => p._id === id);
    if (prod) {
      logTransaction({
        productId: prod.productId,
        productName: prod.productName,
        type: 'deletion',
        change: -prod.quantity,
        previousQty: prod.quantity,
        newQty: 0,
        performedBy: actor,
        notes: `Archived SKU record from warehouse catalog`,
      });
    }

    store.products = store.products.filter((p) => p._id !== id);
    saveLocalStore({ products: store.products });
    return true;
  },

  // Categories
  async getCategories() {
    try {
      const res = await client.get('/categories');
      if (res.data?.success && res.data.data.length > 0) return res.data.data;
    } catch {
      // Fallback
    }

    const store = getLocalStore();
    return store.categories.map((c) => ({
      ...c,
      productCount: store.products.filter((p) => (p.category?._id || p.category) === c._id).length,
    }));
  },

  async createCategory(data) {
    try {
      const res = await client.post('/categories', data);
      if (res.data?.success) return res.data.data;
    } catch {
      // Fallback
    }

    const store = getLocalStore();
    const newCat = {
      _id: 'cat-' + Date.now(),
      name: data.name,
      description: data.description || '',
      productCount: 0,
    };
    store.categories.push(newCat);
    saveLocalStore({ categories: store.categories });
    return newCat;
  },

  async updateCategory(id, data) {
    try {
      const res = await client.put(`/categories/${id}`, data);
      if (res.data?.success) return res.data.data;
    } catch {
      // Fallback
    }

    const store = getLocalStore();
    const idx = store.categories.findIndex((c) => c._id === id);
    if (idx !== -1) {
      store.categories[idx] = { ...store.categories[idx], ...data };
      saveLocalStore({ categories: store.categories });
      return store.categories[idx];
    }
  },

  async deleteCategory(id) {
    try {
      await client.delete(`/categories/${id}`);
    } catch {
      // Fallback
    }

    const store = getLocalStore();
    store.categories = store.categories.filter((c) => c._id !== id);
    saveLocalStore({ categories: store.categories });
    return true;
  },

  // Suppliers
  async getSuppliers() {
    try {
      const res = await client.get('/suppliers');
      if (res.data?.success && res.data.data.length > 0) return res.data.data;
    } catch {
      // Fallback
    }

    const store = getLocalStore();
    return store.suppliers.map((s) => ({
      ...s,
      productCount: store.products.filter((p) => (p.supplier?._id || p.supplier) === s._id).length,
    }));
  },

  async createSupplier(data) {
    try {
      const res = await client.post('/suppliers', data);
      if (res.data?.success) return res.data.data;
    } catch {
      // Fallback
    }

    const store = getLocalStore();
    const newSup = {
      _id: 'sup-' + Date.now(),
      name: data.name,
      contactPerson: data.contactPerson || '',
      email: data.email || '',
      phone: data.phone || '',
      address: data.address || '',
      gstin: data.gstin || '',
      productCount: 0,
    };
    store.suppliers.push(newSup);
    saveLocalStore({ suppliers: store.suppliers });
    return newSup;
  },

  async updateSupplier(id, data) {
    try {
      const res = await client.put(`/suppliers/${id}`, data);
      if (res.data?.success) return res.data.data;
    } catch {
      // Fallback
    }

    const store = getLocalStore();
    const idx = store.suppliers.findIndex((s) => s._id === id);
    if (idx !== -1) {
      store.suppliers[idx] = { ...store.suppliers[idx], ...data };
      saveLocalStore({ suppliers: store.suppliers });
      return store.suppliers[idx];
    }
  },

  async deleteSupplier(id) {
    try {
      await client.delete(`/suppliers/${id}`);
    } catch {
      // Fallback
    }

    const store = getLocalStore();
    store.suppliers = store.suppliers.filter((s) => s._id !== id);
    saveLocalStore({ suppliers: store.suppliers });
    return true;
  },

  // Stock Movement Records
  async getTransactions() {
    const store = getLocalStore();
    return store.transactions;
  },

  // Staff Management (Owner / Admin Only)
  async getStaffUsers() {
    try {
      const res = await client.get('/auth/users');
      if (res.data?.success && Array.isArray(res.data.data)) {
        // Return only users with role: 'staff'
        const backendStaff = res.data.data.filter((u) => u.role === 'staff');
        if (backendStaff.length > 0) return backendStaff;
      }
    } catch {
      // Fallback
    }

    const store = getLocalStore();
    return store.staff || [];
  },

  async createStaffUser(data) {
    try {
      const res = await client.post('/auth/staff', data);
      if (res.data?.success) {
        // Also persist to local store
        const store = getLocalStore();
        store.staff = [res.data.data, ...(store.staff || [])];
        saveLocalStore({ staff: store.staff });
        return res.data.data;
      }
    } catch {
      // Fallback
    }

    const store = getLocalStore();
    const newStaff = {
      _id: 'usr-staff-' + Date.now(),
      name: data.name,
      email: data.email,
      phone: data.phone || '+91 98000 00000',
      role: 'staff',
      designation: data.designation || 'Warehouse Operations Staff',
      warehouseLocation: data.warehouseLocation || 'Okhla Central Hub, Delhi NCR',
      permissions: 'Read-Only (Catalog & Audits)',
      status: 'Active',
      createdAt: new Date().toISOString(),
    };
    store.staff = [newStaff, ...(store.staff || [])];
    saveLocalStore({ staff: store.staff });
    return newStaff;
  },

  async deleteStaffUser(id) {
    try {
      await client.delete(`/auth/users/${id}`);
    } catch {
      // Fallback
    }

    const store = getLocalStore();
    store.staff = (store.staff || []).filter((s) => s._id !== id);
    saveLocalStore({ staff: store.staff });
    return true;
  },
};

export default api;
