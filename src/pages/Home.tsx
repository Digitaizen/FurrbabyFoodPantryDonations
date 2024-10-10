import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-8">Welcome to Furrbaby Food Pantry Donation</h1>
      <p className="text-xl mb-8">Help pets in need by donating or requesting food.</p>
      <div className="flex justify-center space-x-4">
        <Link to="/donate" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded inline-flex items-center">
          <Heart className="mr-2" />
          Donate Food
        </Link>
        <Link to="/request" className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded inline-flex items-center">
          <ShoppingBag className="mr-2" />
          Request Food
        </Link>
      </div>
    </div>
  );
};

export default Home;