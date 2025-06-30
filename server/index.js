import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { MongoClient } from 'mongodb';
import questionRoutes from './routes/questionRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });
console.log("Loaded MONGO_URI:", process.env.MONGO_URI);

const PORT = process.env.PORT || 5500;
const MONGO_URI = process.env.MONGO_URI;
const client = new MongoClient(MONGO_URI);

let db;

export function getDB() {
  if (!db) {
    throw new Error('Database not initialized yet.');
  }
  return db;
}

async function initializeServer() {
  try {
    await client.connect();
    db = client.db();

    const app = express();

    const corsOptions = {
      origin: "http://localhost:5173",
      exposedHeaders: ['Authorization']
    };

    app.use(express.json());
    app.use(cors(corsOptions));

   const usersRouter = (await import('./routes/userRoutes.js')).default;
   const commentsRouter = (await import('./routes/commentRoutes.js')).default;
   const likesRouter = (await import('./routes/postController.js')).default;
   const interactionsRouter = (await import('./routes/interactions.js')).default;
   const postsRouter = (await import('./routes/postRoutes.js')).default;

    app.use('/questions', questionRoutes);
    app.use('/api/users', usersRouter);
    app.use('/api/posts', postsRouter);
    app.use('/api/comments', commentsRouter);
    app.use('/api/interactions', interactionsRouter);

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });

  } catch (err) {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
  }
}

initializeServer();