import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Content from './components/Content';
import Footer from './components/Footer';
import About from './components/About';
import QnA from './components/QnA';
import PricePrediction from './components/PricePrediction';
import PolicyAdvice from './components/PolicyAdvice';

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Header />
        <Routes>
          <Route path="/" element={<Navigate to="/qna" replace />} />
          <Route path="/qna" element={<QnA />} />
          <Route path="/prediction" element={<PricePrediction />} />
          <Route path="/policy" element={<PolicyAdvice />} />
          <Route path="*" element={<div style={{ padding: '2rem' }}>Not Found</div>} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;