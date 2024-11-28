/**
 * @file    SubjectsPage.tsx
 * @desc    Dersler ana sayfası
 * @details Kullanıcının tüm dersleri, konuları ve soru sayılarını görüntüleyebildiği ana sayfa
 */

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { Book, Calculator, BeakerIcon, Globe, Brain } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getSubjects } from '../api/api';

/**
 * @interface Subject
 * @desc     Ders verisi için tip tanımlaması
 * 
 * @property {string} _id - Dersin benzersiz kimliği
 * @property {string} Lesson - Ders adı
 * @property {number} questionNumber - Toplam soru sayısı
 * @property {Object} Subjects - Konular ve alt konular
 */
interface Subject {
  _id: string;
  Lesson: string;
  questionNumber: number;
  Subjects: {
    [key: string]: string | { [key: string]: string };
  };
}

/**
 * @component SubjectsPage
 * @desc     Tüm dersleri listeleyen ana bileşen
 * @returns  {JSX.Element} Dersler sayfası yapısı
 * 
 * @states
 * - subjects: Tüm dersler listesi
 * - loading: Sayfa yükleme durumu
 * 
 * @sections
 * - Hero Section: Başlık ve açıklama
 * - Subjects Grid: Ders kartları grid yapısı
 */
const SubjectsPage: React.FC = () => {
  const { theme } = useTheme();

  /**
   * @state subjects
   * @desc  Dersleri tutan state
   */
  const [subjects, setSubjects] = useState<Subject[]>([]);

  /**
   * @state loading
   * @desc  Sayfa yükleme durumunu kontrol eden state
   */
  const [loading, setLoading] = useState(true);

  /**
   * @effect
   * @desc   Sayfa yüklendiğinde dersleri getiren effect hook
   */
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await getSubjects();
        setSubjects(response.data);
      } catch (error) {
        console.error('Error fetching subjects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, []);

  /**
   * @function getSubjectIcon
   * @desc     Ders adına göre ikon döndüren yardımcı fonksiyon
   * @param    {string} lessonName - Ders adı
   * @returns  {JSX.Element} Ders ikonu
   */
  const getSubjectIcon = (lessonName: string) => {
    switch (lessonName) {
      case 'TYT Türkçe':
        return <Book className="w-8 h-8" />;
      case 'TYT Matematik':
        return <Calculator className="w-8 h-8" />;
      case 'TYT Fizik':
      case 'TYT Kimya':
      case 'TYT Biyoloji':
        return <BeakerIcon className="w-8 h-8" />;
      case 'TYT Tarih':
      case 'TYT Coğrafya':
        return <Globe className="w-8 h-8" />;
      case 'TYT Felsefe':
        return <Brain className="w-8 h-8" />;
      default:
        return <Book className="w-8 h-8" />;
    }
  };

  /**
   * @function getSubjectColor
   * @desc     Ders adına göre renk döndüren yardımcı fonksiyon
   * @param    {string} lessonName - Ders adı
   * @returns  {string} Renk kodu
   */
  const getSubjectColor = (lessonName: string) => {
    switch (lessonName) {
      case 'TYT Türkçe': return 'blue';
      case 'TYT Matematik': return 'red';
      case 'TYT Fizik': return 'purple';
      case 'TYT Kimya': return 'green';
      case 'TYT Biyoloji': return 'pink';
      case 'TYT Tarih': return 'yellow';
      case 'TYT Coğrafya': return 'indigo';
      case 'TYT Felsefe': return 'orange';
      default: return 'gray';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12 px-4"
      >
        <h1 className={`text-4xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          YKS Konu Anlatımları
        </h1>
        <p className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
          Detaylı konu anlatımları ve soru çözümleriyle YKS'ye hazırlanın
        </p>
      </motion.div>

      {/* Subjects Grid */}
      <motion.div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subject) => (
            <motion.div
              key={subject._id}
              whileHover={{ scale: 1.03 }}
              className={`p-6 rounded-xl shadow-lg ${
                theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'
              } transition-all duration-300`}
            >
              <Link to={`/subjects/${subject._id}`} className="block">
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-full bg-${getSubjectColor(subject.Lesson)}-100 dark:bg-${getSubjectColor(subject.Lesson)}-900/30`}>
                    {getSubjectIcon(subject.Lesson)}
                  </div>
                  <div>
                    <h3 className={`text-xl font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {subject.Lesson}
                    </h3>
                    <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                      {`${Object.keys(subject.Subjects).length} konu, ${subject.questionNumber} soru`}
                    </p>
                    <div className="mt-4 flex items-center text-blue-500">
                      <span className="text-sm font-medium">Konuları Gör</span>
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default SubjectsPage;
