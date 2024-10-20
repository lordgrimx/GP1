import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface Subject {
  id: string;
  name: string;
  topics: string[];
}

const subjects: Subject[] = [
  {
    id: '1',
    name: 'Matematik',
    topics: ['Temel Kavramlar', 'Sayılar', 'Cebir', 'Geometri', 'Trigonometri'],
  },
  {
    id: '2',
    name: 'Fizik',
    topics: ['Mekanik', 'Elektrik', 'Optik', 'Modern Fizik'],
  },
  {
    id: '3',
    name: 'Kimya',
    topics: ['Atomun Yapısı', 'Periyodik Sistem', 'Kimyasal Bağlar', 'Kimyasal Tepkimeler'],
  },
];

const SubjectExplanation: React.FC = () => {
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [explanation, setExplanation] = useState<string>('');

  const handleSubjectChange = (subjectId: string) => {
    setSelectedSubject(subjectId);
    setSelectedTopic(null);
    setExplanation('');
  };

  const handleTopicChange = (topic: string) => {
    setSelectedTopic(topic);
    // TODO: Fetch explanation from backend
    setExplanation(`Bu, ${topic} konusunun açıklamasıdır. Gerçek bir backend bağlantısı kurulduğunda, buraya detaylı bir açıklama gelecektir.`);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Konu Açıklamaları</h2>
      <div className="space-y-4">
        {subjects.map((subject) => (
          <div key={subject.id} className="border rounded-lg overflow-hidden">
            <button
              className="w-full px-4 py-2 bg-blue-500 text-white flex justify-between items-center"
              onClick={() => handleSubjectChange(subject.id)}
            >
              <span>{subject.name}</span>
              {selectedSubject === subject.id ? <ChevronUp /> : <ChevronDown />}
            </button>
            {selectedSubject === subject.id && (
              <div className="p-4 bg-white">
                {subject.topics.map((topic) => (
                  <button
                    key={topic}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    onClick={() => handleTopicChange(topic)}
                  >
                    {topic}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      {selectedTopic && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-2">{selectedTopic}</h3>
          <p>{explanation}</p>
        </div>
      )}
    </div>
  );
};

export default SubjectExplanation;