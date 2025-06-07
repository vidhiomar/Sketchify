import React from 'react';

const Navbar = () => {
  return (
    <div className="flex justify-between items-center px-6 py-4" >

      <button className="text-xl font-jakarta font-bold border-none">Sketchify</button>
 
      <div className="flex font-bold space-x-4">
        <button className="border-none">Home</button>
        <button className="border-none">About</button>
        <button className="border-none">Contact</button>
        <button className="border-none"><img src="/navbar_quesmark.png" alt="How to use"/></button>
      </div>

    </div>
  );
}; 

export default Navbar;
