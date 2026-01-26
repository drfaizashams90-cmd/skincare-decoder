require('dotenv').config();
const express = require('express');
const multer = require('multer');
const Tesseract = require('tesseract.js');
const { Pool } = require('pg');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// File Upload Config (Temporary storage for OCR)
const upload = multer({ dest: 'uploads/' });

// Database Connection
const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'skincare_db',
    password: process.env.DB_PASSWORD || 'your_password_here', // CHANGE THIS
    port: 5000,
});

// Helper: Normalize strings for easier matching
const normalize = (str) => str.trim().toLowerCase();

// --- API 1: Analyze Text List ---
app.post('/api/analyze-text', async (req, res) => {
    const { ingredientsList } = req.body;
    if (!ingredientsList) return res.status(400).json({ error: "No ingredients provided" });

    // Split string by commas, clean spaces
    const items = ingredientsList.split(',').map(i => i.trim()).filter(i => i);
    
    const results = [];

    for (const item of items) {
        // Query looks for exact match OR matches inside the aliases array
        const query = `
            SELECT * FROM ingredients 
            WHERE LOWER(inci_name) = $1 
            OR $1 = ANY(aliases)
        `;
        
        try {
            const { rows } = await pool.query(query, [normalize(item)]);
            results.push({
                searched: item,
                found: rows.length > 0,
                data: rows[0] || null
            });
        } catch (err) {
            console.error(err);
            results.push({ searched: item, found: false, error: "DB Error" });
        }
    }

    res.json(results);
});

// --- API 2: OCR Image Processing ---
app.post('/api/analyze-image', upload.single('image'), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: "No image uploaded" });

    const imagePath = req.file.path;

    try {
        console.log("Processing OCR for:", req.file.originalname);
        
        const { data: { text } } = await Tesseract.recognize(imagePath, 'eng', {
            logger: m => console.log(m) // Optional: logs progress
        });

        // Cleanup OCR text: Remove newlines, weird symbols, replace with commas
        const cleanedText = text
            .replace(/\n/g, ', ') // New lines to commas
            .replace(/[|&;$%@"<>()+]/g, "") // Remove common OCR noise
            .replace(/\s+/g, ' ') // Collapse multiple spaces
            .trim();

        // Delete temp file
        fs.unlinkSync(imagePath);

        res.json({ extractedText: cleanedText });

    } catch (error) {
        console.error("OCR Error:", error);
        res.status(500).json({ error: 'Failed to process image' });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
