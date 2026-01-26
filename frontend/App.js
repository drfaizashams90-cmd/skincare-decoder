import React, { useState } from 'react';
import axios from 'axios';

const SkincareDecoder = () => {
  const [inputText, setInputText] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle Text Analysis
  const handleAnalyze = async (textToAnalyze) => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/analyze-text', {
        ingredientsList: textToAnalyze || inputText
      });
      setResults(response.data);
    } catch (error) {
      console.error("Error analyzing", error);
    }
    setLoading(false);
  };

  // Handle Image Upload (OCR)
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      // 1. Get Text from Image
      const response = await axios.post('http://localhost:5000/api/analyze-image', formData);
      const extractedText = response.data.extractedText;
      
      // 2. Set text to input box (allowing user to edit OCR errors)
      setInputText(extractedText);
      
      // 3. Optional: Auto-analyze
      handleAnalyze(extractedText);
    } catch (error) {
      alert("Could not read image");
    }
    setLoading(false);
  };

  return (
    <div className="p-10 max-w-4xl mx-auto font-sans">
      <h1 className="text-3xl font-bold mb-6 text-purple-700">Skincare Decoder</h1>
      
      {/* Inputs Area */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        
        {/* Text Input */}
        <div>
          <label className="block font-bold mb-2">Paste Ingredients List:</label>
          <textarea
            className="w-full border p-2 rounded h-32"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Water, Glycerin, Niacinamide..."
          />
          <button 
            onClick={() => handleAnalyze(null)}
            className="bg-purple-600 text-white px-4 py-2 mt-2 rounded hover:bg-purple-700"
          >
            {loading ? 'Processing...' : 'Analyze Ingredients'}
          </button>
        </div>

        {/* OCR Input */}
        <div className="border-l pl-6">
          <label className="block font-bold mb-2">Or Upload Photo of Label:</label>
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleImageUpload} 
            className="mb-4"
          />
          <p className="text-sm text-gray-500">
            Tip: Ensure the photo is clear and contains only the ingredient list.
          </p>
        </div>
      </div>

      {/* Results Table */}
      {results && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 border-b text-left">Ingredient</th>
                <th className="py-2 px-4 border-b text-left">Rating</th>
                <th className="py-2 px-4 border-b text-left">Irritancy</th>
                <th className="py-2 px-4 border-b text-left">Comedogenic</th>
                <th className="py-2 px-4 border-b text-left">Function</th>
              </tr>
            </thead>
            <tbody>
              {results.map((item, index) => (
                <tr key={index} className={!item.found ? "bg-red-50" : ""}>
                  <td className="py-2 px-4 border-b font-medium">
                    {item.data ? item.data.inci_name : item.searched}
                    {!item.found && <span className="text-xs text-red-500 block">(Not in DB)</span>}
                  </td>
                  <td className="py-2 px-4 border-b">
                     {item.data?.rating && (
                        <span className={`px-2 py-1 rounded text-xs text-white
                          ${item.data.rating === 'Best' ? 'bg-green-600' : 
                            item.data.rating === 'Worst' ? 'bg-red-600' : 'bg-gray-400'}`}>
                          {item.data.rating}
                        </span>
                     )}
                  </td>
                  <td className="py-2 px-4 border-b">{item.data?.irritability}</td>
                  <td className="py-2 px-4 border-b">{item.data?.comedogenic}</td>
                  <td className="py-2 px-4 border-b text-sm">
                    {item.data?.functions?.join(", ")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SkincareDecoder;
