import React, { useState } from 'react';

interface NFTModalProps {
  t: (key: string) => string;
  userDonation: number;
  donorId: string;
  onClose: () => void;
}

export default function NFTModal({ t, userDonation, donorId, onClose }: NFTModalProps) {
  const [nftImage, setNftImage] = useState('');
  const [nftInfo, setNftInfo] = useState('');
  const [isMinting, setIsMinting] = useState(false);

  const mintNFT = async () => {
    setIsMinting(true);
    try {
      const response = await fetch('/mint-nft', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ donor_id: donorId }),
      });
      const data = await response.json();
      setNftImage(data.image);
      setNftInfo(t('nft_minted'));
    } catch (error) {
      console.error('Error:', error);
      setNftInfo('Error minting NFT');
    }
    setIsMinting(false);
  };

  return (
    <div className="modal" style={{ display: 'block' }}>
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>{t('nft_congrats')}</h2>
        <p>{t('nft_qualified').replace('{amount}', userDonation.toString())}</p>
        {!nftImage && (
          <button onClick={mintNFT} disabled={isMinting}>
            {isMinting ? 'Minting...' : t('mint_nft')}
          </button>
        )}
        {nftImage && <img id="nftImage" src={nftImage} alt="Sea Turtle NFT" />}
        <p id="nftInfo">{nftInfo}</p>
      </div>
    </div>
  );
}