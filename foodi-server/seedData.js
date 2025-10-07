const mongoose = require('mongoose');
require('dotenv').config();

console.log('🚀 Starting direct MongoDB seed...');

// Define schema inline (no separate model file needed)
const menuSchema = new mongoose.Schema({
  name: String,
  price: Number,
  category: String,
  image: String,
  description: String
});

const Menu = mongoose.model('Menu', menuSchema);

const menuItems = [
  {
    name: "Spicy Noodles",
    price: 18.00,
    category: "noodles",
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop",
    description: "Delicious spicy noodles with fresh vegetables"
  },
  {
    name: "Greek Salad",
    price: 15.00,
    category: "salad",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=300&fit=crop",
    description: "Fresh Greek salad with feta cheese and olives"
  },
  {
    name: "Margherita Pizza",
    price: 22.00,
    category: "pizza",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop",
    description: "Classic Margherita pizza with mozzarella and basil"
  },
  {
    name: "Caesar Salad",
    price: 14.00,
    category: "salad",
    image: "https://images.unsplash.com/photo-1551248429-40975aa4de74?w=400&h=300&fit=crop",
    description: "Classic Caesar salad with romaine lettuce and croutons"
  },
  {
    name: "Pepperoni Pizza",
    price: 24.00,
    category: "pizza",
    image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&h=300&fit=crop",
    description: "Pepperoni pizza with mozzarella and spicy pepperoni"
  },
  {
    name: "Tomato Soup",
    price: 12.00,
    category: "soups",
    image: "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=400&h=300&fit=crop",
    description: "Creamy tomato soup with herbs"
  }
];

async function seedDatabase() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(
      `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@foodi-cluster.jbauahi.mongodb.net/fooddelivery?retryWrites=true&w=majority`
    );
    console.log('✅ Connected to MongoDB Atlas');
    
    console.log('🗑️ Clearing existing menu items...');
    await Menu.deleteMany({});
    
    console.log('📝 Adding new menu items...');
    const result = await Menu.insertMany(menuItems);
    
    console.log('🎉 SUCCESS! Database seeded!');
    console.log(`📊 Added ${result.length} menu items`);
    console.log('📋 Categories: noodles, salad, pizza, soups');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

seedDatabase();
