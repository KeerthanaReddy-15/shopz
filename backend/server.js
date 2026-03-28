import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import { MongoMemoryServer } from 'mongodb-memory-server';

import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

import users from './data/users.js';
import products from './data/products.js';
import User from './models/userModel.js';
import Product from './models/productModel.js';
import Order from './models/orderModel.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);

app.put('/api/users/profile/test', (req, res) => res.json({ msg: 'put ok' }));

app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    const mongoUri = process.env.MONGO_URI;

console.log("MONGO_URI: - server.js:41", mongoUri);

    await mongoose.connect(mongoUri);
    console.log(`MongoDB Connected: ${mongoose.connection.host} - server.js:44`);

    // Auto seed on startup to ensure data is always present in compass
    const userCount = await User.countDocuments();
    if(userCount === 0) {
      console.log('Seeding data into MongoDB local storage... - server.js:49');
      await Order.deleteMany();
      await Product.deleteMany();
      await User.deleteMany();

      const createdUsers = await User.insertMany(users);
      const adminUser = createdUsers[0]._id;

      const sampleProducts = products.map((p) => ({ ...p, user: adminUser }));
      await Product.insertMany(sampleProducts);
      console.log('Local DB Seeded successfully! - server.js:59');
    } else {
      console.log('Data exists in DB. Skipping autoseed. - server.js:61');
    }

    app.listen(PORT, () => console.log(`Server running on port ${PORT} - server.js:64`));
  } catch (error) {
    console.error(`Error: ${error.message} - server.js:66`);
    process.exit(1);
  }
};

connectDB();
