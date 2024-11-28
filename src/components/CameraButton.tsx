import React, { useState, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import { Camera, X, History, ChevronDown, ChevronUp } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { toast } from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { saveQuestionWithSolution, getUserQuestions } from '../api/api';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { motion } from 'framer-motion';

interface CameraButtonProps {
  apiKey: string;
  model: string;
  className?: string;
}
type TabValue = 'camera' | 'history';

interface SolvedQuestion {
  _id: string;
  imageData: string;
  solution: string;
  createdAt: string;
}

const QuestionCard: React.FC<{ question: SolvedQuestion; index: number }> = ({ question, index }) => {
  const { theme } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className={`p-4 rounded-lg border transition-all duration-300 ${
        theme === 'dark' 
          ? 'bg-gray-700 border-gray-600 hover:border-gray-500' 
          : 'bg-white border-gray-200 hover:border-gray-300'
      }`}
    >
      <div 
        className="cursor-pointer flex items-center justify-between gap-4"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="w-32 h-24 flex-shrink-0">
          <img
            src={question.imageData.startsWith('data:') 
              ? question.imageData 
              : `data:image/jpeg;base64,${question.imageData}`}
            alt={`Soru ${index + 1}`}
            className="w-full h-full object-contain rounded-lg"
          />
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-sm text-gray-500">
            {new Date(question.createdAt).toLocaleDateString('tr-TR')}
          </span>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </div>
      </div>

      <motion.div
        initial={false}
        animate={{ height: isExpanded ? 'auto' : 0, opacity: isExpanded ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        {isExpanded && (
          <div className="mt-4">
            <div className="prose dark:prose-invert max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {question.solution}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

const CameraButton: React.FC<CameraButtonProps> = ({ apiKey, model, className = '' }) => {
  const { theme } = useTheme();
  const webcamRef = useRef<Webcam>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<TabValue>('camera');
  const [solvedQuestions, setSolvedQuestions] = useState<SolvedQuestion[]>([]);
  const [showSolution, setShowSolution] = useState(false);

  useEffect(() => {
    const fetchSolvedQuestions = async () => {
      try {
        const response = await getUserQuestions();
        setSolvedQuestions(response.data);
      } catch (error) {
        console.error('Çözülen sorular getirilemedi:', error);
        toast.error('Çözülen sorular yüklenirken bir hata oluştu');
      }
    };

    if (showCamera || activeTab === 'history') {
      fetchSolvedQuestions();
    }
  }, [showCamera, activeTab]);

  const handleCapture = async () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        await processImage(imageSrc.split(',')[1]);
      }
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = (reader.result as string).split(',')[1];
        await processImage(base64String);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('Dosya yükleme hatası:', err);
      toast.error('Dosya yüklenirken bir hata oluştu');
      setLoading(false);
    }
  };

  const processImage = async (base64Data: string) => {
    try {
      setLoading(true);
      const genAI = new GoogleGenerativeAI(apiKey);
      const geminiModel = genAI.getGenerativeModel({ model: model });

      const validationResult = await geminiModel.generateContent([
        "What is the probability (as a percentage between 0-100) that this image is a TYT/AYT exam question? Please respond with only the number.",
        { inlineData: { data: base64Data, mimeType: "image/jpeg" } },
      ]);

      const probabilityText = validationResult.response.text().replace(/[^0-9]/g, '');
      const probability = parseInt(probabilityText);

      if (probability < 60) {
        toast.error('Bu bir TYT/AYT sorusu değil. Lütfen geçerli bir soru fotoğrafı yükleyin.');
        setLoading(false);
        return;
      }

      const result = await geminiModel.generateContent([
        `You are an experienced and patient high school teacher explaining a TYT/AYT question to a high school student. 
        Please analyze this exam question and provide a detailed, step-by-step solution using the following markdown format:
        
        ### Sorunun konusu ve Önemi
        [Sorunun kısa bir açıklaması ve Sınavda ne kadar önemli olduğu]
        
        ### Soru Analizi
        [Sorunun kısa bir analizi ve ne sorduğu]

        ### Çözüm Adımları
        1. [İlk adım]
        2. [İkinci adım]
        ...

        ### Sonuç
        [Final cevap ve kısa açıklama]

        ### İpucu
        [Benzer sorular için pratik bir ipucu]`,
        { inlineData: { data: base64Data, mimeType: "image/jpeg" } },
      ]);

      const response = await result.response;
      const solution = response.text();
      
      setAnalysisResult(solution);
      setShowSolution(true);
      setShowCamera(false);

      if (solution) {
        await saveQuestionWithSolution({
          imageData: `data:image/jpeg;base64,${base64Data}`,
          solution: solution
        });
        
        const response = await getUserQuestions();
        setSolvedQuestions(response.data);
      }

    } catch (err) {
      console.error('Görüntü işleme hatası:', err);
      toast.error('Görüntü işlenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowCamera(true)}
        className={`fixed bottom-8 right-8 p-4 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors ${className}`}
      >
        <Camera className="w-6 h-6" />
      </button>

      {showCamera && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className={`w-full max-w-4xl p-4 rounded-lg shadow-lg ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="relative">
              <button
                onClick={() => setShowCamera(false)}
                className="absolute right-0 top-0 p-2"
              >
                <X className="w-6 h-6" />
              </button>

              <Tabs
                defaultValue="camera"
                value={activeTab}
                onValueChange={(value: string) => setActiveTab(value as TabValue)}
              >
                <TabsList className="w-full mb-4">
                  <TabsTrigger value="camera" className="flex-1">
                    <Camera className="w-4 h-4 mr-2" />
                    Kamera
                  </TabsTrigger>
                  <TabsTrigger value="history" className="flex-1">
                    <History className="w-4 h-4 mr-2" />
                    Önceki Sorular
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="camera">
                  <div className="space-y-4">
                    <Webcam
                      audio={false}
                      ref={webcamRef}
                      screenshotFormat="image/jpeg"
                      className="w-full rounded-lg"
                    />
                    <div className="flex justify-center gap-4">
                      <button
                        onClick={handleCapture}
                        disabled={loading}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        {loading ? 'İşleniyor...' : 'Fotoğraf Çek'}
                      </button>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        accept="image/*"
                        className="hidden"
                      />
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={loading}
                        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                      >
                        Dosyadan Seç
                      </button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="history">
                  <div className="grid grid-cols-1 gap-4 max-h-[70vh] overflow-y-auto p-4">
                    {solvedQuestions.map((question, index) => (
                      <QuestionCard
                        key={question._id}
                        question={question}
                        index={index}
                      />
                    ))}
                    {solvedQuestions.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        Henüz çözülmüş soru bulunmuyor.
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      )}

      {showSolution && analysisResult && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-50">
          <div className={`w-full max-w-2xl p-6 rounded-lg shadow-lg ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Soru Çözümü</h2>
              <button
                onClick={() => {
                  setShowSolution(false);
                  setAnalysisResult(null);
                }}
                className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className={`prose dark:prose-invert max-w-none overflow-y-auto max-h-[70vh] ${
              theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
            } p-4 rounded-lg`}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {analysisResult}
              </ReactMarkdown>
            </div>
            <div className="mt-4 flex justify-end gap-4">
              <button
                onClick={() => {
                  setShowSolution(false);
                  setAnalysisResult(null);
                  setShowCamera(true);
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-2"
              >
                <Camera className="w-4 h-4" />
                Yeni Soru Çek
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CameraButton;