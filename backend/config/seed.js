const User = require('../models/User');
const Category = require('../models/Category');
const Supplier = require('../models/Supplier');
const Product = require('../models/Product');

const seedData = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('Seeding initial users...');
      await User.create([
        {
          name: 'Rajesh Sharma (Owner)',
          email: 'admin@bharatstock.in',
          password: 'password123',
          role: 'admin',
        },
        {
          name: 'Amit Verma (Floor Staff)',
          email: 'staff@bharatstock.in',
          password: 'password123',
          role: 'staff',
        },
      ]);
    } else {
      // Ensure admin@bharatstock.in exists
      const bsAdmin = await User.findOne({ email: 'admin@bharatstock.in' });
      if (!bsAdmin) {
        await User.create({
          name: 'Rajesh Sharma (Owner)',
          email: 'admin@bharatstock.in',
          password: 'password123',
          role: 'admin',
        });
      }
      const bsStaff = await User.findOne({ email: 'staff@bharatstock.in' });
      if (!bsStaff) {
        await User.create({
          name: 'Amit Verma (Floor Staff)',
          email: 'staff@bharatstock.in',
          password: 'password123',
          role: 'staff',
        });
      }
    }

    const categoryCount = await Category.countDocuments();
    let catElectronics, catApparel, catOffice, catFood;
    if (categoryCount === 0) {
      console.log('Seeding categories...');
      [catElectronics, catApparel, catOffice, catFood] = await Category.create([
        { name: 'Electronics', description: 'Gadgets, devices, and computing peripherals' },
        { name: 'Office Supplies', description: 'Stationery, paper, desk organizers' },
        { name: 'Apparel & Safety', description: 'Workwear, safety boots, and high-vis vests' },
        { name: 'Packaging Materials', description: 'Boxes, bubble wrap, tape, and labels' },
      ]);
    } else {
      catElectronics = await Category.findOne({ name: 'Electronics' });
      catOffice = await Category.findOne({ name: 'Office Supplies' });
      catApparel = await Category.findOne({ name: 'Apparel & Safety' });
      catFood = await Category.findOne({ name: 'Packaging Materials' });
    }

    const supplierCount = await Supplier.countDocuments();
    let supNexus, supApex, supPrime;
    if (supplierCount === 0) {
      console.log('Seeding suppliers...');
      [supNexus, supApex, supPrime] = await Supplier.create([
        {
          name: 'Nexus Tech Global',
          contactPerson: 'Sarah Jenkins',
          email: 'sales@nexustech.com',
          phone: '+1 (555) 234-5678',
          address: '450 Innovation Parkway, Suite 100, San Jose, CA',
        },
        {
          name: 'Apex Industrial Logistics',
          contactPerson: 'Marcus Thorne',
          email: 'orders@apexlogistics.com',
          phone: '+1 (555) 876-5432',
          address: '12 Industrial Loop, Chicago, IL',
        },
        {
          name: 'Prime Goods Supply Co.',
          contactPerson: 'Elena Rodriguez',
          email: 'elena@primegoods.com',
          phone: '+1 (555) 345-6789',
          address: '88 Commerce Blvd, Dallas, TX',
        },
      ]);
    } else {
      supNexus = await Supplier.findOne({ name: 'Nexus Tech Global' });
      supApex = await Supplier.findOne({ name: 'Apex Industrial Logistics' });
      supPrime = await Supplier.findOne({ name: 'Prime Goods Supply Co.' });
    }

    const productCount = await Product.countDocuments();
    if (productCount === 0 && catElectronics && supNexus) {
      console.log('Seeding products...');
      await Product.create([
        {
          productName: 'Ergonomic Mechanical Keyboard',
          category: catElectronics._id,
          supplier: supNexus._id,
          price: 129.99,
          quantity: 45, // in-stock
        },
        {
          productName: 'Ultra-Clear 4K Monitor 27"',
          category: catElectronics._id,
          supplier: supNexus._id,
          price: 349.50,
          quantity: 8, // low-stock
        },
        {
          productName: 'Wireless Bluetooth Barcode Scanner',
          category: catElectronics._id,
          supplier: supNexus._id,
          price: 89.00,
          quantity: 0, // out-of-stock
        },
        {
          productName: 'Heavy-Duty Steel Safety Boots (Size 10)',
          category: catApparel ? catApparel._id : catElectronics._id,
          supplier: supApex ? supApex._id : supNexus._id,
          price: 94.99,
          quantity: 14, // in-stock
        },
        {
          productName: 'High-Visibility Reflex Work Vest',
          category: catApparel ? catApparel._id : catElectronics._id,
          supplier: supApex ? supApex._id : supNexus._id,
          price: 24.50,
          quantity: 4, // low-stock
        },
        {
          productName: 'Heavy Duty Thermal Shipping Labels (Pack 500)',
          category: catFood ? catFood._id : catElectronics._id,
          supplier: supPrime ? supPrime._id : supNexus._id,
          price: 18.75,
          quantity: 120, // in-stock
        },
        {
          productName: 'Biodegradable Packing Peanuts (50L)',
          category: catFood ? catFood._id : catElectronics._id,
          supplier: supPrime ? supPrime._id : supNexus._id,
          price: 32.00,
          quantity: 0, // out-of-stock
        },
      ]);
    }
  } catch (err) {
    console.error('Seed helper error:', err.message);
  }
};

module.exports = seedData;
