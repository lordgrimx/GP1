import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Edit2, Trash2, ChevronDown, Link } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { getTestTracks, addTestTrack, updateTestTrack, deleteTestTrack, getTYTSubjects, Track, TestTrackRequest, getLinkedTestTracks } from '../api/api';
import toast from 'react-hot-toast';

// Form state için interface'i güncelle
interface FormState {
  examName: string;
  examType: 'TYT' | 'AYT';
  aytField?: 'Sayısal' | 'Sözel' | 'Eşit Ağırlık' | 'Yabancı Dil';
  linkedExamId?: string;
  subjects: Track['subjects'];
}

// Ders başına maksimum soru sayıları
const MAX_QUESTIONS = {
  'TYT Türkçe': 40,
  'TYT Matematik': 32,
  'TYT Geometri': 8,
  'TYT Fizik': 7,
  'TYT Kimya': 7,
  'TYT Biyoloji': 6,
  'TYT Tarih': 5,
  'TYT Coğrafya': 5,
  'TYT Din Kültürü ve Ahlak Bilgisi': 5,
  'TYT Felsefe': 5,
  
  'AYT Matematik': 40,
  'AYT Fizik': 14,
  'AYT Kimya': 13,
  'AYT Biyoloji': 13,
  'AYT Edebiyat': 24,
  'AYT Tarih-1': 10,
  'AYT Coğrafya-1': 6,
  'AYT Tarih-2': 11,
  'AYT Coğrafya-2': 11,
  'AYT İngilizce': 80
} as const;

// AYT alan derslerini tanımla
const AYT_FIELD_SUBJECTS = {
  'Sayısal': ['AYT Matematik', 'AYT Fizik', 'AYT Kimya', 'AYT Biyoloji'],
  'Sözel': ['AYT Edebiyat', 'AYT Tarih-1', 'AYT Coğrafya-1', 'AYT Tarih-2', 'AYT Coğrafya-2'],
  'Eşit Ağırlık': ['AYT Matematik', 'AYT Edebiyat', 'AYT Tarih-1', 'AYT Coğrafya-1'],
  'Yabancı Dil': ['AYT İngilizce']
};

const initialFormState: FormState = {
  examName: '',
  examType: 'TYT',
  linkedExamId: undefined,
  subjects: {}
};

// Bağlı denemeleri takip eden custom hook
const useLinkedExamsScore = (tracks: Track[]) => {
  const [linkedScores, setLinkedScores] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    const calculateLinkedScores = () => {
      const newScores: { [key: string]: number } = {};

      // Debug: Tüm track'leri kontrol et
      console.log('Mevcut tracks:', tracks.map(t => ({
        id: t._id,
        name: t.examName,
        type: t.examType,
        linkedId: t.linkedExamId,
        score: t.examScore
      })));

      // TYT ve AYT denemelerini eşleştir
      tracks.forEach(track => {
        // Eğer bu deneme için yerleştirme puanı zaten hesaplanmışsa atla
        if (newScores[track._id]) return;

        // Diğer tip denemeleri bul
        const otherTracks = tracks.filter(t => 
          t.examType !== track.examType && 
          !newScores[t._id]
        );

        // Eşleşen denemeyi bul
        const matchingTrack = otherTracks.find(t => 
          (t._id === track.linkedExamId) || (t.linkedExamId === track._id)
        );

        if (matchingTrack) {
          console.log('Eşleşen denemeler bulundu:', {
            exam1: {
              name: track.examName,
              type: track.examType,
              score: track.examScore
            },
            exam2: {
              name: matchingTrack.examName,
              type: matchingTrack.examType,
              score: matchingTrack.examScore
            }
          });

          // TYT ve AYT denemelerini belirle
          const tytExam = track.examType === 'TYT' ? track : matchingTrack;
          const aytExam = track.examType === 'AYT' ? track : matchingTrack;

          // Puanları kontrol et ve hesapla
          if (tytExam.examScore && aytExam.examScore) {
            const finalScore = parseFloat(
              (tytExam.examScore * 0.4 + aytExam.examScore * 0.6).toFixed(2)
            );

            // Her iki deneme için de aynı yerleştirme puanını kaydet
            newScores[track._id] = finalScore;
            newScores[matchingTrack._id] = finalScore;

            console.log('Hesaplanan yerleştirme puanı:', {
              finalScore,
              savedFor: [track._id, matchingTrack._id]
            });
          }
        }
      });

      console.log('Hesaplanan tüm puanlar:', newScores);
      setLinkedScores(newScores);
    };

    if (tracks.length > 0) {
      calculateLinkedScores();
    }
  }, [tracks]);

  return linkedScores;
};

