import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Section1 from './section1'; // Updated component name
import { FaInstagram, FaFacebook, FaTwitter } from "react-icons/fa";

const Home = () => {
  const [] = useState([]);

  return (
    <div className="bg-white dark:bg-night-100 text-gray-900 dark:text-gray-600">
      <Navbar />
      <Section1 /> {/* Corrected component name */}
      <footer className="bg-white p-2 text-center mt-16">
              <div className="container mx-auto">
                <p className="font-sans text-sm md:text-base text-gray-700">&copy; {new Date().getFullYear()} Pulse Life. All rights reserved.</p>
                <div className="flex justify-center space-x-6 mt-3">
                  <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                    <FaInstagram className="text-red-600 hover:text-green-700" size={26} />
                  </a>
                  <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                    <FaFacebook className="text-red-600 hover:text-green-700" size={26} />
                  </a>
                  <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
                    <FaTwitter className="text-red-600 hover:text-green-700" size={26} />
                  </a>
                </div>
              </div>
            </footer>
    </div>
  );
};

export default Home;