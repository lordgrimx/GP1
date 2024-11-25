import React, { useState, useEffect } from 'react';
import { getSubjects } from '../api/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { ChevronDown } from 'lucide-react';

interface Subject {
  _id: string;
  Lesson: string;
  questionNumber: number;
  Subjects: { [key: string]: string | { zorlukDerecesi: string; türler: { [key: string]: string } } };
}

const SubjectsPage: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openSubjectId, setOpenSubjectId] = useState<string | null>(null);
  const [knowledgeLevel, setKnowledgeLevel] = useState<{ [key: string]: number }>({});
  const [showSlider, setShowSlider] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await getSubjects();
        setSubjects(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load subjects');
        setLoading(false);
      }
    };

    fetchSubjects();
  }, []);

  const toggleSubject = (id: string) => {
    setOpenSubjectId(openSubjectId === id ? null : id);
    setShowSlider(null);
  };

  const handleKnowledgeChange = (topic: string, value: number) => {
    setKnowledgeLevel({ ...knowledgeLevel, [topic]: value });
  };

  const handleSliderToggle = (topic: string) => {
    if (showSlider === topic) {
      setShowSlider(null);
    } else {
      setShowSlider(topic);
      setSelectedTopic(topic);
    }
  };

  const handleExplain = () => {
    if (selectedTopic) {
      const knowledge = knowledgeLevel[selectedTopic] || 0;
      const prompt = `Lütfen "${selectedTopic}" konusunu ${knowledge}% bilgi seviyesinde bir lise öğrencisine anlatın.`;
      console.log(prompt);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">YKS Subjects</h1>
      <div className="flex flex-col gap-4">
        {subjects.map((subject) => (
          <div key={subject._id} className="bg-white p-6 rounded-lg shadow-md mb-4">
            <div
              className="flex justify-between items-center cursor-pointer hover:bg-gray-50 p-4"
              onClick={() => toggleSubject(subject._id)}
            >
              <h2 className="text-xl font-semibold w-full">{subject.Lesson}</h2>
              <ChevronDown className={`transition-transform ${openSubjectId === subject._id ? 'rotate-180' : ''}`} />
            </div>
            {openSubjectId === subject._id && (
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(subject.Subjects).map(([topic, value]) => (
                  <div key={topic} className="flex flex-col text-gray-600 p-2 border-b">
                    <div className="flex justify-between items-center">
                      <span>{topic}</span>
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full ${typeof value === 'string' ? (value === 'Kolay' ? 'bg-green-500' : value === 'Orta' ? 'bg-yellow-500' : 'bg-red-500') : 'bg-gray-500'}`}></div>
                        <button
                          className="ml-2 text-blue-500"
                          onClick={() => handleSliderToggle(topic)}
                        >
                          Konu Anlatımı
                        </button>
                      </div>
                    </div>
                    {showSlider === topic && (
                      <div className="mt-2">
                        <h3 className="text-lg">Bu konuya ne kadar hakimsin?</h3>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={knowledgeLevel[topic] || 0}
                          onChange={(e) => handleKnowledgeChange(topic, Number(e.target.value))}
                          className="w-full"
                        />
                        <span>{knowledgeLevel[topic] || 0}%</span>
                        <div className="flex justify-end mt-2">
                          <button
                            className="bg-blue-500 text-white py-1 px-3 rounded"
                            onClick={handleExplain}
                          >
                            Açıklama Oluştur
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubjectsPage;