// API yanıt tipi için interface
interface LinkedPair {
  exam1: Track;
  exam2: Track;
  finalScore: number;
}

const TestTrackPage: React.FC = () => {
  const { theme } = useTheme();
  const [tracks, setTracks] = useState<Track[]>([]);
  const [linkedPairs, setLinkedPairs] = useState<{[key: string]: number}>({});
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTrackId, setEditingTrackId] = useState<string | null>(null);
  const [availableSubjects, setAvailableSubjects] = useState<string[]>([]);
  const [openTrackId, setOpenTrackId] = useState<string | null>(null);
  
  // Sınav türü ve alan seçimi için ayrı state
  const [examType, setExamType] = useState<FormState['examType']>('TYT');
  const [aytField, setAytField] = useState<FormState['aytField']>();
  
  // Form verisi için ayrı state
  const [formData, setFormData] = useState<FormState>(initialFormState);

  // Bağlı denemelerin yerleştirme puanlarını takip et
  const linkedScores = useLinkedExamsScore(tracks);

  // Verileri getir
  const [linkedResponse, setLinkedResponse] = useState<{ data: LinkedPair[] } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Normal denemeleri getir
        const tracksResponse = await getTestTracks();
        setTracks(tracksResponse.data);

        // Bağlı denemeleri getir
        const linkedResp = await getLinkedTestTracks();
        setLinkedResponse(linkedResp);
        
      } catch (error) {
        console.error('Veri getirme hatası:', error);
        toast.error('Denemeler yüklenirken bir hata oluştu');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Sadece sınav türü ve alan değişikliklerinde tetiklenecek
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        if (examType === 'TYT') {
          const response = await getTYTSubjects();
          setAvailableSubjects(response.data.map((subject: any) => subject.Lesson));
        } else if (examType === 'AYT' && aytField) {
          setAvailableSubjects([...AYT_FIELD_SUBJECTS[aytField]]);
        }
      } catch (error) {
        toast.error('Dersler yüklenirken bir hata oluştu');
      }
    };

    fetchSubjects();
  }, [examType, aytField]); // Sadece bu değerler değiştiğinde tetiklen

  // Sınav türü değiştiğinde
  const handleExamTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value as FormState['examType'];
    setExamType(newType);
    setFormData(prev => ({
      ...prev,
      examType: newType,
      aytField: undefined,
      subjects: {}
    }));
  };

  // AYT alanı değiştiğinde
  const handleAYTFieldChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newField = e.target.value as FormState['aytField'];
    setAytField(newField);
    setFormData(prev => ({
      ...prev,
      aytField: newField,
      subjects: {}
    }));
  };

  // Track düzenleme işlevi
  const handleEdit = (track: Track) => {
    setEditingTrackId(track._id);
    setFormData({
      examName: track.examName,
      examType: track.examType,
      aytField: track.aytField,
      subjects: { ...track.subjects }
    });
    setShowForm(true);
  };

  const handleAddNew = () => {
    if (showForm) {
      // Form zaten açıksa, kapat ve state'i temizle
      setEditingTrackId(null);
      setFormData(initialFormState);
      setShowForm(false);
    } else {
      // Form kapalıysa, aç
      setEditingTrackId(null);
      setFormData({ ...initialFormState, examType: 'TYT' }); // TYT'yi varsayılan olarak ayarla
      setShowForm(true);
    }
  };

  // Track silme işlevi
  const handleDelete = async (id: string) => {
    try {
      await deleteTestTrack(id);
      setTracks(tracks.filter(track => track._id !== id));
      toast.success('Deneme başarıyla silindi');
    } catch (error) {
      toast.error('Deneme silinirken bir hata oluştu');
    }
  };

  // Dropdown toggle handler
  const handleToggleTrack = (trackId: string) => {
    setOpenTrackId(openTrackId === trackId ? null : trackId);
  };

  // Bağlı deneme seçimi için modal bileşeni
  const LinkExamModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    currentExam: Track;
    availableExams: Track[];
    onLink: (linkedExamId: string) => void;
  }> = ({ isOpen, onClose, currentExam, availableExams, onLink }) => {
    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <div className={`bg-white dark:bg-gray-800 rounded-lg p-6 w-96 ${
              theme === 'dark' ? 'text-white' : 'text-gray-800'
            }`}>
              <h3 className="text-lg font-semibold mb-4">Deneme Bağla</h3>
              <div className="space-y-4">
                {availableExams
                  .filter(exam => 
                    exam._id !== currentExam._id && 
                    exam.examType !== currentExam.examType
                  )
                  .map(exam => (
                    <button
                      key={exam._id}
                      onClick={() => {
                        onLink(exam._id);
                        onClose();
                      }}
                      className="w-full p-3 text-left rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <div className="font-medium">{exam.examName}</div>
                      <div className="text-sm text-gray-500">
                        {exam.examType} {exam.examScore && `- ${exam.examScore} puan`}
                      </div>
                    </button>
                  ))}
              </div>
              <button
                onClick={onClose}
                className="mt-4 w-full p-2 bg-gray-200 dark:bg-gray-700 rounded-lg"
              >
                İptal
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  // TrackCard bileşenini güncelle
  const TrackCard: React.FC<{ track: Track }> = ({ track }) => {
    const [showLinkModal, setShowLinkModal] = useState(false);
    
    // Bağlı deneme çiftini bul
    const linkedPair = linkedResponse?.data.find((pair: LinkedPair) => 
      pair.exam1._id === track._id || pair.exam2._id === track._id
    );

    // Diğer denemeyi bul (eğer bir çift varsa)
    const otherExam = linkedPair 
      ? linkedPair.exam1._id === track._id 
        ? linkedPair.exam2 
        : linkedPair.exam1
      : null;

    return (
      <motion.div className={`border-l-4 ${linkedPair ? 'border-purple-500' : 'border-transparent'}`}>
        <div className="p-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-semibold">{track.examName}</h3>
              <div className="text-sm text-gray-500">
                {track.examType} {track.aytField && `- ${track.aytField}`}
                {otherExam && (
                  <span className="ml-2 text-purple-500">
                    Bağlı: {otherExam.examName}
                  </span>
                )}
              </div>
              <div className="mt-2 space-y-1">
                <div className="flex items-center gap-4">
                  <span className="text-blue-600 font-semibold">
                    Toplam Net: {track.totalNet?.toFixed(2)}
                  </span>
                  <span className="text-green-600 font-semibold">
                    Ham Puan: {track.examScore?.toFixed(2)}
                  </span>
                  {linkedPair && (
                    <span className="text-purple-600 font-semibold">
                      Yerleştirme: {linkedPair.finalScore}
                    </span>
                  )}
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div 
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      linkedPair ? 'bg-purple-600' : 'bg-green-600'
                    }`}
                    style={{ 
                      width: `${((linkedPair?.finalScore || track.examScore || 0) / 500) * 100}%` 
                    }}
                  />
                </div>
                <div className="text-xs text-gray-500 text-right">
                  500 üzerinden
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {!otherExam && (
                <button
                  onClick={() => setShowLinkModal(true)}
                  className="p-2 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900"
                  title="Deneme Bağla"
                >
                  <Link className="w-5 h-5 text-blue-500" />
                </button>
              )}
              <button
                onClick={() => handleEdit(track)}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <Edit2 className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleDelete(track._id)}
                className="p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900"
              >
                <Trash2 className="w-5 h-5 text-red-500" />
              </button>
              <button
                onClick={() => handleToggleTrack(track._id)}
                className={`p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-transform duration-300 ${
                  openTrackId === track._id ? 'rotate-180' : ''
                }`}
              >
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Dropdown içeriği */}
        <AnimatePresence>
          {openTrackId === track._id && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="mt-4 space-y-2">
                {Object.entries(track.subjects).map(([subject, data]) => (
                  <div 
                    key={subject}
                    className="p-3 rounded-lg bg-gray-100 dark:bg-gray-800"
                  >
                    <div className="font-medium mb-1">{subject}</div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="text-green-600">
                        Doğru: {data.correct}
                      </div>
                      <div className="text-red-600">
                        Yanlış: {data.incorrect}
                      </div>
                      <div className="text-gray-600">
                        Boş: {data.empty}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Link Modal */}
        <LinkExamModal
          isOpen={showLinkModal}
          onClose={() => setShowLinkModal(false)}
          currentExam={track}
          availableExams={tracks.filter(t => 
            !t.linkedExamId && 
            t._id !== track._id && 
            t.examType !== track.examType
          )}
          onLink={async (linkedExamId) => {
            try {
              const updateData: TestTrackRequest = {
                examName: track.examName,
                examType: track.examType,
                subjects: track.subjects,
                linkedExamId
              };

              if (track.aytField) {
                updateData.aytField = track.aytField;
              }

              // İlk denemeyi güncelle
              await updateTestTrack(track._id, updateData);

              // Bağlanacak denemeyi bul
              const linkedExam = tracks.find(t => t._id === linkedExamId);
              if (linkedExam) {
                const linkedUpdateData: TestTrackRequest = {
                  examName: linkedExam.examName,
                  examType: linkedExam.examType,
                  subjects: linkedExam.subjects,
                  linkedExamId: track._id
                };

                if (linkedExam.aytField) {
                  linkedUpdateData.aytField = linkedExam.aytField;
                }

                // Bağlanan denemeyi güncelle
                await updateTestTrack(linkedExamId, linkedUpdateData);
              }

              // State'i güncelle
              setTracks(prevTracks => 
                prevTracks.map(t => 
                  t._id === track._id || t._id === linkedExamId
                    ? { ...t, linkedExamId: t._id === track._id ? linkedExamId : track._id }
                    : t
                )
              );

              toast.success('Denemeler başarıyla bağlandı');
            } catch (error) {
              toast.error('Denemeler bağlanırken bir hata oluştu');
            }
            setShowLinkModal(false);
          }}
        />
      </motion.div>
    );
  };

  // Animasyon varyantları
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };


  // Form bileşeni
  const AddTrackForm: React.FC = () => {
    // Yerel form state'i
    const [localFormData, setLocalFormData] = useState(formData);

    // Normal input değişikliklerinde sadece yerel state'i güncelle
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setLocalFormData(prev => ({
        ...prev,
        [name]: value
      }));
    };

    // Form gönderildiğinde ana state'i güncelle
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      
      const finalData: TestTrackRequest = {
        examName: localFormData.examName,
        examType: localFormData.examType,
        subjects: localFormData.subjects,
        ...(localFormData.aytField && { aytField: localFormData.aytField }),
        ...(localFormData.linkedExamId && { linkedExamId: localFormData.linkedExamId })
      };

      try {
        if (editingTrackId) {
          const response = await updateTestTrack(editingTrackId, finalData);
          setTracks(prevTracks => 
            prevTracks.map(track => 
              track._id === editingTrackId ? response.data : track
            )
          );
          toast.success('Deneme başarıyla güncellendi');
        } else {
          const response = await addTestTrack(finalData);
          setTracks(prevTracks => [...prevTracks, response.data]);
          toast.success('Deneme başarıyla eklendi');
        }
        setShowForm(false);
        setEditingTrackId(null);
        setFormData(initialFormState);
        setLocalFormData(initialFormState);
      } catch (error) {
        toast.error(editingTrackId ? 'Güncelleme başarısız' : 'Ekleme başarısız');
      }
    };

    // Ders sonuçları için input handler
    const handleSubjectInputChange = (
      subject: string,
      field: 'correct' | 'incorrect' | 'empty',
      value: number
    ) => {
      const maxQuestions = MAX_QUESTIONS[subject as keyof typeof MAX_QUESTIONS];
      const currentSubject = localFormData.subjects[subject] || { correct: 0, incorrect: 0, empty: 0 };
      
      // Negatif değerleri engelle
      if (value < 0) {
        return;
      }

      // Yeni değerleri hesapla
      const newValues = {
        correct: field === 'correct' ? value : currentSubject.correct,
        incorrect: field === 'incorrect' ? value : currentSubject.incorrect,
        empty: field === 'empty' ? value : currentSubject.empty
      };

      // Toplam soru sayısını hesapla
      const totalQuestions = newValues.correct + newValues.incorrect + newValues.empty;

      // Maksimum soru sayısını kontrol et
      if (totalQuestions > maxQuestions) {
        const currentTotal = currentSubject.correct + currentSubject.incorrect + currentSubject.empty;
        const remaining = maxQuestions - currentTotal;
        
        toast.error(
          `${subject} için kalan girilebilecek soru sayısı: ${remaining >= 0 ? remaining : 0}`
        );
        return;
      }

      // Değeri güncelle
      setLocalFormData(prev => ({
        ...prev,
        subjects: {
          ...prev.subjects,
          [subject]: newValues
        }
      }));
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Deneme Adı */}
        <div>
          <label className="block mb-2 font-medium">
            Deneme Adı <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="examName"
            value={localFormData.examName}
            onChange={handleInputChange}
            className={`w-full p-2 rounded border ${
              theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
            }`}
            required
            placeholder="Örn: TYT Deneme 1"
            disabled={!!editingTrackId}
          />
        </div>

        {/* Deneme Türü - Ana state'i güncelle */}
        <div>
          <label className="block mb-2 font-medium">
            Deneme Türü <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.examType}
            onChange={handleExamTypeChange}
            className={`w-full p-2 rounded border ${
              theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
            }`}
            required
            disabled={!!editingTrackId}
          >
            <option value="TYT">TYT</option>
            <option value="AYT">AYT</option>
          </select>
        </div>

        {/* AYT Alan Seçimi */}
        {examType === 'AYT' && (
          <div>
            <label className="block mb-2 font-medium">
              AYT Alanı <span className="text-red-500">*</span>
            </label>
            <select
              name="aytField"
              value={aytField || ''}
              onChange={handleAYTFieldChange}
              className={`w-full p-2 rounded border ${
                theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
              }`}
              required
            >
              <option value="">Alan Seçiniz</option>
              <option value="Sayısal">Sayısal</option>
              <option value="Sözel">Sözel</option>
              <option value="Eşit Ağırlık">Eşit Ağırlık</option>
              <option value="Yabancı Dil">Yabancı Dil</option>
            </select>
          </div>
        )}

        {/* Ders Sonuçları */}
        {availableSubjects.length > 0 && (
          <div>
            <label className="block mb-2 font-medium">Ders Sonuçları</label>
            <div className="space-y-4">
              {availableSubjects.map(subject => (
                <div 
                  key={subject}
                  className={`p-4 rounded-lg ${
                    theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                  }`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <div className="font-medium">{subject}</div>
                    <div className="text-sm text-gray-500">
                      Maksimum {MAX_QUESTIONS[subject as keyof typeof MAX_QUESTIONS]} soru
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm mb-1">Doğru</label>
                      <input
                        type="number"
                        min="0"
                        max={MAX_QUESTIONS[subject as keyof typeof MAX_QUESTIONS]}
                        value={localFormData.subjects[subject]?.correct || 0}
                        onChange={(e) => {
                          const value = parseInt(e.target.value) || 0;
                          handleSubjectInputChange(subject, 'correct', value);
                        }}
                        className={`w-full p-2 rounded border ${
                          theme === 'dark' ? 'bg-gray-600 border-gray-500' : 'bg-white border-gray-300'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-1">Yanlış</label>
                      <input
                        type="number"
                        min="0"
                        max={MAX_QUESTIONS[subject as keyof typeof MAX_QUESTIONS]}
                        value={localFormData.subjects[subject]?.incorrect || 0}
                        onChange={(e) => {
                          const value = parseInt(e.target.value) || 0;
                          handleSubjectInputChange(subject, 'incorrect', value);
                        }}
                        className={`w-full p-2 rounded border ${
                          theme === 'dark' ? 'bg-gray-600 border-gray-500' : 'bg-white border-gray-300'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-1">Boş</label>
                      <input
                        type="number"
                        min="0"
                        max={MAX_QUESTIONS[subject as keyof typeof MAX_QUESTIONS]}
                        value={localFormData.subjects[subject]?.empty || 0}
                        onChange={(e) => {
                          const value = parseInt(e.target.value) || 0;
                          handleSubjectInputChange(subject, 'empty', value);
                        }}
                        className={`w-full p-2 rounded border ${
                          theme === 'dark' ? 'bg-gray-600 border-gray-500' : 'bg-white border-gray-300'
                        }`}
                      />
                    </div>
                  </div>
                  <div className="mt-2 text-sm text-gray-500">
                    Toplam: {
                      (localFormData.subjects[subject]?.correct || 0) +
                      (localFormData.subjects[subject]?.incorrect || 0) +
                      (localFormData.subjects[subject]?.empty || 0)
                    } / {MAX_QUESTIONS[subject as keyof typeof MAX_QUESTIONS]}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Form butonları */}
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => {
              setShowForm(false);
              setEditingTrackId(null);
              setFormData(initialFormState);
            }}
            className="px-4 py-2 rounded bg-gray-500 text-white hover:bg-gray-600 transition-colors"
          >
            İptal
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition-colors"
          >
            {editingTrackId ? 'Güncelle' : 'Kaydet'}
          </button>
        </div>
      </form>
    );
  };

  // Test için yeni useEffect ekleyelim
  useEffect(() => {
    const testLinkedExams = async () => {
      try {
        const response = await getLinkedTestTracks();
        console.log('response', response.data);
        console.log('=== BAĞLI DENEMELER ===');
        response.data.forEach((pair, index) => {
          console.log(`\nBağlı Deneme Çifti #${index + 1}:`);
          console.log('TYT Deneme:', {
            Ad: pair.exam1.examName,
            Puan: pair.exam1.examScore,
            Tip: pair.exam1.examType
          });
          console.log('AYT Deneme:', {
            Ad: pair.exam2.examName,
            Puan: pair.exam2.examScore,
            Tip: pair.exam2.examType
          });
          console.log('Yerleştirme Puanı:', pair.finalScore);
          console.log('------------------------');
        });
      } catch (error) {
        console.error('Bağlı denemeler getirilemedi:', error);
      }
    };

    testLinkedExams();
  }, []);

  // Bağlı denemeleri grupla
  const renderGroupedTracks = () => {
    const renderedTrackIds = new Set();
    
    return tracks.map(track => {
      // Eğer bu deneme zaten render edildiyse atla
      if (renderedTrackIds.has(track._id)) return null;

      const linkedPair = linkedResponse?.data.find(pair => 
        pair.exam1._id === track._id || pair.exam2._id === track._id
      );

      if (linkedPair) {
        // Her iki denemeyi de render edildi olarak işaretle
        renderedTrackIds.add(linkedPair.exam1._id);
        renderedTrackIds.add(linkedPair.exam2._id);

        // Bağlı denemeleri grup olarak render et
        return (
          <motion.div 
            key={track._id}
            className={`border-2 border-purple-500 rounded-lg mb-4 overflow-hidden ${
              openTrackId === linkedPair.exam1._id || openTrackId === linkedPair.exam2._id
                ? 'pb-4'
                : ''
            }`}
          >
            <TrackCard track={linkedPair.exam1} />
            <TrackCard track={linkedPair.exam2} />
          </motion.div>
        );
      } else if (!renderedTrackIds.has(track._id)) {
        // Bağlı olmayan denemeyi tekil olarak render et
        renderedTrackIds.add(track._id);
        return <TrackCard key={track._id} track={track} />;
      }
    }).filter(Boolean); // null değerleri filtrele
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <motion.div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Deneme Takibi</h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddNew}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              theme === 'dark'
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-blue-500 hover:bg-blue-600'
            } text-white transition-colors duration-300`}
          >
            {showForm ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            {showForm ? 'İptal' : 'Yeni Deneme Ekle'}
          </motion.button>
        </div>

        {/* Form */}
        <AnimatePresence>
          {showForm && <AddTrackForm />}
        </AnimatePresence>

        {/* Deneme listesi */}
        <motion.div variants={containerVariants}>
          {renderGroupedTracks()}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default TestTrackPage;
