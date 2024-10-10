import React from 'react';
import { DollarSign, ExternalLink } from 'lucide-react';

const Donate: React.FC = () => {
  const handleDonateClick = () => {
    // Implement donation logic (e.g., open payment gateway)
    console.log('Donate button clicked');
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-6">Donate Pet Food</h1>
      <div className="space-y-6">
        <button
          onClick={handleDonateClick}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded inline-flex items-center justify-center"
        >
          <DollarSign className="mr-2" />
          Donate Money
        </button>
        <a
          href="https://www.amazon.com/wishlist" // Replace with actual wishlist URL
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded inline-flex items-center justify-center"
        >
          <ExternalLink className="mr-2" />
          Amazon Wishlist
        </a>
      </div>
    </div>
  );
};

export default Donate;