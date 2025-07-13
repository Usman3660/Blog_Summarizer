import { MongoClient } from "mongodb"

const uri = process.env.MONGODB_URI

// Use an internal variable to store the promise
let _clientPromise: Promise<MongoClient> | null = null

/**
 * Returns a singleton MongoClient promise.
 * Initializes the client only if MONGODB_URI is set.
 *
 * @returns {Promise<MongoClient> | null} A promise that resolves to the MongoClient instance, or null if MONGODB_URI is not set.
 */
export function getMongoClientPromise(): Promise<MongoClient> | null {
  if (!uri) {
    console.warn("⚠️ MONGODB_URI environment variable is not set. MongoDB client will not be initialized.")
    return null
  }

  // Log the URI being used for connection
  console.log(
    `MongoDB: Attempting to connect with URI: ${uri.substring(0, uri.indexOf("@"))}***@${uri.substring(uri.indexOf("@") + 1)}`,
  ) // Mask password for security

  if (!_clientPromise) {
    const options = {}
    if (process.env.NODE_ENV === "development") {
      // In development mode, use a global variable to preserve the client across HMR reloads.
      const globalWithMongo = global as typeof globalThis & {
        _mongoClientPromise?: Promise<MongoClient>
      }
      if (!globalWithMongo._mongoClientPromise) {
        const client = new MongoClient(uri, options)
        globalWithMongo._mongoClientPromise = client.connect()
      }
      _clientPromise = globalWithMongo._mongoClientPromise
    } else {
      // In production, create a new client instance.
      const client = new MongoClient(uri, options)
      _clientPromise = client.connect()
    }
  }
  return _clientPromise
}
