import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './components/Home';
import DonationForm from './components/DonationForm';
import NFTModal from './components/NFTModal';
import { translations, Language } from './translations';
import './App.css';
import { AuthClient } from "@dfinity/auth-client";

// Simulated ICP functionality
let totalDonations = 10000;
const donations: { [key: string]: number } = {};
const userDonations: { [key: string]: number } = {};

const icp_store_donation = (amount: number, donor: string): string => {
  totalDonations += amount;
  const donorId = Math.random().toString(36).substr(2, 9);
  donations[donorId] = amount;
  return donorId;
};

const icp_get_total_donations = (): number => {
  return totalDonations;
};

export default function App() {
  const [authClient, setAuthClient] = useState<AuthClient | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);

  const [lang, setLang] = useState<Language>('en');
  const [donorId, setDonorId] = useState<string | null>(null);
  const [userDonation, setUserDonation] = useState(0);
  const [showNFTModal, setShowNFTModal] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      const client = await AuthClient.create();
      setAuthClient(client);
      const isAuthed = await client.isAuthenticated();
      setIsAuthenticated(isAuthed);
    };
    initAuth();

    if (donorId) {
      setUserDonation(userDonations[donorId] || 0);
      setShowNFTModal(userDonations[donorId] > 1);
    }
    
  }, [donorId]);

  const login = async () => {
    if (!authClient) return;
    setLoading(true);

    await new Promise((resolve, reject) => {
      authClient.login({
        identityProvider: "https://identity.ic0.app",
        onSuccess: () => {
          setIsAuthenticated(true);
          setLoading(false);
          resolve(null);
        },
        onError: () => {
          setLoading(false);
          reject();
        },
      });
    });
  };

  const logout = async () => {
    if (!authClient) return;
    setLoading(true);
    await authClient.logout();
    setIsAuthenticated(false);
    setLoading(false);
  };

  const t: (key: keyof typeof translations['en']) => string = (key) => translations[lang][key];

  const handleDonation = (name: string, amount: number) => {
    const newDonorId = icp_store_donation(amount, name);
    userDonations[newDonorId] = amount;
    setDonorId(newDonorId);
    setUserDonation(amount);
    setShowNFTModal(amount > 1);
  };

  return (
    <Router>
      <div className="overlay">
        <div className="container">
        <header className="app-header">
          {isAuthenticated ? (
            <button onClick={logout} className="auth-button" disabled={loading}>
              {loading ? 'Logging out...' : 'Logout'}
            </button>
          ) : (
            <button onClick={login} className="auth-button" disabled={loading}>
              {loading ? 'Logging in...' : 'Login with Internet Identity'}
            </button>
          )}
        </header>

          <div className="language-switcher">
            <Link to="/" onClick={() => setLang('en')}>English</Link>
            <Link to="/" onClick={() => setLang('th')}>ไทย</Link>
          </div>
          <Routes>
            <Route path="/" element={
              <Home 
                t={t as (key: string) => string} 
                totalDonations={icp_get_total_donations()} 
                userDonation={userDonation}
              />
            } />
            <Route path="/donate" element={
              <DonationForm t={t as (key: string) => string} onDonate={handleDonation} />
            } />
          </Routes>
        </div>
      </div>
      {showNFTModal && (
        <NFTModal 
          t={t as (key: string) => string} 
          userDonation={userDonation} 
          donorId={donorId!} 
          onClose={() => setShowNFTModal(false)} 
        />
      )}
    </Router>
  );
}
