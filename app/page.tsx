'use client';
import { useState } from 'react';
import { Upload, FileText, Sparkles, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

import { ingredientsData, Ingredient } from '@/data/ingredientsData';
import { recognize } from 'tesseract.js';


interface AnalysisResult {
  ingredient: Ingredient;
  matchedName: string;
}

export default function Home() {
  const [ingredientText, setIngredientText] = useState('');
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([]);
  const [isProcessingOCR, setIsProcessingOCR] = useState(false);
  const [ocrProgress, setOcrProgress] = useState(0);

  const normalizeText = (text: string): string => {
    return text.toLowerCase().trim().replace(/\s+/g, ' ');
  };

  const findIngredient = (searchTerm: string): Ingredient | null => {
    const normalized = normalizeText(searchTerm);

    for (const ingredient of ingredientsData) {
      // Check INCI name
      if (normalizeText(ingredient.inci_name) === normalized) {
        return ingredient;
      }

      // Check aliases
      for (const alias of ingredient.aliases) {
        if (normalizeText(alias) === normalized) {
          return ingredient;
        }
      }

      // Partial match on INCI name
      if (normalizeText(ingredient.inci_name).includes(normalized) ||
        normalized.includes(normalizeText(ingredient.inci_name))) {
        return ingredient;
      }
    }

    return null;
  };

  const analyzeIngredients = () => {
    if (!ingredientText.trim()) {
      return;
    }

    const ingredients = ingredientText
      .split(',')
      .map(ing => ing.trim())
      .filter(ing => ing.length > 0);

    const results: AnalysisResult[] = [];

    for (const ing of ingredients) {
      const matched = findIngredient(ing);
      if (matched) {
        results.push({
          ingredient: matched,
          matchedName: ing,
        });
      }
    }

    setAnalysisResults(results);
  };

  // Image preprocessing to improve OCR accuracy
  const preprocessImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }

        // Resize if too large (max 2000px width) to improve speed
        const MAX_WIDTH = 2000;
        let width = img.width;
        let height = img.height;

        if (width > MAX_WIDTH) {
          height = Math.round((height * MAX_WIDTH) / width);
          width = MAX_WIDTH;
        }

        canvas.width = width;
        canvas.height = height;

        // Draw original image
        ctx.drawImage(img, 0, 0, width, height);

        // Get image data for pixel manipulation
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;

        // Apply grayscale and incomplete contrast stretching
        // This is a simple implementation; libraries like varying glfx.js offer more
        for (let i = 0; i < data.length; i += 4) {
          // Grayscale (Luma method)
          const avg = 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];

          // Increase contrast
          const contrastargs = 1.2; // 20% contrast increase
          const factor = (259 * (contrastargs + 255)) / (255 * (259 - contrastargs));
          const color = factor * (avg - 128) + 128;

          // Clamping
          const final = Math.max(0, Math.min(255, color));

          data[i] = final;     // red
          data[i + 1] = final; // green
          data[i + 2] = final; // blue
          // alpha (data[i+3]) remains unchanged
        }

        ctx.putImageData(imageData, 0, 0);
        resolve(canvas.toDataURL('image/jpeg'));
      };

      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessingOCR(true);
    setOcrProgress(0);

    try {
      // Preprocess image
      const processedImage = await preprocessImage(file);

      const { data: { text } } = await recognize(processedImage, 'eng', {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            setOcrProgress(Math.round(m.progress * 100));
          }
        },
      });

      setIngredientText(text);
      setIsProcessingOCR(false);
      setOcrProgress(0);
    } catch (error) {
      console.error('OCR Error:', error);
      setIsProcessingOCR(false);
      alert('Failed to extract text from image. Please try again or paste the ingredients manually.');
    }
  };

  const getRatingColor = (rating: Ingredient['rating']) => {
    switch (rating) {
      case 'Best':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'Good':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'Average':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'Icky':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'Worst':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getEUStatusIcon = (status: Ingredient['eu_status']) => {
    switch (status) {
      case 'Safe':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'Restricted':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case 'Banned':
        return <XCircle className="w-5 h-5 text-red-600" />;
    }
  };

  const getComedogenicColor = (score: number) => {
    if (score === 0) return 'text-green-600';
    if (score <= 2) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getIrritabilityColor = (score: number) => {
    if (score === 0) return 'text-green-600';
    if (score <= 2) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-brand-800 via-brand-900 to-black">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-10 h-10 text-brand-600" />
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-white">
              Skincare Ingredient Checker Pakistan
            </h1>
          </div>
          <p className="text-lg text-brand-100 max-w-2xl mx-auto font-body">
            Paste or scan any product's ingredient list to instantly check for irritants, acne triggers, and restricted substances — built for Pakistani skin by SkinVerse.pk.
            <br className="hidden md:block" />
            <span className="mt-3 inline-block px-4 py-1.5 bg-brand-800 text-brand-100 rounded-full text-sm font-semibold border border-brand-600 shadow-sm">
              🧪 Checking against a live database of {ingredientsData.length} ingredients
            </span>
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8 mb-8">
          <div className="space-y-6">
            {/* OCR Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Upload Product Label Image (OCR)
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isProcessingOCR}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className={`flex items-center justify-center gap-3 px-6 py-4 border-2 border-dashed rounded-lg cursor-pointer transition-all ${isProcessingOCR
                    ? 'border-gray-300 bg-gray-50 cursor-not-allowed'
                    : 'border-brand-300 hover:border-brand-500 hover:bg-brand-50'
                    } dark:border-gray-600 dark:hover:border-gray-500`}
                >
                  <Upload className="w-5 h-5 text-brand-600" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {isProcessingOCR ? `Processing... ${ocrProgress}%` : 'Choose Image or Take Photo'}
                  </span>
                </label>
                {isProcessingOCR && (
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-brand-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${ocrProgress}%` }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Text Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Or Paste Ingredient List (comma-separated)
              </label>
              <textarea
                value={ingredientText}
                onChange={(e) => setIngredientText(e.target.value)}
                placeholder="e.g., Water, Niacinamide, Hyaluronic Acid, Salicylic Acid, Fragrance..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-black resize-none"
                rows={6}
              />
            </div>

            {/* Analyze Button */}
            <button
              onClick={analyzeIngredients}
              disabled={!ingredientText.trim()}
              className="w-full md:w-auto px-8 py-3 bg-brand-600 text-white font-semibold rounded-lg hover:bg-brand-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              <FileText className="w-5 h-5" />
              Analyze Ingredients
            </button>
          </div>
        </div>

        {/* Results Section */}
        {analysisResults.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-heading font-bold text-white mb-4">
              Analysis Results ({analysisResults.length} ingredients found)
            </h2>

            {analysisResults.map((result, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-brand-500"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                      {result.ingredient.inci_name}
                    </h3>
                    {result.matchedName !== result.ingredient.inci_name && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Matched from: {result.matchedName}
                      </p>
                    )}
                  </div>
                  <div
                    className={`px-4 py-2 rounded-lg border font-semibold ${getRatingColor(
                      result.ingredient.rating
                    )}`}
                  >
                    {result.ingredient.rating}
                  </div>
                </div>

                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  {result.ingredient.description}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                        Comedogenic Score
                      </span>
                      <span className={`text-lg font-bold ${getComedogenicColor(result.ingredient.comedogenic)}`}>
                        {result.ingredient.comedogenic}/5
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${result.ingredient.comedogenic === 0
                          ? 'bg-green-500'
                          : result.ingredient.comedogenic <= 2
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                          }`}
                        style={{ width: `${(result.ingredient.comedogenic / 5) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                        Irritability Score
                      </span>
                      <span className={`text-lg font-bold ${getIrritabilityColor(result.ingredient.irritability)}`}>
                        {result.ingredient.irritability}/5
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${result.ingredient.irritability === 0
                          ? 'bg-green-500'
                          : result.ingredient.irritability <= 2
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                          }`}
                        style={{ width: `${(result.ingredient.irritability / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {result.ingredient.functions.map((func, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-brand-100 dark:bg-brand-900 text-brand-700 dark:text-brand-300 rounded-full text-sm font-medium"
                    >
                      {func}
                    </span>
                  ))}
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <div className="flex items-start gap-3">
                    {getEUStatusIcon(result.ingredient.eu_status)}
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        EU Status: {result.ingredient.eu_status}
                      </p>
                      {result.ingredient.eu_details && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {result.ingredient.eu_details}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {analysisResults.length === 0 && ingredientText.trim() && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              No matching ingredients found. Make sure ingredients are comma-separated and spelled correctly.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}






