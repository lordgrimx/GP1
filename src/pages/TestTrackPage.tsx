import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getTestTracks, addTestTrack, updateTestTrack, getSubjectNames } from '../api/api';
import { PencilIcon } from '@heroicons/react/24/solid';

interface TestTrack {
  _id: string;
  examName: string;
  examType: string;
  subjects: {
    [key: string]: {
      correct: number;
      incorrect: number;
      empty: number;
    };
  };
}

const TestTrackPage: React.FC = () => {
  const [testTracks, setTestTracks] = useState<TestTrack[]>([]);
  const [examName, setExamName] = useState('');
  const [subjects, setSubjects] = useState<{ [key: string]: { correct: number; incorrect: number; empty: number } }>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState<string>('');
  const [otherExamName, setOtherExamName] = useState<string>('');
  const [examType, setExamType] = useState<string>('');
  const [subjectList, setSubjectList] = useState<string[]>([]);
  const [processedSubjects, setProcessedSubjects] = useState<string[]>([]);
  const [subjectQuestionCounts, setSubjectQuestionCounts] = useState<{ [key: string]: number }>({});

  const denemeListesi = [
    "3D Yayınları Denemeleri",
    "Limit Yayınları Denemeleri",
    "Palme Yayınları Denemeleri",
    "Apotemi Denemeleri",
    "Okyanus Yayınları Denemeleri",
    "Endemik Yayınları Denemeleri",
    "Çap Yayınları Denemeleri",
    "Bilgi Sarmal Denemeleri",
    "Aydın Yayınları Denemeleri",
    "Karekök Yayınları Denemeleri",
    "Final Yayınları Denemeleri",
    "Hız ve Renk Denemeleri",
    "Rehber Matematik Denemeleri",
    "Eksen Yayınları Denemeleri",
    "FDD Yayınları Denemeleri",
    "Tonguç Akademi Denemeleri",
    "Yediiklim Yayınları Denemeleri",
    "Paraf Yayınları Denemeleri",
    "Sınav Yayınları Denemeleri",
    "Fen Bilimleri Yayınları Denemeleri",
    "Nesibe Aydın Yayınları Denemeleri",
    "Örnek Akademi Denemeleri",
    "Yaylı Yayınları Denemeleri",
    "Zambak Yayınları Denemeleri",
    "Delta Yayınları Denemeleri",
    "Kültür Yayınları Denemeleri",
    "Esen Yayınları Denemeleri",
    "Üç Dört Beş Yayınları Denemeleri",
    "Kronometre Yayınları Denemeleri",
    "TATS Denemeleri (Tonguç Akıllı Takip Sistemi)",
    "Other",
  ];
  const questionNumber: { [key: string]: number } = {
    TYTTürkçe: 40,
    Matematik: 40,
    'Fen Bilgisi': 20,
    Tarih: 5,
    Coğrafya: 5,
    Felsefe: 5,
    'Din Kültürü ve Ahlak Bilgisi': 5,
  };

  const examTypes = [
    { value: 'TYT', label: 'TYT' },
    { value: 'AYT', label: 'AYT' },
  ];

  useEffect(() => {
    const fetchTestTracks = async () => {
      const response = await getTestTracks();
      setTestTracks(response.data);
    };
    

    const fetchSubjectNames = async () => {
      try {
        const response = await getSubjectNames();
        console.log('Fetched subject names:', response.data);
        setSubjectList(response.data); // Ders adlarını ayarla
      } catch (error) {
        console.error('Error fetching subject names:', error);
      }
    };

    fetchTestTracks();
    fetchSubjectNames();
  }, []);



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // Ders isimlerini ve eksik değerleri işlemek
    const completedSubjects = Object.keys(subjects).reduce((acc, subject) => {
      // "TYT" önekini kaldır
      let newSubject = subject.replace('TYT ', '');
  
      // Türkçe
      if (newSubject === 'Türkçe') {
        acc['Türkçe'] = {
          correct: subjects[subject]?.correct || 0,
          incorrect: subjects[subject]?.incorrect || 0,
          empty: subjects[subject]?.empty || 0,
        };
      }
  
      // Matematik ve Geometri birleştirilir
      if (['Matematik', 'Geometri'].includes(newSubject)) {
        acc['Matematik'] = acc['Matematik'] || { correct: 0, incorrect: 0, empty: 0 };
        acc['Matematik'].correct += subjects[subject]?.correct || 0;
        acc['Matematik'].incorrect += subjects[subject]?.incorrect || 0;
        acc['Matematik'].empty += subjects[subject]?.empty || 0;
      }
  
      // Fen Bilgisi (Fizik + Kimya + Biyoloji) birleştirilir
      if (['Fizik', 'Kimya', 'Biyoloji'].includes(newSubject)) {
        acc['Fen Bilgisi'] = acc['Fen Bilgisi'] || { correct: 0, incorrect: 0, empty: 0 };
        acc['Fen Bilgisi'].correct += subjects[subject]?.correct || 0;
        acc['Fen Bilgisi'].incorrect += subjects[subject]?.incorrect || 0;
        acc['Fen Bilgisi'].empty += subjects[subject]?.empty || 0;
      }
  
      // Diğer dersler eklenir
      if (!['Matematik', 'Geometri', 'Fizik', 'Kimya', 'Biyoloji', 'Türkçe'].includes(newSubject)) {
        acc[newSubject] = {
          correct: subjects[subject]?.correct || 0,
          incorrect: subjects[subject]?.incorrect || 0,
          empty: subjects[subject]?.empty || 0,
        };
      }
  
      return acc;
    }, {} as { [key: string]: { correct: number; incorrect: number; empty: number } });
  
    console.log('İşlenmiş ve tamamlanmış ders isimleri ve değerler:', completedSubjects);
  
    for (const [subject, { correct, incorrect, empty }] of Object.entries(completedSubjects)) {
      const totalCount = correct + incorrect + empty;
  
      if (totalCount > questionNumber[subject]) {
        alert(
          `${subject} için toplam soru sayısı (${totalCount}), beklenen soru sayısını (${questionNumber[subject]}) aşıyor.`
        );
        return;
      }
  
      if (correct < 0 || incorrect < 0 || empty < 0) {
        alert('Doğru, yanlış veya boş soru sayısı negatif olamaz');
        return;
      }
    }
  
    const data = {
      examName: selectedExam === 'Other' ? otherExamName : selectedExam,
      examType,
      subjects: completedSubjects, // Tamamlanmış subjects kullanılıyor
    };
  
    try {
      if (editingId) {
        await updateTestTrack(editingId, data);
        alert('Deneme başarıyla güncellendi.');
      } else {
        await addTestTrack(data);
        alert('Deneme başarıyla eklendi.');
      }
  
      setExamName('');
      setSubjects({});
      setEditingId(null);
      setIsModalOpen(false);
  
      const response = await getTestTracks();
      setTestTracks(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Axios error:', error.response?.data || error.message);
        alert(error.response?.data?.message || 'Deneme kaydedilirken bir hata oluştu.');
      } else if (error instanceof Error) {
        console.error('Genel hata:', error.message);
        alert('Deneme kaydedilirken bir hata oluştu: ' + error.message);
      } else {
        console.error('Bilinmeyen hata:', error);
        alert('Bilinmeyen bir hata oluştu.');
      }
    }
  };
  

  const handleEdit = (track: TestTrack) => {
    setExamName(track.examName);
    setSubjects(track.subjects);
    setExamType(track.examType);
    setEditingId(track._id);
    setIsModalOpen(true);
  };

  const handleSubjectChange = (subject: string, field: 'correct' | 'incorrect' | 'empty', value: number) => {
    setSubjects((prev) => ({
      ...prev,
      [subject]: {
        ...prev[subject],
        [field]: value,
      },
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Sınav Net Takip</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-green-500 text-white p-2 rounded transition-transform transform hover:scale-105 hover:shadow-lg"
        >
          Add Deneme Sınavı
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">{editingId ? 'Düzenle' : 'Ekle'}</h2>
            <form onSubmit={handleSubmit}>
              <label htmlFor="examName" className="block mb-2">
                Deneme Sınavı Adı:
              </label>
              <select
                id="examName"
                value={selectedExam}
                onChange={(e) => {
                  setSelectedExam(e.target.value);
                  if (e.target.value !== 'Other') {
                    setOtherExamName('');
                  }
                }}
                className="border p-2 mb-2 w-full rounded"
              >
                <option value="">Seçiniz</option>
                {denemeListesi.map((deneme) => (
                  <option key={deneme} value={deneme}>
                    {deneme}
                  </option>
                ))}
              </select>
              {selectedExam === 'Other' && (
                <input
                  type="text"
                  value={otherExamName}
                  onChange={(e) => setOtherExamName(e.target.value)}
                  placeholder="Diğer deneme adı"
                  className="border p-2 mb-2 w-full rounded"
                />
              )}

              <label htmlFor="examType" className="block mb-2">
                Deneme Türü:
              </label>
              <select
                id="examType"
                value={examType}
                onChange={(e) => setExamType(e.target.value)}
                className="border p-2 mb-2 w-full rounded"
              >
                {examTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>

              <label className="block mb-2">Dersler:</label>
              <div className="flex mb-2 items-center justify-between">
                <span className="mr-2 w-1/2 text-left"></span>
                <div className="flex space-x-2 w-1/2 justify-end">
                  <span className="text-sm">Doğru</span>
                  <span className="text-sm">Yanlış</span>
                  <span className="text-sm">Boş</span>
                </div>
              </div>
              {subjectList.map((subject) => (
                <div key={subject} className="flex mb-2 items-center justify-between">
                  <span className="mr-2 w-1/2 text-left">{subject}:</span>
                  <div className="flex space-x-2 w-1/2 justify-end">
                    <input
                      type="number"
                      value={subjects[subject]?.correct || 0}
                      onChange={(e) => handleSubjectChange(subject, 'correct', Number(e.target.value))}
                      className="border p-1 rounded w-16"
                    />
                    <input
                      type="number"
                      value={subjects[subject]?.incorrect || 0}
                      onChange={(e) => handleSubjectChange(subject, 'incorrect', Number(e.target.value))}
                      className="border p-1 rounded w-16"
                    />
                    <input
                      type="number"
                      value={subjects[subject]?.empty || 0}
                      onChange={(e) => handleSubjectChange(subject, 'empty', Number(e.target.value))}
                      className="border p-1 rounded w-16"
                    />
                  </div>
                </div>
              ))}
              <div className="flex justify-end mt-4">
                <button type="submit" className="bg-blue-500 text-white p-2 rounded mr-2">
                  {editingId ? 'Güncelle' : 'Ekle'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-red-500 text-white p-2 rounded"
                >
                  Kapat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <table className="min-w-full bg-white border border-gray-300 mt-4">
        <thead>
          <tr className="bg-gray-200">
            <th className="py-2 px-4 border">Deneme Adı</th>
            <th className="py-2 px-4 border">Deneme Türü</th>
            <th className="py-2 px-4 border">Dersler</th>
            <th className="py-2 px-4 border">İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {testTracks.map((track) => (
            <tr key={track._id} className="hover:bg-gray-100">
              <td className="py-2 px-4 border">{track.examName}</td>
              <td className="py-2 px-4 border">{track.examType}</td>
              <td className="py-2 px-4 border">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="py-1 px-2 border">Ders</th>
                      <th className="py-1 px-2 border">Doğru</th>
                      <th className="py-1 px-2 border">Yanlış</th>
                      <th className="py-1 px-2 border">Boş</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(track.subjects).map(([subject, data]) => (
                      <tr key={subject}>
                        <td className="py-1 px-2 border">{subject}</td>
                        <td className="py-1 px-2 border">{data.correct}</td>
                        <td className="py-1 px-2 border">{data.incorrect}</td>
                        <td className="py-1 px-2 border">{data.empty}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </td>
              <td className="py-2 px-4 border">
                <button onClick={() => handleEdit(track)} className="flex items-center text-blue-500">
                  <PencilIcon className="h-5 w-5 mr-1" />
                  Düzenle
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TestTrackPage;
