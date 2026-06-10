require('dotenv').config();
const pool = require('./config/db');

const premiumProducts = [
  {
    category_id: 1,
    name: 'Farm Fresh A2 Cow Milk',
    sku: 'MILK-A2-1L',
    description: '100% pure, unadulterated A2 cow milk sourced from grass-fed cows. Rich in protein and easily digestible.',
    unit: 'litre',
    consumer_price: 85.00,
    retailer_price: 75.00,
    wholesaler_price: 70.00,
    image_url: ''
  },
  {
    category_id: 2,
    name: 'Organic Grass-Fed Ghee',
    sku: 'GHEE-ORG-500',
    description: 'Traditional bilona churned ghee made from A2 milk. Rich aroma, granular texture, and packed with vitamins.',
    unit: 'kg',
    consumer_price: 950.00,
    retailer_price: 850.00,
    wholesaler_price: 800.00,
    image_url: ''
  },
  {
    category_id: 3,
    name: 'Artisanal Malai Paneer',
    sku: 'PAN-MAL-200',
    description: 'Ultra-soft, fresh cottage cheese made using traditional methods. Melts in the mouth.',
    unit: 'kg',
    consumer_price: 450.00,
    retailer_price: 380.00,
    wholesaler_price: 350.00,
    image_url: ''
  },
  {
    category_id: 4,
    name: 'Probiotic Greek Yogurt',
    sku: 'YOG-GRK-400',
    description: 'Thick, creamy, and protein-rich Greek yogurt with active probiotic cultures for gut health.',
    unit: 'kg',
    consumer_price: 300.00,
    retailer_price: 250.00,
    wholesaler_price: 220.00,
    image_url: ''
  },
  {
    category_id: 5,
    name: 'Cultured Unsalted Butter',
    sku: 'BTR-UNS-500',
    description: 'European-style cultured butter with a complex, tangy flavor. Perfect for baking and gourmet cooking.',
    unit: 'kg',
    consumer_price: 600.00,
    retailer_price: 520.00,
    wholesaler_price: 480.00,
    image_url: ''
  },
  {
    category_id: 6,
    name: 'Rich Double Cream',
    sku: 'CRM-DBL-250',
    description: 'Luxurious double cream with 48% fat content. Ideal for whipping and rich desserts.',
    unit: 'litre',
    consumer_price: 350.00,
    retailer_price: 300.00,
    wholesaler_price: 280.00,
    image_url: ''
  },
  {
    category_id: 7,
    name: 'French Vanilla Bean Ice Cream',
    sku: 'ICE-VAN-500',
    description: 'Crafted with real Madagascar vanilla beans and pure dairy cream. No artificial flavors.',
    unit: 'litre',
    consumer_price: 450.00,
    retailer_price: 380.00,
    wholesaler_price: 350.00,
    image_url: ''
  },
  {
    category_id: 8,
    name: 'Aged Farmhouse Cheddar',
    sku: 'CHS-CHD-200',
    description: 'Sharp, crumbly cheddar aged for 12 months in our temperature-controlled cellars.',
    unit: 'kg',
    consumer_price: 1200.00,
    retailer_price: 1050.00,
    wholesaler_price: 980.00,
    image_url: ''
  }
];

async function seed() {
  try {
    const adminRes = await pool.query("SELECT id FROM users WHERE role='admin' LIMIT 1");
    const adminId = adminRes.rows[0].id;

    for (const p of premiumProducts) {
      // Insert Product
      const { rows } = await pool.query(
        `INSERT INTO products 
         (category_id, name, sku, description, unit, consumer_price, retailer_price, wholesaler_price, image_url)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         RETURNING id`,
        [p.category_id, p.name, p.sku, p.description, p.unit, p.consumer_price, p.retailer_price, p.wholesaler_price, p.image_url]
      );
      const productId = rows[0].id;
      
      // Insert initial stock inventory so it's not out of stock
      // Give them 100 units of each product
      await pool.query(
        `INSERT INTO inventory (product_id, quantity, batch_no, location, updated_by)
         VALUES ($1, $2, $3, $4, $5)`,
        [productId, 100, 'BATCH-INI-' + productId, 'Main Warehouse', adminId]
      );
      console.log('Seeded: ' + p.name + ' with 100 ' + p.unit + ' stock');
    }
    console.log('Premium products seeded successfully!');
  } catch (err) {
    console.error('Seeding failed:', err);
  } finally {
    pool.end();
  }
}

seed();
