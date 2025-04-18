import express from "express";
import * as dotenv from "dotenv";
import axios from "axios";
import session from "express-session";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { fileURLToPath } from 'url';

dotenv.config();

const router = express.Router();

// Ensure cross-platform __dirname support with ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the temp directory path relative to this file
const TEMP_DIR = path.join(__dirname, "..", "temp-textures");

// Create the folder if it doesn't exist
if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

// Use express-session
router.use(
  session({
    secret: "whostoputthisterriblebeastieoffthehunteh",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60 * 60 * 1000 }, // 1 hour
  })
);

// GET route - return list of temp textures for this session
router.route("/").get((req, res) => {
  try {
    const files = fs.readdirSync(TEMP_DIR);
    const filePaths = files.map(file => `/temp-textures/${file}`);
    res.status(200).json({ message: "Texture files", files: filePaths });
  } catch (error) {
    console.error("Error reading texture directory:", error);
    res.status(500).json({ message: "Failed to read textures directory" });
  }
});

// POST route - generate + store temp image file
router.route("/").post(async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ message: "Prompt is required" });
  }

  try {
    const response = await axios.post(
      "https://clipdrop-api.co/text-to-image/v1",
      { prompt },
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.CLIPDROP_API_KEY,
        },
        responseType: "arraybuffer",
      }
    );

    const imgBuffer = Buffer.from(response.data, "binary");

    const filename = `texture_${uuidv4()}.png`;
    const filepath = path.join(TEMP_DIR, filename);

    fs.writeFileSync(filepath, imgBuffer);

    const relativePath = `/temp-textures/${filename}`;
    res.status(200).json({
      message: "Image saved successfully",
      file: relativePath,
    });
  } catch (error) {
    console.error("ClipDrop error:", error.message);
    res.status(500).json({ message: "ClipDrop API request failed", error: error.message });
  }
});

export default router;