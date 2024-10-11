import React, { useState } from 'react';
import { FileText, Send, Loader } from 'lucide-react';

// Define the type for messages
type Message = {
  type: 'user' | 'assistant';
  content: string;
};

export default function DocChatApp() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);

  // Function to generate a response based on user input
  const getResponse = (message: string): string => {
    const lowerCaseMessage = message.toLowerCase();

    // Example response logic based on keywords
    if (lowerCaseMessage.includes('total')) {
      return "Could you please specify which total you're referring to?";
    }
    if (lowerCaseMessage.includes('date')) {
      return "The invoice date is usually mentioned at the top of the document. Can you provide more details?";
    }
    if (lowerCaseMessage.includes('tax')) {
      return "Taxes are typically calculated based on the subtotal. Do you want to know the tax rate?";
    }
    return "I'm sorry, I don't have information about that. Can you please clarify?";
  };

  const handleSend = () => {
    if (newMessage.trim()) {
      setMessages((prev) => [...prev, { type: 'user', content: newMessage }]);
      setNewMessage('');
      setIsLoading(true);

      // Simulate a response delay
      setTimeout(() => {
        const response = getResponse(newMessage);
        setMessages((prev) => [...prev, { type: 'assistant', content: response }]);
        setIsLoading(false);
      }, 1000);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setUploadedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      alert("Please upload a valid PDF file.");
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 pt-20">
      {/* Left Side - Document Upload and Preview */}
      <div className="w-1/2 bg-white border-r p-4">
        <h2 className="text-lg font-semibold mb-4">Upload Document</h2>
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileUpload}
          className="mb-4 border rounded px-2 py-1 w-full"
        />
        {uploadedFile && (
          <div className="border rounded p-3 bg-blue-50 border-blue-200 mb-4">
            <div className="flex items-center">
              <FileText className="w-5 h-5 mr-2 text-blue-500" />
              <span className="text-sm font-medium">{uploadedFile.name}</span>
            </div>
            <div className="text-xs text-gray-500 mt-1">Uploaded {new Date().toLocaleTimeString()}</div>
          </div>
        )}
        {/* Document Preview */}
        <h2 className="text-lg font-semibold mb-4">Document Preview</h2>
        <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg h-[80%] flex flex-col items-center justify-center text-gray-500">
          {filePreview ? (
            <iframe
              src={filePreview}
              title="PDF Preview"
              className="w-full h-full"
            />
          ) : (
            <div>
              <FileText size={48} />
              <p className="mt-2 font-semibold">No document uploaded</p>
              <div className="mt-4 text-sm text-gray-500">Upload a PDF to see the preview</div>
            </div>
          )}
        </div>
      </div>

      {/* Right Side - Chat Area */}
      <div className="w-1/2 flex flex-col">
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          {messages.map((message, index) => (
            <div key={index} className={`mb-4 flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`rounded-lg p-3 max-w-[70%] ${
                message.type === 'user' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-white border text-gray-700'
              }`}>
                {message.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start mb-4">
              <div className="rounded-lg p-3 bg-white border text-gray-700">
                <Loader className="w-4 h-4 animate-spin" />
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t flex items-center">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Ask anything about your documents..."
            className="border rounded px-3 py-2 flex-1"
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <button onClick={handleSend} className="ml-2 bg-blue-500 text-white rounded px-4 py-2">
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
