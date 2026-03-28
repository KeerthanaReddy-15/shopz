import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { MongoMemoryServer } from 'mongodb-memory-server';
import users from './data/users.js';
import products from './data/products.js';
import User from './models/userModel.js';
import Product from './models/productModel.js';
import Order from './models/orderModel.js';

dotenv.config();

let mongoServer;

const connectDB = async () => {
  try {
    let mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      console.log('No MONGO_URI provided in .env, using in-memory MongoDB...');
      mongoServer = await MongoMemoryServer.create();
      mongoUri = mongoServer.getUri();
    }
    await mongoose.connect(mongoUri, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    console.log(`MongoDB Connected: ${mongoose.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const importData = async () => {
    try {
        await connectDB();
        
        await Order.deleteMany();
        await Product.deleteMany();
        await User.deleteMany();

        const createdUsers = await User.insertMany(users);
        const adminUser = createdUsers[0]._id;

        const sampleProducts = products.map((p) => {
            return { ...p, user: adminUser };
        });

        await Product.insertMany(sampleProducts);

        console.log('Data Imported!');
        // We do not exit process here if we are using in-memory server
        // BUT wait, if we use in-memory server, seeding and then exiting will lose the data
        // because the server shuts down.
        // So for this project, I will actually seed data inline in server.js instead, 
        // to handle the memory DB case seamlessly.
        
        // Exiting would destroy memory db
        if (process.env.MONGO_URI) {
            process.exit();
        } else {
            console.log('Running with memory DB. Seed complete.');
        }

    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

importData();
