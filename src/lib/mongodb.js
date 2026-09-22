import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const options = {
  connectTimeoutMS: 10000,
};

let client;
let clientPromise;

if (!uri) {
  // We won't throw immediately here during builds where variables might not be set,
  // but we will warn or throw if we actually try to connect.
  console.warn('Warning: MONGODB_URI is not set in environment variables.');
} else {
  if (process.env.NODE_ENV === 'development') {
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri, options);
      global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
  } else {
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
  }
}

export async function connectToDatabase() {
  if (!uri) {
    throw new Error('Please add your MONGODB_URI connection string to .env.local');
  }
  const connectedClient = await clientPromise;
  const dbName = new URL(uri).pathname.substring(1) || 'anvitha';
  const db = connectedClient.db(dbName);
  return { client: connectedClient, db };
}

export default clientPromise;
