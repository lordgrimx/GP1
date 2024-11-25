import React, { useState, useEffect } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";

interface CameraButtonProps {
  apiKey: string;
  model: string;
  className?: string;
  onCapture?: (text: string) => void;
}

const CameraButton: React.FC<CameraButtonProps> = ({ apiKey, model, className = '', onCapture }) => {
  useEffect(() => {
    console.log("CameraButton mounted with apiKey:", apiKey);
  }, [apiKey]);

  const [isOpen, setIsOpen] = useState(false);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string>("");
  const [error, setError] = useState<string>("");
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [showCamera, setShowCamera] = useState(false);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsLoading(true);
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64Data = (e.target?.result as string).split(',')[1];
        const imagePart = {
          inlineData: {
            data: base64Data,
            mimeType: "image/jpeg"
          }
        };

        try {
          const genAI = new GoogleGenerativeAI(apiKey);
          const genModel = genAI.getGenerativeModel({ model: model });
          
          const result = await genModel.generateContent([
            imagePart,
            `First analyze this math problem image in detail. Then provide the solution in Turkish using this format:

            1. Kullanılacak formüller (varsa)
            2. Çözüm adımları
            3. Sonuç
            
            Her adımı detaylı açıkla ve matematiksel işlemleri göster.`
          ]);
          
          const response = await result.response;
          const text = response.text();
          
          if (text) {
            setResult(text);
            if (onCapture) onCapture(text);
          }
        } catch (error) {
          console.error('Resim analizi sırasında hata:', error);
          setError('Resim analizi sırasında bir hata oluştu');
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Dosya okuma hatası:', error);
      setError('Dosya okuma sırasında bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleCamera = () => {
    if (showCamera) {
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
        setMediaStream(null);
      }
      setShowCamera(false);
    }
    setIsOpen(!isOpen);
  };

  const handleCameraClick = async () => {
    try {
      setShowCamera(true);
      setIsOpen(false);
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      setMediaStream(stream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Kamera erişim hatası:', error);
    }
  };

  const captureAndAnalyze = async () => {
    if (!videoRef.current) return;
    
    try {
      setIsLoading(true);
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(videoRef.current, 0, 0);
      
      const base64Data = canvas.toDataURL('image/jpeg').split(',')[1];
      const genAI = new GoogleGenerativeAI(apiKey);
      const genModel = genAI.getGenerativeModel({ model: model });
      
      const result = await genModel.generateContent([
        { inlineData: { data: base64Data, mimeType: "image/jpeg" } },
        `First analyze this math problem image in detail. Then provide the solution in Turkish using this format:

        1. Kullanılacak formüller (varsa)
        2. Çözüm adımları
        3. Sonuç
        
        Her adımı detaylı açıkla ve matematiksel işlemleri göster.`
      ]);
      
      const response = await result.response;
      const text = response.text();
      
      if (text) {
        setResult(text);
        if (onCapture) onCapture(text);
      }
      
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
      }
      setShowCamera(false);
      
    } catch (error) {
      console.error('Görüntü analizi sırasında hata:', error);
      setError('Görüntü analizi sırasında bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  console.log('API Key:', import.meta.env.VITE_API_KEY);

  return (
    <div className={className}>
      <div className="relative group ml-20">
        <button 
          onClick={handleToggleCamera}
          className="bg-blue-600 p-3 rounded-full text-white"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
            />
          </svg>
        </button>

        {isOpen && !showCamera && (
          <div className="absolute bottom-full right-0 mb-2 bg-white rounded-lg shadow-lg p-2 z-10 min-w-[200px]">
            <button 
              onClick={handleCameraClick}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded"
            >
              <span className="flex items-center gap-2">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5 mr-2" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" 
                  />
                </svg>
                <span>Kamera ile Çek</span>
              </span>
            </button>
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="image/*"
              className="hidden"
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded"
            >
              <span className="flex items-center gap-2">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5 mr-2" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" 
                  />
                </svg>
                <span>Dosyadan Yükle</span>
              </span>
            </button>
          </div>
        )}
      </div>

      {(showCamera || result) && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg w-full max-w-lg max-h-[90vh] flex flex-col">
            {showCamera && (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  style={{
                    width: '100%',
                    height: 'auto',
                    maxHeight: '50vh'
                  }}
                  className="rounded-lg"
                />
                <div className="mt-4 flex justify-between">
                  <button
                    onClick={handleToggleCamera}
                    className="px-4 py-2 bg-red-500 text-white rounded"
                  >
                    Kamerayı Kapat
                  </button>
                  <button
                    onClick={captureAndAnalyze}
                    disabled={isLoading}
                    className="px-4 py-2 bg-green-500 text-white rounded disabled:bg-gray-400"
                  >
                    {isLoading ? 'Analiz ediliyor...' : 'Çek ve Çöz'}
                  </button>
                </div>
              </>
            )}

            {result && (
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold">Çözüm:</h3>
                  <div className="flex gap-2">
                    {!showCamera && (
                      <button
                        onClick={handleCameraClick}
                        className="px-3 py-1 bg-blue-500 text-white rounded"
                      >
                        Kamerayı Aç
                      </button>
                    )}
                    <button
                      onClick={() => setResult("")}
                      className="px-3 py-1 bg-gray-500 text-white rounded"
                    >
                      Kapat
                    </button>
                  </div>
                </div>
                <div className="overflow-y-auto flex-grow" style={{ maxHeight: 'calc(80vh - 100px)' }}>
                  <p className="whitespace-pre-wrap">{result}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}
    </div>
  );
};

export default CameraButton; 