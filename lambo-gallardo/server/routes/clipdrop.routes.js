// clipdropRoutes.js
import express from "express";
import * as dotenv from "dotenv";
import axios from "axios";
import session from "express-session";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

const router = express.Router();

const TEMP_DIR = "/tmp/temp-textures";

// Ensure temp-textures dir exists
if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR);
}

// Use express-session (add this in main server file too if global)
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
  const storedFiles = req.session.imagePaths || [];
  res.status(200).json({ message: "Session images", files: storedFiles });
});

// POST route - generate + store temp image file
router.route("/").post(async (req, res) => {
  const { prompt } = req.body;

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

    fs.writeFileSync(filepath, imgBuffer); // Save to disk

    // Store path in session
    req.session.imagePaths = req.session.imagePaths || [];
    req.session.imagePaths.push(filepath);

    res.status(200).json({
      message: "Image saved temporarily on server",
      file: filepath,
    });
  } catch (error) {
    console.error("ClipDrop error:", error.message);
    res.status(500).json({ message: "ClipDrop failed" });
  }
});
export default router;