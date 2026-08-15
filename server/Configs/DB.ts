import mongoose from 'mongoose';

// Create a globally cached state tracking parameter for serverless lifecycles
let isConnected = false;

const connectDB = async () => {
    if (isConnected) {
        console.log('=> Using existing database connection pool instance.');
        return;
    }

    try {
        // Set up the listener ONCE globally if it hasn't been set up yet
        if (mongoose.connection.listeners('connected').length === 0) {
            mongoose.connection.on('connected', () => {
                console.log('MongoDB connected successfully');
            });
        }

        const db = await mongoose.connect(process.env.Mongodb_URI as string);
        
        // Track readiness explicitly
        isConnected = db.connections[0].readyState === 1;
        console.log('=> New serverless MongoDB connection pool established successfully.');
    } catch (error) {
        console.error('MongoDB connection error:', error);
    }
}

export default connectDB;