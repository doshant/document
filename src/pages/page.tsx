import React, { useState } from 'react';
import { FileText, CheckCircle } from 'lucide-react';
import './page.css';

export enum ExtractionType { // Ensure this is exported
  HOTEL_CONTRACT = 'Hotel Contract',
  INVOICE = 'Invoice',
}

const invoiceData = {
  'Invoice Number': 'INV-123456',
  'Invoice Date': 'January 15, 2024',
  'Due Date': 'February 15, 2024',
  'Total Amount': '$1,200',
  'Payment Terms': 'Net 30 days',
  'Items': [
    'Room Charges: $1,000' ,
   'Taxes: $200' 
  ],
};

const contractData = {
  'Hotel Name': 'Grand Oceanview Resort & Spa',
  'Contract Date': 'January 15, 2024',
  'Contract Term': '12 months',
  'Room Rates': '$199/night',
  'Cancellation Policy': '48 hours prior to check-in',
  'Commission Rate': '15%',
  'Payment Terms': 'Net 30 days',
  'Special Clauses': 
    'Complimentary breakfast included'
};

const ContractExtractor: React.FC<{ extractionType: ExtractionType }> = ({ extractionType }) => {
  // State to handle uploaded PDF file and its URL for preview
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isProcessed, setIsProcessed] = useState(false);
  const [inputValues, setInputValues] = useState<{ [key: string]: string }>({});
  const [highlightedRows, setHighlightedRows] = useState<string[]>([]); // Track highlighted rows
  const [allRowsHighlighted, setAllRowsHighlighted] = useState(false); // Track if all rows are highlighted

  const extractedData = extractionType === ExtractionType.INVOICE ? invoiceData : contractData;

  // Handle file upload
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; // Optional chaining
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
      const url = URL.createObjectURL(file);
      setPdfUrl(url);

      // Set a 2-second delay before processing the file
      setTimeout(() => {
        setIsProcessed(true);
      }, 2000);
    } else {
      alert('Please upload a valid PDF file.');
      setIsProcessed(false);
    }
  };

  // Handle input value changes
  const handleInputChange = (key: string, value: string) => {
    setInputValues((prev) => ({ ...prev, [key]: value }));
  };

  // Toggle row highlight
  const toggleHighlightRow = (key: string) => {
    setHighlightedRows((prev) =>
      prev.includes(key) ? prev.filter((row) => row !== key) : [...prev, key]
    );
    setAllRowsHighlighted(false); // Reset all rows highlight when a specific row is clicked
  };

  // Toggle all rows highlight
  const toggleHighlightAllRows = () => {
    if (allRowsHighlighted) {
      setHighlightedRows([]); // Clear highlighted rows
    } else {
      setHighlightedRows(Object.keys(extractedData)); // Highlight all rows
    }
    setAllRowsHighlighted(!allRowsHighlighted); // Toggle the all rows highlighted state
  };

  // Handle submission
  const handleSubmit = () => {
    // You can implement your submission logic here
    alert('Data submitted successfully!');
    console.log(inputValues); // Log the input values
  };

  return (
    <div className="flex h-screen bg-gray-100 p-4 pt-20">
      {/* Left side - Document Viewer */}
      <div className="w-1/2 bg-white rounded-lg shadow-lg p-4 mr-4">
        <div className="border-b pb-2 mb-4">
          <h2 className="text-lg font-semibold">{`Upload ${extractionType}`}</h2>
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
              {pdfUrl && ( // Conditional rendering for iframe
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
      <div className="border-b pb-2 mb-4 flex items-center justify-between"> {/* Add flex styles */}
  <h2 className="text-lg font-semibold">Extracted {extractionType} Details</h2>
  <button
    onClick={handleSubmit} // Handle submission logic
    className={`mt-4 bg-blue-500 text-white py-2 px-4 rounded-md ${highlightedRows.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
    disabled={highlightedRows.length === 0} // Disable if no rows are highlighted
  >
    Submit
  </button>
</div>

        {isProcessed && ( // Only show extracted data if the file is processed
          <>
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th 
                    className="px-6 py-3 text-left text-sm font-medium text-gray-500 cursor-pointer" 
                    onClick={toggleHighlightAllRows} // Toggle all rows on header click
                  >
                    Key
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Value</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Input</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Object.entries(extractedData).map(([key, value]) => (
                  <tr 
                    key={key} 
                    className={`cursor-pointer ${highlightedRows.includes(key) ? 'bg-blue-100' : ''}`} 
                    onClick={() => toggleHighlightRow(key)} // Toggle individual row highlight
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{key}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">{Array.isArray(value) ? value.join(', ') : value}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="text"
                        value={inputValues[key] || ''}
                        onChange={(e) => handleInputChange(key, e.target.value)}
                        className="border border-gray-300 rounded-md p-1 w-full"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
}

export default ContractExtractor;
