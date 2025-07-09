import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
let client;
let clientPromise;

if (!clientPromise) {
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export async function saveFullText(url, fullText) {
  try {
    const client = await clientPromise;
    const db = client.db('blog_summarizer');
    await db.collection('full_texts').insertOne({ url, fullText, createdAt: new Date() });
  } catch (error) {
    throw new Error(`MongoDB error: ${error.message}`);
  }
}