import express from 'express';
import * as dotenv from "dotenv";
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import clipdropRoutes from './routes/clipdrop.routes.js';

dotenv.config();

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));

// Mount the API routes
app.use('/api/v1/clipdrop', clipdropRoutes);

// Serve static files from the temp-textures directory
app.use('/temp-textures', express.static(path.join(__dirname, 'temp-textures')));

app.get("/", (req, res) => {
    res.status(200).json({ message: "Hello from ClipDrop Image Generator API" });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));