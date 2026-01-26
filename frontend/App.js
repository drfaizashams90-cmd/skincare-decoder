import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [inputText, setInputText] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [ocrLoading, setOcrLoading] = useState(false);

  // --- Handlers ---

  const handleAnalyze = async () => {
    if (!inputText) return;
    setLoading(true);
    setResults(null);
    try {
      const response = await axios.post('http://localhost:5000/api/analyze-text', {
        ingredientsList: inputText
      });
      setResults(response.data);
    } catch (error) {
      alert("Error analyzing text. Is backend running?");
    }
    setLoading(false);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setOcrLoading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await axios.post('http://localhost:5000/api/analyze-image', formData);
      setInputText(response.data.extractedText);
    } catch (error) {
      alert("OCR failed. Try a clearer image.");
    }
    setOcrLoading(false);
  };

  // --- Render Helpers ---

  const getRatingColor = (rating) => {
    switch (rating) {
      case 'Best': return 'bg-purple-600 text-white';
      case 'Good': return 'bg-green-500 text-white';
      case 'Average': return 'bg-yellow-400 text-black';
      case 'Icky': return 'bg-orange-500 text-white';
      case 'Worst': return 'bg-red-600 text-white';
      default: return 'bg-gray-200 text-gray-700';
    }
  };

  const getEuStatus = (item) => {
    if (!item.data || item.data.eu_status === 'Safe') return null;
    
    return (
      <div className="group relative inline-block ml-2">
        <span className="cursor-pointer text-xl">
           {item.data.eu_status === 'Banned' ? '⛔' : '⚠️'}
        </span>
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 bg-gray-900 text-white text-xs rounded p-2 hidden group-hover:block z-50 shadow-lg">
          <p className="font-bold text-yellow-400 uppercase">{item.data.eu_status}</p>
          <p>{item.data.eu_details}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold text-purple-700 mb-2">Skincare Decoder</h1>
          <p className="text-gray-600">Analyze products for safety, acne triggers, and EU compliance.</p>
        </header>

        {/* Input Section */}
        <div className="bg-white p-6 rounded-xl shadow-md grid md:grid-cols-2 gap-8 mb-8">
          
          {/* Text Input */}
          <div className="flex flex-col">
            <label className="font-semibold mb-2 text-gray-700">Paste Ingredients (comma separated)</label>
            <textarea
              className="w-full border border-gray-300 p-3 rounded-lg h-40 focus:ring-2 focus:ring-purple-500 outline-none"
              placeholder="Water, Niacinamide, Alcohol..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <button 
              onClick={handleAnalyze}
              disabled={loading}
              className="mt-4 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-all disabled:opacity-50"
            >
              {loading ? 'Decoding...' : 'Analyze Now'}
            </button>
          </div>

          {/* OCR Input */}
          <div className="flex flex-col justify-center items-center border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
            <h3 className="font-semibold text-gray-700 mb-4">Or scan a product label</h3>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageUpload} 
              className="hidden" 
              id="fileUpload"
            />
            <label htmlFor="fileUpload" className="cursor-pointer bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded shadow-sm hover:bg-gray-100">
              Choose Image
            </label>
            {ocrLoading && <p className="mt-4 text-purple-600 animate-pulse">Scanning text...</p>}
            <p className="text-xs text-gray-400 mt-2 text-center">Supported: JPG, PNG. Ensure good lighting.</p>
          </div>
        </div>

        {/* Results Section */}
        {results && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="p-4 text-sm font-bold text-gray-600 uppercase">Ingredient</th>
                  <th className="p-4 text-sm font-bold text-gray-600 uppercase">Rating</th>
                  <th className="p-4 text-sm font-bold text-gray-600 uppercase text-center">Acne</th>
                  <th className="p-4 text-sm font-bold text-gray-600 uppercase text-center">Irritant</th>
                  <th className="p-4 text-sm font-bold text-gray-600 uppercase">Function & Safety</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {results.map((item, idx) => (
                  <tr key={idx} className={`hover:bg-gray-50 ${!item.found ? 'bg-red-50' : ''}`}>
                    
                    {/* Name */}
                    <td className="p-4 font-medium text-gray-800">
                      {item.data ? item.data.inci_name : item.searched}
                      {!item.found && <span className="block text-xs text-red-500 mt-1">Unknown Ingredient</span>}
                    </td>

                    {/* Rating */}
                    <td className="p-4">
                      {item.data && (
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getRatingColor(item.data.rating)}`}>
                          {item.data.rating}
                        </span>
                      )}
                    </td>

                    {/* Comedogenic (Acne) */}
                    <td className="p-4 text-center">
                      {item.data && (
                        <span className={`font-bold ${item.data.comedogenic > 2 ? 'text-red-500' : 'text-gray-400'}`}>
                          {item.data.comedogenic}
                        </span>
                      )}
                    </td>

                    {/* Irritancy */}
                    <td className="p-4 text-center">
                      {item.data && (
                        <span className={`font-bold ${item.data.irritability > 2 ? 'text-red-500' : 'text-gray-400'}`}>
                          {item.data.irritability}
                        </span>
                      )}
                    </td>

                    {/* Function & EU Status */}
                    <td className="p-4 text-sm text-gray-600">
                      {item.data ? (
                        <div className="flex items-center justify-between">
                          <span>{item.data.functions?.join(', ')}</span>
                          {getEuStatus(item)}
                        </div>
                      ) : (
                        "-"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
      </div>
    </div>
  );
}

export default App;
