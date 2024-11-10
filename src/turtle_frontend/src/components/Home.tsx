import React from 'react';
import { Link } from 'react-router-dom';

interface HomeProps {
  t: (key: string) => string;
  totalDonations: number;
  userDonation: number;
}

export default function Home({ t, totalDonations, userDonation }: HomeProps) {
  return (
    <>
      <h1>{t('welcome')}</h1>
      <p className="description">{t('description')}</p>
      <p className="description">{t('call_to_action')}</p>
      <div style={{ textAlign: 'center' }}>
        <Link to="/donate" className="donate-button donate-button-small">{t('donate_now')}</Link>
      </div>
      
      <div className="icp-info">
        <h3>{t('icp_integration')}</h3>
        <p>{t('icp_info')}</p>
      </div>

      <div className="donation-summary">
        <p>{t('total_donations')}</p>
        <span className="donation-amount">{totalDonations} {t('icp')}</span>
        {userDonation > 0 && (
          <>
            <p>{t('your_donation')}</p>
            <span className="donation-amount">{userDonation} {t('icp')}</span>
          </>
        )}
      </div>
    </>
  );
}