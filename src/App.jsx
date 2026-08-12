import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ThemeProvider } from './contexts/ThemeContext.jsx';
import Sidebar from './components/Sidebar.jsx';
import ChatPage from './pages/ChatPage.jsx';
import MedicalPage from './pages/MedicalPage.jsx';
import LeafPage from './pages/LeafPage.jsx';
import QuizPage from './pages/QuizPage.jsx';
import CropAdvisorPage from './pages/CropAdvisorPage.jsx';


function App() {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language || 'en');
  const [currentDomain, setCurrentDomain] = useState('agriculture');

  useEffect(() => {
    i18n.changeLanguage(currentLanguage);
  }, [currentLanguage, i18n]);


  return (
    <ThemeProvider>
      <Router>
        <div className="app-layout">
          <Sidebar
            currentLanguage={currentLanguage}
            onLanguageChange={setCurrentLanguage}
            currentDomain={currentDomain}
            onDomainChange={setCurrentDomain}
          />
          <main className="main-content">
            <Routes>
              <Route path="/" element={
                <ChatPage language={currentLanguage} domain={currentDomain} />
              } />
              <Route path="/medical" element={
                <MedicalPage language={currentLanguage} />
              } />
              <Route path="/leaf" element={
                <LeafPage language={currentLanguage} />
              } />
              <Route path="/quiz" element={<QuizPage />} />
              <Route path="/advisor" element={<CropAdvisorPage language={currentLanguage} />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;