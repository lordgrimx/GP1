/**
 * @file    SubjectDetailPage.tsx
 * @desc    Konu detay sayfası
 * @details Kullanıcının ders konularını görüntüleyebildiği, yetkinlik seviyesini belirleyebildiği ve AI destekli konu anlatımı alabildiği sayfa
 */
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { Book, ChevronDown } from 'lucide-react';
import { getSubjectById, updateSubjectProficiency, getUserIntelligence } from '../api/api';
import { showToast } from '../utils/toast';
import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * @interface Subject
 * @desc     Konu verisi için tip tanımlaması
 * 
 * @property {string} _id - Konunun benzersiz kimliği
 * @property {string} Lesson - Ders adı
 * @property {number} questionNumber - Soru sayısı
 * @property {Object} Subjects - Alt konular ve zorluk seviyeleri
 * @property {Object} proficiencyLevels - Yetkinlik seviyeleri
 */
interface Subject {
  _id: string;
  Lesson: string;
  questionNumber: number;
  Subjects: {
    [key: string]: string | { [key: string]: string };
  };
  proficiencyLevels?: {
    [key: string]: number;
  };
}

/**
 * @interface ProficiencyLevel
 * @desc     Yetkinlik seviyesi verisi için tip tanımlaması
 */
interface ProficiencyLevel {
  [key: string]: number;
}

/**
 * @interface Intelligence
 * @desc     Zeka türü verisi için tip tanımlaması
 */
interface Intelligence {
  type: string;
  score: number;
}

/**
 * @component SubjectDetailPage
 * @desc     Konu detaylarını ve AI destekli konu anlatımını yöneten bileşen
 * @returns  {JSX.Element} Konu detay sayfası yapısı
 * 
 * @states
 * - subject: Konu detay verisi
 * - loading: Sayfa yükleme durumu
 * - showProficiency: Yetkinlik seçimi görünürlüğü
 * - proficiencyLevels: Yetkinlik seviyeleri
 * - userIntelligence: Kullanıcı zeka türleri
 * - aiResponse: AI yanıtı
 * - showResponseModal: AI yanıt modalı görünürlüğü
 */
const SubjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { theme } = useTheme();
  /**
   * @state States
   * @desc  Sayfa state'leri
   */
  const [subject, setSubject] = useState<Subject | null>(null);
  const [loading, setLoading] = useState(true);
  const [showProficiency, setShowProficiency] = useState<{ [key: string]: boolean }>({});
  const [proficiencyLevels, setProficiencyLevels] = useState<ProficiencyLevel>({});
  const [userIntelligence, setUserIntelligence] = useState<Intelligence[]>([]);
  const [aiResponse, setAIResponse] = useState<string>('');
  const [showResponseModal, setShowResponseModal] = useState(false);

  /**
   * @effect
   * @desc   Konu detaylarını getiren effect hook
   */
  useEffect(() => {
    const fetchSubject = async () => {
      try {
        const response = await getSubjectById(id!);
        setSubject(response.data);
        
        if (response.data.proficiencyLevels) {
          const levels = Object.entries(response.data.proficiencyLevels).reduce((acc, [key, value]) => {
            acc[key] = Number(value);
            return acc;
          }, {} as ProficiencyLevel);
          
          setProficiencyLevels(levels);
        }
      } catch (error) {
        console.error('Error fetching subject:', error);
        showToast.error('Konu bilgileri yüklenirken bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchSubject();
    }
  }, [id]);

  /**
   * @effect
   * @desc   Kullanıcı zeka türlerini getiren effect hook
   */
  useEffect(() => {
    const fetchUserIntelligence = async () => {
      try {
        const response = await getUserIntelligence();
        
        const intelligenceArray = Object.entries(response.data).map(([type, score]) => ({
          type,
          score: Number(score)
        }));
        
        setUserIntelligence(intelligenceArray);
        
      } catch (error) {
        console.error('Zeka türleri getirilemedi:', error);
        showToast.error('Zeka türleri yüklenirken bir hata oluştu');
      }
    };

    fetchUserIntelligence();
  }, []);

  /**
   * @function getTopThreeIntelligences
   * @desc     En yüksek üç zeka türünü döndüren fonksiyon
   * @returns  {Intelligence[]} En yüksek üç zeka türü
   */
  const getTopThreeIntelligences = () => {
    if (!userIntelligence || userIntelligence.length === 0) {
      return [
        { type: 'Belirsiz', score: 0 },
        { type: 'Belirsiz', score: 0 },
        { type: 'Belirsiz', score: 0 }
      ];
    }

    return [...userIntelligence]
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  };

  /**
   * @function getProficiencyLevel
   * @desc     Yetkinlik seviyesini metin olarak döndüren fonksiyon
   * @param    {number} level - Yetkinlik seviyesi
   * @returns  {string} Yetkinlik seviyesi metni
   */
  const getProficiencyLevel = (level: number) => {
    switch(level) {
      case 1: return "very low";
      case 2: return "low";
      case 3: return "intermediate";
      case 4: return "good";
      case 5: return "very good";
      default: return "undefined";
    }
  };

  /**
   * @function handleProficiencySelect
   * @desc     Yetkinlik seviyesi seçimini işleyen fonksiyon
   * @async
   */
  const handleProficiencySelect = async (topicName: string, level: number) => {
    try {
      const response = await updateSubjectProficiency(id!, topicName, level);
      
      if (response.data) {
        setProficiencyLevels(prev => ({
          ...prev,
          [topicName]: level
        }));
        
        setShowProficiency(prev => ({
          ...prev,
          [topicName]: false
        }));
        
        showToast.success('Seviye başarıyla kaydedildi');
      }
    } catch (error) {
      console.error('Seviye kaydedilirken hata:', error);
      showToast.error('Seviye kaydedilirken bir hata oluştu');
    }
  };

   /**
   * @function handleTeachSubject
   * @desc     AI destekli konu anlatımını başlatan fonksiyon
   * @async
   */
  const handleTeachSubject = async (topicName: string) => {
    try {
      const topIntelligences = getTopThreeIntelligences();
      const proficiencyLevel = getProficiencyLevel(proficiencyLevels[topicName] || 0);
      const mainLesson = subject?.Lesson || "";

      const prompt = `You are a High School Teacher who provides the best explanation according to the student's intelligence types. Never forget that you are teaching to a high school student. I want you to be as explanatory and detailed as possible.

Student's intelligence types are as follows:
1. ${topIntelligences[0]?.type || 'Undefined'}
2. ${topIntelligences[1]?.type || 'Undefined'}
3. ${topIntelligences[2]?.type || 'Undefined'}

The student has a ${proficiencyLevel} knowledge level in the "${topicName}" topic of ${mainLesson} course. Based on all this information, I want you to provide a comprehensive lesson explanation.

IMPORTANT: Please provide your response in Turkish language.`;

      setLoading(true);

      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_API_KEY);
      const geminiModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

      const result = await geminiModel.generateContent([prompt]);
      const response = await result.response;
      const text = response.text();
      
      setAIResponse(text);
      setShowResponseModal(true);

    } catch (error) {
      console.error('Gemini API hatası:', error);
      showToast.error('Konu anlatımı alınırken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!subject) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl">Ders bulunamadı</h1>
      </div>
    );
  }

  return (
    <>
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className={`text-4xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {subject.Lesson}
            </h1>
            <p className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              {`${Object.keys(subject.Subjects).length} konu, ${subject.questionNumber} soru`}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid gap-6"
          >
            {Object.entries(subject?.Subjects || {}).map(([topic, difficulty], index) => {
              const difficultyColor = typeof difficulty === 'string' 
                ? difficulty === 'Kolay' 
                  ? 'green' 
                  : difficulty === 'Orta' 
                    ? 'yellow' 
                    : 'red'
                : 'blue';

              return (
                <motion.div
                  key={topic}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-6 rounded-xl shadow-lg ${
                    theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                  } transition-all duration-300`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-full bg-${difficultyColor}-100 dark:bg-${difficultyColor}-900/30`}>
                        <Book className={`w-6 h-6 text-${difficultyColor}-500`} />
                      </div>
                      <div>
                        <h3 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          {topic}
                        </h3>
                        <p className={`mt-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                          Zorluk: {typeof difficulty === 'string' ? difficulty : 'Karma'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => setShowProficiency(prev => ({
                          ...prev,
                          [topic]: !prev[topic]
                        }))}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                      >
                        <ChevronDown className={`w-5 h-5 transition-transform ${
                          showProficiency[topic] ? 'transform rotate-180' : ''
                        }`} />
                      </button>
                      <button
                        disabled={!proficiencyLevels[topic]}
                        onClick={() => handleTeachSubject(topic)}
                        className={`px-4 py-2 rounded ${
                          proficiencyLevels[topic]
                            ? 'bg-blue-500 text-white hover:bg-blue-600'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        Konuyu Anlat
                      </button>
                    </div>
                  </div>

                  {showProficiency[topic] && (
                    <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <h4 className="mb-3 text-sm font-medium">Bu konuya ne kadar hakimsiniz?</h4>
                      <div className="flex flex-wrap gap-2">
                        {[1, 2, 3, 4, 5].map((level) => (
                          <button
                            key={level}
                            onClick={() => handleProficiencySelect(topic, level)}
                            className={`px-4 py-2 rounded ${
                              proficiencyLevels[topic] === level
                                ? 'bg-blue-500 text-white'
                                : 'bg-white dark:bg-gray-600 hover:bg-gray-100 dark:hover:bg-gray-500'
                            }`}
                          >
                            {level === 1 && 'Hiç Bilmiyorum'}
                            {level === 2 && 'Az Biliyorum'}
                            {level === 3 && 'Orta Düzey'}
                            {level === 4 && 'İyi Biliyorum'}
                            {level === 5 && 'Çok İyi Biliyorum'}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
      
      {showResponseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={`bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Konu Anlatımı</h3>
              <button
                onClick={() => setShowResponseModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="prose dark:prose-invert max-w-none">
              {aiResponse.split('\n').map((line, index) => (
                <p key={index}>{line}</p>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SubjectDetailPage; 