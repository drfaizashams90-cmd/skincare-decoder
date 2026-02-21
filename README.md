# Skincare Ingredient Decoder

A Next.js 14 web application that analyzes cosmetic product labels for safety, acne triggers, and EU regulatory compliance.

## Features

- **Text Input**: Paste comma-separated ingredient lists
- **OCR/Camera**: Upload product label images for automatic text extraction
- **Safety Analysis**: Ratings, irritability, and comedogenic scores
- **EU Compliance**: Regulatory status and restrictions
- 📸 **OCR / Camera Input**  
  Upload photos of a product’s ingredient label and automatically extract text using Tesseract OCR (built-in). 
- 🧪 **Ingredient Decode & Analysis**  
  Paste a standard INCI list and get ingredient meanings, functions, safety scores, and EU regulatory compliance info. 
- ⚠️ **Safety & Irritability Scoring**  
  Highlights pore-cloggers, common irritants, and other flags like comedogenic scores. 
- 🇪🇺 **EU Regulation Lookup**  
  Cross-references each ingredient against 800+ EU-regulated ingredients for safety and restrictions.
- 🧠 **Open Source**

  
## Why This Project
Skincare products often list complex chemical names that are hard to interpret. Most consumers don’t know what ingredients are actually doing in their products — whether something is a harmless emollient or a possible irritant. This tool aims to remove that barrier with **automated decoding and clear scientific context**. 


## Tech Stack
- Next.js
- TypeScript
- Tailwind CSS
- Tesseract OCR

## Getting Started

```bash
npm install
npm run dev
```

## Build for Production

```bash
npm run build
```




