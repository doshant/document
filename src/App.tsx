import React from 'react';
import './App.css';
import ContractExtractor from './pages/page'; // Ensure this points to the correct file
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/home';
import { ExtractionType } from './pages/page'; // Adjust the import path as necessary
import Navbar from './pages/navbar'; // Import your Navbar component

const App: React.FC = () => {
  return (
    <Router>
      <Navbar /> {/* Add the Navbar component here */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/hotel-contract" element={<ContractExtractor extractionType={ExtractionType.HOTEL_CONTRACT} />} />
        <Route path="/invoice" element={<ContractExtractor extractionType={ExtractionType.INVOICE} />} />
      </Routes>
    </Router>
  );
};

export default App;
