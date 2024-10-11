import React, { useState } from 'react';
import { FileText, CheckCircle } from 'lucide-react';
import './page.css';

export default function Rli() {
  // State to handle uploaded PDF file and its URL for preview
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isProcessed, setIsProcessed] = useState(false);
  const [inputValues, setInputValues] = useState<{ [key: string]: { rateCode: string; cityCode: string } }>({});
  const [highlightedRows, setHighlightedRows] = useState<string[]>([]);
  const [allRowsHighlighted, setAllRowsHighlighted] = useState(false);

  const extractedData = {
    'Sabre': ['TL7', '3MRC'],
    'Worldspan': ['7TL', 'C0P'],
    'Apollo/Galileo': ['7TL', '1Y0I'],
    'Amadeus': ['7TL', ''],
    'Pegasus': ['7TL', 'TB'],
  };

  // Handle file upload
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
      const url = URL.createObjectURL(file);
      setPdfUrl(url);

      setTimeout(() => {
        setIsProcessed(true);
      }, 2000);
    } else {
      alert('Please upload a valid PDF file.');
      setIsProcessed(false);
    }
  };

  // Handle input value changes
  const handleInputChange = (key: string, field: 'rateCode' | 'cityCode', value: string) => {
    setInputValues((prev) => ({
      ...prev,
      [key]: { ...prev[key], [field]: value },
    }));
  };

  // Toggle row highlight
  const toggleHighlightRow = (key: string) => {
    setHighlightedRows((prev) =>
      prev.includes(key) ? prev.filter((row) => row !== key) : [...prev, key]
    );
    setAllRowsHighlighted(false);
  };

  // Toggle all rows highlight
  const toggleHighlightAllRows = () => {
    if (allRowsHighlighted) {
      setHighlightedRows([]);
    } else {
      setHighlightedRows(Object.keys(extractedData));
    }
    setAllRowsHighlighted(!allRowsHighlighted);
  };

  // Handle submission
  const handleSubmit = () => {
    alert('Data submitted successfully!');
    console.log(inputValues);
  };

  return (
    <div className="flex h-screen bg-gray-100 p-4 pt-20">
      {/* Left side - Document Viewer */}
      <div className="w-1/2 bg-white rounded-lg shadow-lg p-4 mr-4">
        <div className="border-b pb-2 mb-4">
          <h2 className="text-lg font-semibold">Upload RLI</h2>
        </div>
        <input 
          type="file" 
          accept="application/pdf" 
          onChange={handleFileChange} 
          className="mb-4"
        />
        <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg h-[80%] flex flex-col items-center justify-center text-gray-500">
          {pdfFile ? (
            <>
              <FileText size={48} />
              <p className="mt-2 font-semibold">{pdfFile.name}</p>
              {isProcessed && (
                <div className="mt-4 bg-green-100 text-green-700 px-3 py-1 rounded-full flex items-center">
                  <CheckCircle size={16} className="mr-1" />
                  Successfully processed
                </div>
              )}
              {pdfUrl && (
                <iframe 
                  src={pdfUrl} 
                  title="PDF Preview" 
                  className="w-full h-[400px] mt-4" 
                  frameBorder="0"
                />
              )}
            </>
          ) : (
            <p className="mt-2">No document uploaded yet.</p>
          )}
        </div>
      </div>

      {/* Right side - Extracted Information */}
      <div className="w-1/2 bg-white rounded-lg shadow-lg p-4">
        <div className="border-b pb-2 mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Extracted RLI Details</h2>
          <button
            onClick={handleSubmit}
            className="mt-0 bg-blue-500 text-white py-2 px-4 rounded-md"
          >
            Submit
          </button>
        </div>
        {isProcessed && (
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th 
                  className="px-6 py-3 text-left text-sm font-medium text-gray-500 cursor-pointer" 
                  onClick={toggleHighlightAllRows}
                >
                  GDS
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Rate Code</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Pseudo City Code</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Object.entries(extractedData).map(([key, [rateCode, cityCode]]) => (
                <tr 
                  key={key} 
                  className={`cursor-pointer ${highlightedRows.includes(key) ? 'bg-blue-100' : ''}`} 
                  onClick={() => toggleHighlightRow(key)}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{key}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="text"
                      value={inputValues[key]?.rateCode || rateCode}
                      onChange={(e) => handleInputChange(key, 'rateCode', e.target.value)}
                      className="border border-gray-300 rounded-md p-1 w-full"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="text"
                      value={inputValues[key]?.cityCode || cityCode}
                      onChange={(e) => handleInputChange(key, 'cityCode', e.target.value)}
                      className="border border-gray-300 rounded-md p-1 w-full"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
