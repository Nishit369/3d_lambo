import express from 'express';
import * as dotenv from "dotenv";
import cors from 'cors';
import clipdropRoutes from './routes/clipdrop.routes.js';  

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));

// Routes
app.use('/api/v1/clipdrop', clipdropRoutes);

app.get("/", (req, res) => {
    res.status(200).json({ message: "Hello from ClipDrop Image Generator API" });
});
app.use('/temp-textures', express.static('/tmp/temp-textures'));

app.listen(8080, () => console.log("SERVER STARTED"));