import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface DonationFormProps {
  t: (key: string) => string;
  onDonate: (name: string, amount: number) => void;
}

export default function DonationForm({ t, onDonate }: DonationFormProps) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onDonate(name, parseFloat(amount));
    navigate('/');
  };

  return (
    <div className="donation-form">
      <h2>{t('make_donation')}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t('your_name')}
          required
        />
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder={t('donation_amount')}
          min="0"
          step="0.01"
          required
        />
        <input type="submit" value={t('donate')} className="donate-button" style={{ width: '100%' }} />
      </form>
    </div>
  );
}