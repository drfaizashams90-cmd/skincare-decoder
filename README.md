# Skincare Ingredient Decoder

#### AI Tool for Real-Time Cosmetic Ingredients Safety Analysis using OCR & EU Regulations

**Dataset:** 800+ cosmetic ingredients mapped to EU safety standards

## 🎥 Quick Demo

**Live Demo:** https://skincare-decoder.vercel.app/

**Demo Video:** https://github.com/user-attachments/assets/e0a81443-4f33-4692-a7f6-b2767c200349
________________________________________
## Overview
🧴 Skincare products often list complex INCI (International Nomenclature of Cosmetic Ingredients) names or chemical names that are hard to interpret. Most consumers don’t know what ingredients are actually doing in their products — whether something is a harmless emollient or a possible irritant. This tool aims to remove that barrier by using **OCR, structured datasets, and regulatory intelligence** and provides “Clear safety insights, potential irritants with their irritability scores, comedogenic scores (shows acne triggers), ingredients purpose, and EU regulatory compliance.

👉 Paste ingredients or scan a product label → get instant analysis and clear insights.
________________________________________
## Why This Project Stands Out
Unlike existing tools, this system goes beyond simple ingredient lookup:

✔ Uses EU regulatory standards (one of the strictest globally)

✔ Implements a multi-factor scoring system instead of binary classification

✔ Supports real-world OCR input from product packaging

✔ Provides explainable outputs (why an ingredient is flagged)

✔ Built with a custom dataset (800+ ingredients)
________________________________________
## Features
**🔍 Ingredient Intelligence Engine**

   •	Parses raw INCI ingredient lists

   •	Handles inconsistent naming & formatting

   •	Normalizes chemical variations

   •	Provides each ingredient's functions and uses

**📊 Safety Classification System**

   •	Categorizes ingredients into:

           o Best          o Good          o Average          o Risky          o Restricted / Banned

   •	Based on regulatory thresholds and usage limits

   •	Also highlights pore-cloggers, common irritants with comedogenic score and irritability score

📸 **OCR Pipeline**

   •	Extracts ingredients directly from product labels

   •	Handles noisy and real-world image input

🌍 **Regulatory Mapping**

   •	Cross-references each ingredient against 800+ EU-regulated ingredients for safety and restrictions
   •	Identifies restricted and banned substances
🧠 **Open Source**
________________________________________
## System Architecture

![Architecture](https://github.com/Vidhyambika/skincare-decoder/blob/main/Skincare%20Ingredient%20Decoder%20Architecture%20Diagram.png)
________________________________________
## Components:
- **Text Input**: Paste comma-separated ingredient lists
- **OCR/Camera**: Upload product label images for automatic text extraction
- **Safety Analysis**: Ratings, irritability, and comedogenic scores
- **EU Compliance**: Regulatory status and restrictions
________________________________________
## Tech Stack
•	Frontend: Next.js, Tailwind CSS
•	Backend: Node.js / API routes
•	OCR: Tesseract OCR
•	Data: Custom ingredient dataset (800+ entries) taken by referring important ingredients in EU Cosmetic Database
•	Processing: Text normalization + rule-based scoring system
________________________________________
## 🚀 Getting Started

```bash
git clone https://github.com/Vidhyambika/skincare-decoder.git
cd skincare-decoder
npm install
npm run dev
```
________________________
## Build for Production

```bash
npm run build
```
________________________________________
## Screenshots

![Blue Purple Futuristic Modern 3D Tech Company Business Presentation (1)](https://github.com/user-attachments/assets/cca12c2c-2e49-41e3-bd1f-ea2bb211b036)

![Blue Purple Futuristic Modern 3D Tech Company Business Presentation (2)](https://github.com/user-attachments/assets/3f17e287-085b-4f3d-bfcd-85cd5ed07bf0)

![Blue Purple Futuristic Modern 3D Tech Company Business Presentation](https://github.com/user-attachments/assets/72cc09a5-3c95-4ab4-99b0-a320a23e8ca1)

![Screenshot 2026-02-20 170504](https://github.com/user-attachments/assets/e9881761-d3a9-4398-9512-e048a1319233)

![Screenshot 2026-02-20 170559](https://github.com/user-attachments/assets/70d6e0c2-3334-47a6-ac6f-33c561471106)
________________________________________
## ⚠️ Disclaimer
This project is intended for educational and informational purposes only.
It is not a substitute for professional dermatological or medical advice.
________________________________________
## 👩‍💻 Author
Vidhyambika S R
________________________________________
## ⭐ If you found this useful
Give this repo a ⭐ and share your feedback!

