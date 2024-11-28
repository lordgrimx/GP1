/**
 * @file    SolvedQuestionsPage.tsx
 * @desc    Çözülmüş sorular sayfası
 * @details Kullanıcının çözdüğü soruları, çözümlerini ve tarihlerini görüntüleyebildiği sayfa
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Clock, Search, ChevronDown, ChevronUp } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { getUserQuestions } from '../api/api';
import ReactMarkdown from 'react-markdown';
import { showToast } from '../utils/toast';

/**
 * @interface Question
 * @desc     Çözülmüş soru verisi için tip tanımlaması
 * 
 * @property {string} _id - Sorunun benzersiz kimliği
 * @property {string} imageData - Soru görselinin base64 formatında verisi
 * @property {string} solution - Sorunun çözümü
 * @property {string} createdAt - Çözüm tarihi
 */
interface Question {
  _id: string;
  imageData: string;
  solution: string;
  createdAt: string;
}

/**
 * @component SolvedQuestionsPage
 * @desc     Çözülmüş soruları listeleyen ve filtreleme imkanı sunan bileşen
 * @returns  {JSX.Element} Çözülmüş sorular sayfası yapısı
 * 
 * @states
 * - questions: Tüm çözülmüş sorular listesi
 * - loading: Sayfa yükleme durumu
 * - searchTerm: Arama filtresi
 * - sortOrder: Sıralama düzeni (asc/desc)
 * 
 * @animations
 * - containerVariants: Liste animasyonu için kapsayıcı varyantları
 * - itemVariants: Her bir soru kartı için animasyon varyantları
 * 
 * @sections
 * - Search Bar: Çözüm arama alanı
 * - Sort Button: Tarih sıralama butonu
 * - Question List: Çözülmüş sorular listesi
 */
const SolvedQuestionsPage: React.FC = () => {
  const { theme } = useTheme();

  /**
   * @state questions
   * @desc  Çözülmüş soruları tutan state
   */
  const [questions, setQuestions] = useState<Question[]>([]);

  /**
   * @state loading
   * @desc  Sayfa yükleme durumunu kontrol eden state
   */
  const [loading, setLoading] = useState(true);

  /**
   * @state searchTerm
   * @desc  Arama filtresini tutan state
   */
  const [searchTerm, setSearchTerm] = useState('');

  /**
   * @state sortOrder
   * @desc  Sıralama düzenini tutan state
   */
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  /**
   * @effect
   * @desc   Sayfa yüklendiğinde soruları getiren effect hook
   */
  useEffect(() => {
    fetchQuestions();
  }, []);

  /**
   * @function fetchQuestions
   * @desc     Çözülmüş soruları API'den çeken asenkron fonksiyon
   * @async
   */
  const fetchQuestions = async () => {
    try {
      const response = await getUserQuestions();
      setQuestions(response.data);
    } catch (error) {
      showToast.error('Sorular yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  /**
   * @constant filteredQuestions
   * @desc    Arama terimine göre filtrelenmiş sorular
   */
  const filteredQuestions = questions.filter(question =>
    question.solution.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /**
   * @constant sortedQuestions
   * @desc    Tarihe göre sıralanmış sorular
   */
  const sortedQuestions = [...filteredQuestions].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
  });

  /**
   * @constant containerVariants
   * @desc    Liste animasyonu için kapsayıcı varyantları
   */
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  /**
   * @constant itemVariants
   * @desc    Her bir soru kartı için animasyon varyantları
   */
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className={`min-h-screen p-6 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'}`}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        <h1 className="text-3xl font-bold mb-8">Çözülmüş Sorularım</h1>

        {/* Arama ve Filtreleme */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center">
          <div className={`relative flex-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Çözümlerde ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                theme === 'dark'
                  ? 'bg-gray-800 border-gray-700 text-white'
                  : 'bg-white border-gray-300'
              } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            />
          </div>
          <button
            onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              theme === 'dark'
                ? 'bg-gray-800 hover:bg-gray-700'
                : 'bg-white hover:bg-gray-100'
            } transition-colors duration-200`}
          >
            <Clock className="w-5 h-5" />
            {sortOrder === 'desc' ? <ChevronDown /> : <ChevronUp />}
          </button>
        </div>

        {/* Soru Listesi */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner />
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid gap-6"
          >
            <AnimatePresence>
              {sortedQuestions.map((question) => (
                <motion.div
                  key={question._id}
                  variants={itemVariants}
                  layout
                  className={`rounded-xl shadow-lg overflow-hidden ${
                    theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                  }`}
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="text-sm text-gray-500">
                        {format(new Date(question.createdAt), 'd MMMM yyyy, HH:mm', { locale: tr })}
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Soru Görüntüsü */}
                      <div className="relative aspect-square rounded-lg overflow-hidden">
                        <img
                          src={`data:image/jpeg;base64,${question.imageData}`}
                          alt="Soru"
                          className="w-full h-full object-contain"
                        />
                      </div>

                      {/* Çözüm */}
                      <div className={`p-4 rounded-lg ${
                        theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                      }`}>
                        <h3 className="font-semibold mb-2">Çözüm:</h3>
                        <ReactMarkdown className="prose-sm max-w-none">
                          {question.solution}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Sonuç bulunamadı mesajı */}
        {!loading && sortedQuestions.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-gray-500">Henüz çözülmüş soru bulunmuyor.</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default SolvedQuestionsPage;