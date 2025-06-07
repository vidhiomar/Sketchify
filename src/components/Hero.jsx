import React from 'react';

const Hero = () => {
  return (

    <div className="flex flex-col items-center text-center mt-10 font-jakarta">

        <div  className='mb-8'>
            <h1 className="text-4xl font-jakarta font-bold mb-2">Sketchify</h1>
            <p className="text-lg text-gray-600">Upload your image and generate sketch instantly!</p>
        </div>

      <rectangle className="mt-2 border border-black  border-dashed px-52  rounded-lg py-12">
        <div className='font-bold'>
          Drag & drop your image here, or click to browse      
        </div>
        <button className='mt-6 font-bold border border-purple bg-[#EDE8F2] px-6 py-2 rounded-lg'>
            Upload Image
        </button>
      </rectangle>

      <button className='bg-[#C7ADEB] px-6 py-2 mt-8 rounded-lg font-bold'>
        Convert to Sketch
      </button>

    </div>
  );
};

export default Hero;
