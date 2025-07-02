import React, { useRef, useState, useCallback } from 'react';

export default function Hero() {
  const fileInputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [previewSrc, setPreviewSrc] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sketchUrl, setSketchUrl] = useState(null);

  
const API_BASE = import.meta.env.VITE_API_URL;
  // open file dialog
  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  // handle file selection
  const handleFiles = async(files) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    setSelectedFile(file);
    
    //upload file or store it in form data
    const data = new FormData()
    data.append("file" , file)
    data.append("upload_preset" , 'Sketchify')
    data.append('cloud_name' , 'dkwrhxpcb')

    const res = await fetch('https://api.cloudinary.com/v1_1/dkwrhxpcb/image/upload' ,
    { method : "POST" ,
    body : data
    })
      
    const Imagedata = await res.json()
    const uploadedImageUrl = Imagedata.secure_url;
    console.log(uploadedImageUrl)

    //file preview
    setPreviewSrc(Imagedata.secure_url);
  };

  // input change
  const handleChange = (e) => {
    handleFiles(e.target.files);
  };

  // drag events
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
  }, []);
  
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  }, []);

const uploadAndSketch = async (file) => {
  // build FormData
  try{
    const formData = new FormData();
    formData.append('image', file);

    // call Flask POST route
    console.log("POSTING to /sketch ")
    const res = await fetch('https://sketchify-lp96.onrender.com/sketch', {
    method: 'POST',                
    body: formData,  // raw multipart form data
  });
  console.log("Fetch returned" , res)

  if (!res.ok) {
    const text = await res.text()
    console.error('server responded with error body :' , text)
    throw new Error(`Server error: ${res.status}`);
  }

  // the response is img blob
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  setSketchUrl(url);
  } catch(err){
    console.error('uploadAndSketch() error:' , err)
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="flex flex-col items-center text-center mt-10 font-jakarta px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Sketchify</h1>
        <p className="text-lg text-gray-600">
          Upload your image and generate sketch instantly!
        </p>
      </div>

      {/* hidden file input */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleChange}
        className="hidden"
      />

      {/* drop zone */}
      <div onClick={openFileDialog} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
        className={`mt-2 w-full max-w-lg border-2 border-dashed rounded-lg py-12
          ${dragOver ? 'border-purple-500 bg-purple-50' : 'border-black'}
          cursor-pointer
        `}
      >
        {previewSrc ? (
          <img src={previewSrc} alt="Preview" className="mx-auto max-h-64 object-contain"/>
        ) : (
          <div className="space-y-4">
            <div className="font-bold">
              Drag & drop your image here, or click to browse
            </div>
            <button type="button"
              className="mt-6 font-bold border border-purple-500 bg-[#EDE8F2] px-6 py-2 rounded-lg"
            >
              Upload Image
            </button>
          </div>
        )}
      </div>

      {/*Convert button*/}

     <button  onClick={() => { console.log("Convert clicked, file is:", selectedFile);
      uploadAndSketch(selectedFile);
      }}disabled={loading || !previewSrc}
      className={`
        bg-[#C7ADEB] px-6 py-2 mt-8 rounded-lg font-bold
        ${loading || !previewSrc ? 'opacity-50 cursor-not-allowed' : 'hover:bg-purple-300'}
      `}
     >
      {loading ? 'Converting…' : 'Convert to Sketch'}
     </button>


    {sketchUrl && (
  <div className="mt-8 flex flex-col items-center space-y-4">
    <img
      src={sketchUrl}
      alt="Sketch result"
      className="rounded shadow max-w-full"
    />

    {/* Download link styled as a button */}
    <a
      href={sketchUrl}
      download="sketch.png"
      className="bg-purple-300 text-black px-6 py-2 rounded-lg font-bold"
    >
      Download Sketch
    </a>
  </div>
)}

    </div>
  );
}

