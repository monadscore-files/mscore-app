// src/components/NoPage.js
import React from 'react';
import { Link } from 'react-router-dom';

const NoPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-white ">
      <h1 className="text-6xl font-bold">404</h1>
      <h2 className="text-2xl mt-4">Page Not Found</h2>
      <p className="mt-2">Oops! The page you are looking for does not exist.</p>
      <Link to="/" className="mt-4 text-[#FFE2A7] hover:underline">
        Go Back Home
      </Link>
    </div>
  );
};

export default NoPage;