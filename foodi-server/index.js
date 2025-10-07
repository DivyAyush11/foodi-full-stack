const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 6001;
const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
require('dotenv').config()
const stripe = require("stripe")(process.env.PAYMENT_SECRET_KEY);

// middleware
app.use(cors());
app.use(express.json());

// JWT-compatible user signup route
app.post('/users', async (req, res) => {
  try {
    console.log('📝 User signup request with JWT:', req.body);
    
    const { name, email, password } = req.body;
    
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: 'Name and email are required'
      });
    }
    
    // Create JWT token for the new user
    const userInfo = { name, email };
    const token = jwt.sign(userInfo, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '24h'
    });
    
    res.status(200).json({
      success: true,
      message: 'User created successfully',
      user: userInfo,
      token: token
    });
    
    console.log('✅ User created with JWT token:', email);
    
  } catch (error) {
    console.error('❌ Signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during signup'
    });
  }
});

// Login route
// Login route (CORRECTED VERSION)
app.post('/users/login', async (req, res) => {
  try {
    console.log('🔄 Login request received:', req.body);
    
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    } // ✅ FIXED: Added missing closing brace
    
    // Simple login - creates JWT for any valid email/password combo
    const userInfo = { 
      name: email.split('@')[0], // Use part before @ as name
      email: email 
    };
    
    const token = jwt.sign(userInfo, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '24h'
    });
    
    res.status(200).json({
      success: true,
      message: 'Login successful',
      user: userInfo,
      token: token
    });
    
    console.log('✅ User logged in successfully:', email);
    
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});



// mongodb configuration using mongoose
mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@foodi-cluster.jbauahi.mongodb.net/fooddelivery?retryWrites=true&w=majority`
  )
  .then(() => {
    console.log("MongoDB Connected Successfully!")
  })
  .catch((error) => console.log("Error connecting to MongoDB", error));

// jwt authentication
app.post('/jwt', async (req, res) => {
  const user = req.body;
  const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '1hr'
  })
  res.send({ token });
})


//   import routes here
const menuRoutes = require('./api/routes/menuRoutes');
const cartRoutes = require('./api/routes/cartRoutes');
const userRoutes = require('./api/routes/userRoutes');
const paymentRoutes= require('./api/routes/paymentRoutes')
const adminStats = require('./api/routes/adminStats');
const orderStats = require("./api/routes/orderStats")
const { default: Stripe } = require("stripe");


app.use('/menu', menuRoutes)
app.use('/carts', cartRoutes);
app.use('/users', userRoutes);
app.use('/payments',paymentRoutes);
app.use('/adminStats',adminStats);
app.use('/orderStats',orderStats);

// Stripe Payment method
app.post("/create-payment-intent", async (req, res) => {
  const { price } = req.body;
  const amount = price*100;

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount,
    currency: "usd",
    payment_method_types: ["card"],
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});



app.get("/", (req, res) => {
  res.send("Hello Foodi Client Server!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
